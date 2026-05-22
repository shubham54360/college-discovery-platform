import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as crypto from 'crypto';

const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

// A simple and robust pure-JS SHA256 helper for seeding passwords (matching the auth logic)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const COLLEGES_DATA = [
  {
    name: "Harvard University",
    slug: "harvard-university",
    description: "Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Established in 1636, Harvard is the oldest institution of higher learning in the United States and among the most prestigious in the world.",
    city: "Cambridge",
    state: "MA",
    zipCode: "02138",
    website: "https://www.harvard.edu",
    logoUrl: "https://images.unsplash.com/photo-1590076214537-1e3c7c9a6adc?auto=format&fit=crop&w=120&h=120&q=80",
    coverUrl: "https://images.unsplash.com/photo-1590076214537-1e3c7c9a6adc?auto=format&fit=crop&w=1200&h=600&q=80",
    type: "Private",
    established: 1636,
    ranking: 3,
    admissionRate: 0.04, // 4%
    tuitionInState: 54269,
    tuitionOutState: 54269,
    roomAndBoard: 18968,
    studentPopulation: 21648,
    studentFacultyRatio: "7:1",
    averageSat: 1540,
    averageAct: 35,
    netPrice: 19500,
    popularMajors: "Economics, Computer Science, Social Sciences, History, Evolutionary Biology",
    images: "https://images.unsplash.com/photo-1590076214537-1e3c7c9a6adc?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1622397333309-3056849bc70b?auto=format&fit=crop&w=800&q=80",
    ratings: 4.8
  },
  {
    name: "Stanford University",
    slug: "stanford-university",
    description: "Located in the heart of Silicon Valley, Stanford University is a private research university renowned for its academic strength, wealth, proximity to tech giants, and entrepreneurial character.",
    city: "Stanford",
    state: "CA",
    zipCode: "94305",
    website: "https://www.stanford.edu",
    logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=120&h=120&q=80",
    coverUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&h=600&q=80",
    type: "Private",
    established: 1885,
    ranking: 4,
    admissionRate: 0.04, // 4%
    tuitionInState: 56169,
    tuitionOutState: 56169,
    roomAndBoard: 17860,
    studentPopulation: 17326,
    studentFacultyRatio: "5:1",
    averageSat: 1530,
    averageAct: 35,
    netPrice: 20000,
    popularMajors: "Computer Science, Human Biology, Symbolic Systems, Econometrics, Mechanical Engineering",
    images: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80",
    ratings: 4.9
  },
  {
    name: "Massachusetts Institute of Technology",
    slug: "massachusetts-institute-of-technology",
    description: "The Massachusetts Institute of Technology (MIT) is a private land-grant research university in Cambridge, Massachusetts. Playing a key role in the development of modern science and engineering, MIT is ranked among the top academic institutions worldwide.",
    city: "Cambridge",
    state: "MA",
    zipCode: "02139",
    website: "https://www.mit.edu",
    logoUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=120&h=120&q=80",
    coverUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&h=600&q=80",
    type: "Private",
    established: 1861,
    ranking: 2,
    admissionRate: 0.05, // 5%
    tuitionInState: 55878,
    tuitionOutState: 55878,
    roomAndBoard: 18100,
    studentPopulation: 11934,
    studentFacultyRatio: "3:1",
    averageSat: 1560,
    averageAct: 36,
    netPrice: 21000,
    popularMajors: "Computer Science, Mechanical Engineering, Mathematics, Physics, Electrical Engineering",
    images: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    ratings: 4.9
  },
  {
    name: "Princeton University",
    slug: "princeton-university",
    description: "Princeton University is a private Ivy League research university in Princeton, New Jersey. Founded in 1746, Princeton is the fourth-oldest institution of higher education in the United States and is consistently ranked as the #1 National University.",
    city: "Princeton",
    state: "NJ",
    zipCode: "08544",
    website: "https://www.princeton.edu",
    logoUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=120&h=120&q=80",
    coverUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&h=600&q=80",
    type: "Private",
    established: 1746,
    ranking: 1,
    admissionRate: 0.04,
    tuitionInState: 53890,
    tuitionOutState: 53890,
    roomAndBoard: 17820,
    studentPopulation: 8478,
    studentFacultyRatio: "5:1",
    averageSat: 1540,
    averageAct: 35,
    netPrice: 18700,
    popularMajors: "Public Policy Analysis, Computer Science, Econometrics, History, Molecular Biology",
    images: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1498243691581-b148c55361c5?auto=format&fit=crop&w=800&q=80",
    ratings: 4.8
  },
  {
    name: "University of California, Berkeley",
    slug: "uc-berkeley",
    description: "The University of California, Berkeley is a public land-grant research university in Berkeley, California. Founded in 1868 as the state's first land-grant university, Berkeley is widely regarded as one of the top public universities in the world.",
    city: "Berkeley",
    state: "CA",
    zipCode: "94720",
    website: "https://www.berkeley.edu",
    logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=120&h=120&q=80",
    coverUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&h=600&q=80",
    type: "Public",
    established: 1868,
    ranking: 15,
    admissionRate: 0.11, // 11%
    tuitionInState: 14226,
    tuitionOutState: 44000,
    roomAndBoard: 20530,
    studentPopulation: 45307,
    studentFacultyRatio: "19:1",
    averageSat: 1445,
    averageAct: 33,
    netPrice: 16000,
    popularMajors: "Computer Science, Cellular Biology, Economics, Political Science, Psychology",
    images: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=800&q=80",
    ratings: 4.6
  },
  {
    name: "Yale University",
    slug: "yale-university",
    description: "Yale University is a private Ivy League research university in New Haven, Connecticut. Founded in 1701 as the Collegiate School, it is the third-oldest institution of higher education in the United States and one of the most prestigious in the world.",
    city: "New Haven",
    state: "CT",
    zipCode: "06520",
    website: "https://www.yale.edu",
    logoUrl: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=120&h=120&q=80",
    coverUrl: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&h=600&q=80",
    type: "Private",
    established: 1701,
    ranking: 5,
    admissionRate: 0.05,
    tuitionInState: 59950,
    tuitionOutState: 59950,
    roomAndBoard: 17800,
    studentPopulation: 14567,
    studentFacultyRatio: "6:1",
    averageSat: 1520,
    averageAct: 34,
    netPrice: 18000,
    popularMajors: "Social Sciences, Biological and Biomedical Sciences, History, Computer Science, Mathematics",
    images: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80",
    ratings: 4.7
  },
  {
    name: "University of Michigan",
    slug: "university-of-michigan",
    description: "The University of Michigan is a public research university in Ann Arbor, Michigan. Founded in 1817, the university is Michigan's oldest and is renowned for its diverse programs, research excellence, and vibrant campus life.",
    city: "Ann Arbor",
    state: "MI",
    zipCode: "48109",
    website: "https://umich.edu",
    logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=120&h=120&q=80",
    coverUrl: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1200&h=600&q=80",
    type: "Public",
    established: 1817,
    ranking: 21,
    admissionRate: 0.18, // 18%
    tuitionInState: 15948,
    tuitionOutState: 52266,
    roomAndBoard: 12592,
    studentPopulation: 47907,
    studentFacultyRatio: "15:1",
    averageSat: 1430,
    averageAct: 32,
    netPrice: 17500,
    popularMajors: "Information Technology, Business Administration, Econometrics, Psychology, Experimental Biology",
    images: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    ratings: 4.5
  },
  {
    name: "California Institute of Technology",
    slug: "caltech",
    description: "The California Institute of Technology (Caltech) is a private research university in Pasadena, California. Renowned for its strength in science and engineering, it has a tiny student body and manages NASA's Jet Propulsion Laboratory.",
    city: "Pasadena",
    state: "CA",
    zipCode: "91125",
    website: "https://www.caltech.edu",
    logoUrl: "https://images.unsplash.com/photo-1607237138185-eedd996e5b09?auto=format&fit=crop&w=120&h=120&q=80",
    coverUrl: "https://images.unsplash.com/photo-1607237138185-eedd996e5b09?auto=format&fit=crop&w=1200&h=600&q=80",
    type: "Private",
    established: 1891,
    ranking: 9,
    admissionRate: 0.04,
    tuitionInState: 58680,
    tuitionOutState: 58680,
    roomAndBoard: 17748,
    studentPopulation: 2397,
    studentFacultyRatio: "3:1",
    averageSat: 1560,
    averageAct: 36,
    netPrice: 22000,
    popularMajors: "Physics, Computer Science, Mechanical Engineering, Bioengineering, Chemical Engineering",
    images: "https://images.unsplash.com/photo-1607237138185-eedd996e5b09?auto=format&fit=crop&w=800&q=80",
    ratings: 4.9
  },
  {
    name: "Columbia University",
    slug: "columbia-university",
    description: "Columbia University is a private Ivy League research university in New York City. Established in 1754 as King's College on the grounds of Trinity Church in Manhattan, Columbia is the oldest institution of higher education in New York and the fifth-oldest in the United States.",
    city: "New York",
    state: "NY",
    zipCode: "10027",
    website: "https://www.columbia.edu",
    logoUrl: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&w=120&h=120&q=80",
    coverUrl: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&w=1200&h=600&q=80",
    type: "Private",
    established: 1754,
    ranking: 12,
    admissionRate: 0.04,
    tuitionInState: 63530,
    tuitionOutState: 63530,
    roomAndBoard: 15450,
    studentPopulation: 31455,
    studentFacultyRatio: "6:1",
    averageSat: 1510,
    averageAct: 34,
    netPrice: 21500,
    popularMajors: "Social Sciences, Computer Science, Engineering, History, Biological Sciences",
    images: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&w=800&q=80",
    ratings: 4.6
  },
  {
    name: "University of Washington",
    slug: "university-of-washington",
    description: "The University of Washington is a highly ranked public research university in Seattle, Washington. Renowned for its medicine, computer science, and engineering fields, UW offers spectacular views of Mount Rainier and outstanding student engagement.",
    city: "Seattle",
    state: "WA",
    zipCode: "98195",
    website: "https://www.uw.edu",
    logoUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=120&h=120&q=80",
    coverUrl: "https://images.unsplash.com/photo-1498243691581-b148c55361c5?auto=format&fit=crop&w=1200&h=600&q=80",
    type: "Public",
    established: 1861,
    ranking: 55,
    admissionRate: 0.53, // 53%
    tuitionInState: 12076,
    tuitionOutState: 39906,
    roomAndBoard: 14871,
    studentPopulation: 48149,
    studentFacultyRatio: "20:1",
    averageSat: 1350,
    averageAct: 30,
    netPrice: 10500,
    popularMajors: "Computer Science, Cellular Biology, Psychology, Communication, Biochemistry",
    images: "https://images.unsplash.com/photo-1498243691581-b148c55361c5?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=80",
    ratings: 4.4
  },
  {
    name: "University of Texas at Austin",
    slug: "ut-austin",
    description: "The University of Texas at Austin is a leading public research university in Austin, Texas. Founded in 1883, it is the flagship institution of the University of Texas System and features a top-ranked business school (McCombs) and computer science department.",
    city: "Austin",
    state: "TX",
    zipCode: "78712",
    website: "https://www.utexas.edu",
    logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=120&h=120&q=80",
    coverUrl: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1200&h=600&q=80",
    type: "Public",
    established: 1883,
    ranking: 32,
    admissionRate: 0.29, // 29%
    tuitionInState: 11448,
    tuitionOutState: 40032,
    roomAndBoard: 12286,
    studentPopulation: 51991,
    studentFacultyRatio: "18:1",
    averageSat: 1360,
    averageAct: 30,
    netPrice: 15500,
    popularMajors: "Business Administration, Biology, Computer Science, Engineering, Advertising",
    images: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80",
    ratings: 4.5
  }
];

async function main() {
  console.log("Starting database seed...");

  // 1. Clean existing records
  await prisma.savedCollege.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Cleared existing database records.");

  // 2. Create default demo user
  const passwordHash = hashPassword("password123");
  const demoUser = await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "jane@example.com",
      passwordHash: passwordHash
    }
  });
  console.log(`Demo user created: ${demoUser.email} (password: password123)`);

  // 3. Create Colleges
  let collegesCreated = 0;
  for (const collegeData of COLLEGES_DATA) {
    const createdCollege = await prisma.college.create({
      data: collegeData
    });
    collegesCreated++;

    // 4. Create a few mock reviews for each college
    await prisma.review.create({
      data: {
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 star rating
        comment: `Excellent campus facilities and outstanding academic programs! Strongly recommend ${createdCollege.name}.`,
        collegeId: createdCollege.id,
        userId: demoUser.id
      }
    });
  }

  console.log(`Successfully seeded ${collegesCreated} colleges with dummy reviews.`);
  console.log("Database seed complete!");
}

main()
  .catch((e) => {
    console.error("Seeding failed: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
