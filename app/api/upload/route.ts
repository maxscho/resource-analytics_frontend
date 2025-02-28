// app/api/upload/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  // Process the file (e.g., save it, analyze it, etc.)
  return NextResponse.json({ message: 'File uploaded successfully' });
}