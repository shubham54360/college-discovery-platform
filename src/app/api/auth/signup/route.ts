import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields (name, email, password)' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    // Create user
    const passwordHash = hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    // Generate token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Set cookie
    await setSessionCookie(token);

    return NextResponse.json(
      {
        message: 'Signup successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
