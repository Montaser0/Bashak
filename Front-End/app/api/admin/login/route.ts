import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // هنا التعديل المهم

export async function POST(req: Request) {
  const { email, password } = await req.json();
  
  // نستخدم pool بدلاً من connection
  const [rows]: any = await pool.execute(
    'SELECT * FROM users WHERE email = ? AND password = ?', 
    [email, password]
  );

  if (rows.length > 0) {
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
}