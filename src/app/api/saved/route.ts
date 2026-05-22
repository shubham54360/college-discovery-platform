import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET: Fetch saved colleges for current authenticated user
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const saved = await db.savedCollege.findMany({
      where: { userId: user.id },
      include: {
        college: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ savedColleges: saved.map((s) => s.college) });
  } catch (error) {
    console.error('API /saved GET error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Toggle saved college status (bookmark / un-bookmark)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { collegeId } = await request.json();
    if (!collegeId) {
      return NextResponse.json(
        { error: 'Missing required field: collegeId' },
        { status: 400 }
      );
    }

    // Verify college exists
    const college = await db.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      );
    }

    // Check if relationship already exists
    const existing = await db.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: user.id,
          collegeId: collegeId,
        },
      },
    });

    if (existing) {
      // Unsave
      await db.savedCollege.delete({
        where: {
          id: existing.id,
        },
      });
      return NextResponse.json({ saved: false, message: 'College removed from bookmarks' });
    } else {
      // Save
      await db.savedCollege.create({
        data: {
          userId: user.id,
          collegeId: collegeId,
        },
      });
      return NextResponse.json({ saved: true, message: 'College added to bookmarks' });
    }
  } catch (error) {
    console.error('API /saved POST error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
