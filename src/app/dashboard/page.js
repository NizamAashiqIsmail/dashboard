'use client';

import React, { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';
import styles from './dashboard.module.css';

import Clock from '@/components/Clock';
import TodoList from '@/components/TodoList';
import CalendarWidget from '@/components/CalendarWidget';
import Quote from '@/components/Quote';
import SlideshowWidget from '@/components/slidshow';

const initialWidgets = [
  { id: 'clock', x: 20, y: 60, width: 300, height: 250 },
  { id: 'Todo List', x: 360, y: 60, width: 300, height: 280 },
  { id: 'calendar', x: 700, y: 60, width: 300, height: 300 },
  { id: 'quote', x: 1040, y: 60, width: 300, height: 250 },
  { id: 'slideshow', x: 1380, y: 60, width: 300, height: 250 }
];

const Dashboard = () => {
  const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState(initialWidgets);
  const widgetRefs = useRef({});

  const toggleEditMode = () => setEditMode(prev => !prev);

  useEffect(() => {
    const resolveOverlapCircular = (movingEl, movingId) => {
      const movingRect = movingEl.getBoundingClientRect();
      const centerX = movingRect.left + movingRect.width / 2;
      const centerY = movingRect.top + movingRect.height / 2;

      widgets.forEach(widget => {
        if (widget.id === movingId) return;

        const el = widgetRefs.current[widget.id];
        const rect = el.getBoundingClientRect();

        const overlapX = Math.max(0, Math.min(movingRect.right, rect.right) - Math.max(movingRect.left, rect.left));
        const overlapY = Math.max(0, Math.min(movingRect.bottom, rect.bottom) - Math.max(movingRect.top, rect.top));

        if (overlapX > 50 && overlapY > 50) {
          const targetCenterX = rect.left + rect.width / 2;
          const targetCenterY = rect.top + rect.height / 2;

          const dx = targetCenterX - centerX;
          const dy = targetCenterY - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          const normX = dx / distance;
          const normY = dy / distance;

          const rotatedX = normY;
          const rotatedY = -normX;

          const currentX = parseFloat(el.getAttribute('data-x')) || 0;
          const currentY = parseFloat(el.getAttribute('data-y')) || 0;

          const offset = 100;
          const newX = currentX + rotatedX * offset;
          const newY = currentY + rotatedY * offset;

          el.style.transform = `translate(${newX}px, ${newY}px)`;
          el.setAttribute('data-x', newX);
          el.setAttribute('data-y', newY);
        }
      });
    };

    widgets.forEach(widget => {
      const el = widgetRefs.current[widget.id];
      if (!el) return;

      interact(el).unset();

      if (editMode) {
        interact(el)
          .draggable({
            modifiers: [
              interact.modifiers.restrictRect({ restriction: 'parent', endOnly: true })
            ],
            listeners: {
              move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
                resolveOverlapCircular(target, widget.id);
              }
            }
          })
          .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
              move(event) {
                const target = event.target;
                let x = parseFloat(target.getAttribute('data-x')) || 0;
                let y = parseFloat(target.getAttribute('data-y')) || 0;

                target.style.width = `${event.rect.width}px`;
                target.style.height = `${event.rect.height}px`;

                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
              }
            },
            modifiers: [
              interact.modifiers.restrictSize({ min: { width: 200, height: 150 } })
            ]
          });
      }
    });
  }, [editMode, widgets]);

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
    <div className={styles.dashboardContainer}>
      <div className={styles.topBar}>
        <h1 className={styles.heading}>Dashboard</h1>
        <div
          className={`${styles.toggleSwitch} ${editMode ? styles.active : ''}`}
          onClick={toggleEditMode}
        >
          <div className={styles.circle}></div>
        </div>
      </div>

      {widgets.map(widget => (
        <div
          key={widget.id}
          ref={el => (widgetRefs.current[widget.id] = el)}
          className={styles.widget}
          style={{
            width: widget.width,
            height: widget.height,
            transform: `translate(${widget.x}px, ${widget.y}px)`
          }}
          data-x={widget.x}
          data-y={widget.y}
        >
          <h2>{widget.id.toUpperCase()}</h2>
          {renderWidgetContent(widget.id)}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
