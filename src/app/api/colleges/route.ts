import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const type = searchParams.get('type') || '';
    const sortBy = searchParams.get('sortBy') || 'ranking'; // ranking, tuition, population, ratings

    // Build Prisma query filters
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { city: { contains: search } },
        { popularMajors: { contains: search } },
      ];
    }

    if (state) {
      where.state = state;
    }

    if (type && type !== 'All') {
      where.type = type;
    }

    // Build sorting logic
    let orderBy: any = {};
    if (sortBy === 'ranking') {
      orderBy = { ranking: 'asc' }; // Lower rank = better (e.g. 1, 2, 3)
    } else if (sortBy === 'tuition') {
      orderBy = { tuitionOutState: 'asc' };
    } else if (sortBy === 'population') {
      orderBy = { studentPopulation: 'desc' };
    } else if (sortBy === 'ratings') {
      orderBy = { ratings: 'desc' };
    }

    const colleges = await db.college.findMany({
      where,
      orderBy,
    });

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error('API /colleges GET error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
