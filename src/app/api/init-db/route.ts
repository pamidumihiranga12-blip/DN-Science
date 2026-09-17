import { NextResponse } from "next/server";
import { pool } from "@/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured in environment variables." },
      { status: 500 }
    );
  }

  const client = await pool.connect();
  try {
    // Create enums
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('student', 'admin');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE enrollment_status AS ENUM ('pending', 'active', 'rejected');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE course_level AS ENUM ('OL', 'AL', 'Both');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        phone VARCHAR(20),
        school VARCHAR(255),
        grade VARCHAR(50),
        role user_role NOT NULL DEFAULT 'student',
        status user_status NOT NULL DEFAULT 'active',
        avatar TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        level course_level NOT NULL DEFAULT 'OL',
        subject VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        thumbnail TEXT,
        is_published BOOLEAN NOT NULL DEFAULT true,
        total_videos INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        youtube_url TEXT,
        duration VARCHAR(20),
        order_index INTEGER NOT NULL DEFAULT 0,
        is_free BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        level course_level NOT NULL DEFAULT 'OL',
        subject VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        thumbnail TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        is_published BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        status enrollment_status NOT NULL DEFAULT 'pending',
        payment_proof TEXT,
        notes TEXT,
        enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
        approved_at TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS student_video_access (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        video_id INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
        granted_by_admin BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS book_orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        total_price DECIMAL(10, 2) NOT NULL,
        status order_status NOT NULL DEFAULT 'pending',
        shipping_address TEXT,
        phone VARCHAR(20),
        notes TEXT,
        ordered_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        school VARCHAR(255),
        grade VARCHAR(50),
        content TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5,
        avatar TEXT,
        is_published BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Check and seed default admin
    const adminCheck = await client.query(`SELECT id FROM users WHERE email = $1`, ["admin@dnscience.lk"]);
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await client.query(
        `INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, 'admin', 'active')`,
        ["Darshana Nuwan (Admin)", "admin@dnscience.lk", hashedPassword]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database tables created and default admin (admin@dnscience.lk) initialized successfully!",
    });
  } catch (error: any) {
    console.error("Database init error:", error);
    return NextResponse.json({ error: error?.message || "Failed to initialize database" }, { status: 500 });
  } finally {
    client.release();
  }
}
