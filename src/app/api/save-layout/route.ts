import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Make sure this is your actual pg pool instance

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, layout } = body;

    if (!email || !layout) {
      return NextResponse.json({ error: 'Email and layout required' }, { status: 400 });
    }

    const client = await pool.connect();

    await client.query(
      `
      INSERT INTO user_layouts (email, layout)
      VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE
      SET layout = EXCLUDED.layout
      `,
      [email, JSON.stringify(layout)]
    );

    client.release();

    return NextResponse.json({ message: 'Layout saved successfully' });
  } catch (error) {
    console.error('Save layout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
