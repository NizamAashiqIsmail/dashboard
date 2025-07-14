"use client";

import React, { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';
import styles from './dashboard.module.css';
import { useSession } from 'next-auth/react';

import Clock from '@/components/Clock';
import TodoList from '@/components/TodoList';
import CalendarWidget from '@/components/CalendarWidget';
import Quote from '@/components/Quote';
import SlideshowWidget from '@/components/slidshow';

const DEFAULT_WIDGET_SIZE = { width: 380, height: 360 };
const WIDGET_SPACING = 80;
const TOP_BAR_HEIGHT = 160; // top bar height

const availableWidgets = [
  { id: 'clock' },
  { id: 'Todo List' },
  { id: 'calendar' },
  { id: 'quote' },
  { id: 'slideshow' },
];

const Dashboard = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [editMode, setEditMode] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [showWidgetPanel, setShowWidgetPanel] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [showAlignmentPopup, setShowAlignmentPopup] = useState(false);
  const [fixedWidgetIds, setFixedWidgetIds] = useState([]);
  const [alignmentMode, setAlignmentMode] = useState(null);

  const widgetRefs = useRef({});
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchLayout = async () => {
      if (!userEmail) return;
      try {
        const res = await fetch(`/api/get-layout?email=${userEmail}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.layout) {
            const enriched = data.layout.map(saved => ({
              id: saved.id,
              x: saved.x,
              y: saved.y,
              width: saved.width || DEFAULT_WIDGET_SIZE.width,
              height: saved.height || DEFAULT_WIDGET_SIZE.height
            }));
            setWidgets(enriched);
          }
        }
      } catch (error) {
        console.error('Error fetching layout:', error);
      }
    };
    fetchLayout();
  }, [userEmail]);

  useEffect(() => {
    if (!editMode) return;

    widgets.forEach((widget) => {
      const el = widgetRefs.current[widget.id];
      if (!el || fixedWidgetIds.includes(widget.id)) return;

      interact(el).unset();

      interact(el)
        .draggable({
          inertia: true,
          modifiers: [
            interact.modifiers.restrictRect({ restriction: containerRef, endOnly: true })
          ],
          listeners: {
            move(event) {
              const target = event.target;
              let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
              let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
              y = Math.max(y, TOP_BAR_HEIGHT + 10);
              target.style.transform = `translate(${x}px, ${y}px)`;
              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);
            },
            end(event) {
              const target = event.target;
              const id = target.getAttribute('data-id');
              const x = parseFloat(target.getAttribute('data-x')) || 0;
              const y = parseFloat(target.getAttribute('data-y')) || 0;
              setWidgets(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
            }
          }
        })
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          inertia: true,
          modifiers: [
            interact.modifiers.restrictSize({ min: { width: 300, height: 240 } }),
            interact.modifiers.restrictEdges({ outer: containerRef })
          ],
          listeners: {
            move(event) {
              const target = event.target;
              let x = parseFloat(target.getAttribute('data-x')) || 0;
              let y = parseFloat(target.getAttribute('data-y')) || 0;
              x += event.deltaRect.left;
              y += event.deltaRect.top;
              y = Math.max(y, TOP_BAR_HEIGHT + 10);
              const width = event.rect.width;
              const height = event.rect.height;
              target.style.width = `${width}px`;
              target.style.height = `${height}px`;
              target.style.transform = `translate(${x}px, ${y}px)`;
              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);
            },
            end(event) {
              const target = event.target;
              const id = target.getAttribute('data-id');
              const x = parseFloat(target.getAttribute('data-x')) || 0;
              const y = parseFloat(target.getAttribute('data-y')) || 0;
              const width = parseFloat(target.style.width);
              const height = parseFloat(target.style.height);
              setWidgets(prev => prev.map(w => w.id === id ? { ...w, x, y, width, height } : w));
            }
          }
        });
    });
  }, [editMode, widgets, fixedWidgetIds]);

  const isOverlapping = (a, b) => {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  };

  const alignWidgetsToGrid = () => {
    const container = containerRef.current;
    if (!container) return widgets;

    const padding = WIDGET_SPACING;
    const containerWidth = container.offsetWidth - padding;
    let currentX = padding;
    let currentY = TOP_BAR_HEIGHT + padding;
    let maxHeightInRow = 0;

    const fixed = widgets.filter(w => fixedWidgetIds.includes(w.id));
    const movable = widgets.filter(w => !fixedWidgetIds.includes(w.id));

    const placedWidgets = [...fixed];

    const newMovable = movable.map(widget => {
      while (true) {
        if (currentX + widget.width > containerWidth) {
          currentX = padding;
          currentY += maxHeightInRow + padding;
          maxHeightInRow = 0;
        }

        const candidate = { ...widget, x: currentX, y: currentY };
        const overlap = placedWidgets.some(w => isOverlapping(candidate, w));

        if (!overlap) break;

        currentX += padding;
      }

      const x = currentX;
      const y = currentY;
      currentX += widget.width + padding;
      maxHeightInRow = Math.max(maxHeightInRow, widget.height);

      const placed = { ...widget, x, y };
      placedWidgets.push(placed);
      return placed;
    });

    const updatedLayout = [...fixed, ...newMovable];
    setWidgets(updatedLayout);
    return updatedLayout;
  };

  const saveLayoutToServer = async (layout) => {
    if (userEmail) {
      await fetch('/api/save-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, layout }),
      });
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      setShowAlignmentPopup(true);
    } else {
      setEditMode(true);
    }
  };

  const toggleRemoveMode = () => setRemoveMode(prev => !prev);

  const handleRemoveWidget = (id) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const handleWidgetAdd = (id) => {
    if (widgets.find(w => w.id === id)) return;
    const container = containerRef.current;
    const padding = WIDGET_SPACING;
    const containerWidth = container?.offsetWidth || window.innerWidth;

    let x = padding;
    let y = TOP_BAR_HEIGHT + padding;

    if (widgets.length > 0) {
      const last = widgets[widgets.length - 1];
      x = last.x + last.width + padding;
      y = last.y;
      if (x + DEFAULT_WIDGET_SIZE.width > containerWidth) {
        x = padding;
        y = last.y + last.height + padding;
      }
    }

    setWidgets([...widgets, { id, ...DEFAULT_WIDGET_SIZE, x, y }]);
  };

  const renderWidgetContent = (id) => {
    switch (id) {
      case 'clock': return <Clock />;
      case 'Todo List': return <TodoList />;
      case 'calendar': return <CalendarWidget />;
      case 'quote': return <Quote />;
      case 'slideshow': return <SlideshowWidget />;
      default: return null;
    }
  };

  return (
    <div className={styles.dashboardContainer} ref={containerRef}>
      <div className={styles.topBar}>
        <h1 className={styles.heading}>Dashboard</h1>
        <div className={styles.radioButtons}>
        <div className={styles.buttonWithLabel}>
          <span className={styles.labelText}>Remove</span>
          <div className={`${styles.radioBtn} ${removeMode ? styles.red : styles.inactive}`} onClick={toggleRemoveMode} style={{ borderColor: 'red' }} />
        </div>
      <div className={styles.buttonWithLabel}>
        <span className={styles.labelText}>Add</span>
        <div className={`${styles.radioBtn} ${showWidgetPanel ? styles.green : styles.inactive}`} onClick={() => setShowWidgetPanel(prev => !prev)} style={{ borderColor: 'green' }} />
      </div>
      <div className={styles.buttonWithLabel}>
        <span className={styles.labelText}>{editMode ? 'On' : 'Off'}</span>
         <div className={`${styles.toggleSwitch} ${editMode ? styles.active : ''}`} onClick={toggleEditMode}>
      <div className={styles.circle}></div>
    </div>
   </div>
   </div>

      </div>
    {removeMode && (
      <div className={styles.removeHint}>Turn on the toggle and Double tap on the widget you like to remove
      </div>
    )}
    {alignmentMode === 'selecting' && (
    <div className={styles.alignHint}>Double tap on the widget to select</div>
    )}
    {showWidgetPanel && (
        <div className={styles.widgetPanel}>
          <div className={styles.panelHeader}>
            <h3>Available Widgets</h3>
            <button onClick={() => setShowWidgetPanel(false)}>✕</button>
          </div>
          <div className={styles.widgetList}>
            {availableWidgets.map((widget) => (
              <div key={widget.id} className={styles.widgetOption} onClick={() => handleWidgetAdd(widget.id)}>
                {widget.id}
              </div>
            ))}
          </div>
        </div>
      )}
      {showAlignmentPopup && (
        <div className={styles.alignmentPopup}>
          <div className={styles.popupContent}>
            <h2>Widget Alignment Options</h2>
            <p>Would you like to fix some widgets in place?</p>
            <div className={styles.popupButtons}>
              <button onClick={() => {
                const updated = alignWidgetsToGrid();
                saveLayoutToServer(updated);
                setEditMode(false);
                setShowAlignmentPopup(false);
              }}>No specific alignment</button>
              <button onClick={() => {
                setAlignmentMode('selecting');
                setShowAlignmentPopup(false);
              }}>Select specific widgets to fix</button>
            </div>
          </div>
        </div>
      )}
      {alignmentMode === 'selecting' && (
        <button className={styles.doneBtn} onClick={() => {
          const updated = alignWidgetsToGrid();
          saveLayoutToServer(updated);
          setFixedWidgetIds([]);
          setAlignmentMode(null);
          setEditMode(false);
        }}>Done</button>
      )}
      {widgets.map((widget) => (
        <div
          key={widget.id}
          ref={(el) => {
            if (el) {
              el.setAttribute('data-id', widget.id);
              el.setAttribute('data-x', widget.x);
              el.setAttribute('data-y', widget.y);
              el.style.width = `${widget.width}px`;
              el.style.height = `${widget.height}px`;
              el.style.transform = `translate(${widget.x}px, ${widget.y}px)`;
            }
            widgetRefs.current[widget.id] = el;
          }}
          className={`${styles.widget} ${fixedWidgetIds.includes(widget.id) ? styles.fixed : ''} ${alignmentMode === 'selecting' && fixedWidgetIds.includes(widget.id) ? styles.vibrate : ''}`}
          style={{
            position: 'absolute',
            pointerEvents: editMode ? 'auto' : 'none',
          }}
          onDoubleClick={() => {
            if (removeMode) return handleRemoveWidget(widget.id);
            if (alignmentMode === 'selecting') {
              setFixedWidgetIds(prev =>
                prev.includes(widget.id)
                  ? prev.filter(id => id !== widget.id)
                  : [...prev, widget.id]
              );
            }
          }}
        >
          <h2>{widget.id.toUpperCase()}</h2>
          {renderWidgetContent(widget.id)}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
