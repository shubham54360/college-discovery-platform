import { Metadata } from 'next';
import { db } from '@/lib/db';

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const college = await db.college.findFirst({
    where: {
      OR: [
        { id: slug },
        { slug }
      ]
    }
  });

  if (!college) {
    return {
      title: 'University Profile | UniFinder',
      description: 'Discover elite universities, student reviews, tuition fees, and admission rates on UniFinder.'
    };
  }

  const title = `${college.name} - Ranking, Tuition, and Reviews | UniFinder`;
  const description = `Explore ${college.name} admissions, ${college.type} institution type, established in ${college.established}, located in ${college.city}, ${college.state}. Student rating: ${college.ratings}/5.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: college.coverUrl || '/images/default-cover.jpg',
          width: 1200,
          height: 630,
          alt: college.name
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [college.coverUrl || '/images/default-cover.jpg']
    }
  };
}

export default function CollegeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
