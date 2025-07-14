import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Make sure this points to your pg Pool instance

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const client = await pool.connect();

    const result = await client.query(
      'SELECT layout FROM user_layouts WHERE email = $1',
      [email]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ layout: null }); 
    }

    return NextResponse.json({ layout: result.rows[0].layout });
  } catch (error) {
    console.error('Get layout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
