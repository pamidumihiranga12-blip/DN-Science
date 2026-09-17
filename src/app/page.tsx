import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/home/HomeHero";
import HomeStats from "@/components/home/HomeStats";
import HomeAbout from "@/components/home/HomeAbout";
import HomeCourses from "@/components/home/HomeCourses";
import HomeBooks from "@/components/home/HomeBooks";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import HomeContact from "@/components/home/HomeContact";
import { db } from "@/db";
import { courses, books, testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let coursesData: any[] = [];
  let booksData: any[] = [];
  let testimonialsData: any[] = [];

  try {
    if (process.env.DATABASE_URL) {
      [coursesData, booksData, testimonialsData] = await Promise.all([
        db.select().from(courses).where(eq(courses.isPublished, true)).limit(4),
        db.select().from(books).where(eq(books.isPublished, true)).limit(4),
        db.select().from(testimonials).where(eq(testimonials.isPublished, true)).limit(5),
      ]);
    }
  } catch (error) {
    console.error("Database error on HomePage:", error);
  }

  return (
    <main>
      <Navbar />
      <HomeHero />
      <HomeStats />
      <HomeAbout />
      <HomeCourses courses={coursesData} />
      <HomeBooks books={booksData} />
      <HomeTestimonials testimonials={testimonialsData} />
      <HomeContact />
      <Footer />
    </main>
  );
}
