import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { collegeId, rating, comment } = await request.json();

    if (!collegeId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields (collegeId, rating, comment)' },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
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

    // Create review
    const review = await db.review.create({
      data: {
        rating: numericRating,
        comment,
        collegeId,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Recalculate average rating for the college
    const allReviews = await db.review.findMany({
      where: { collegeId },
      select: { rating: true },
    });

    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    // Update college average rating, rounding to 1 decimal place
    const roundedRating = Math.round(averageRating * 10) / 10;
    await db.college.update({
      where: { id: collegeId },
      data: {
        ratings: roundedRating,
      },
    });

    return NextResponse.json(
      {
        message: 'Review submitted successfully',
        review,
        newAverageRating: roundedRating,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API /reviews POST error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
