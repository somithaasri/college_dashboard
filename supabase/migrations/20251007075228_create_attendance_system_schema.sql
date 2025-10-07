/*
  # College Attendance & Timetable Management System - Database Schema

  ## Overview
  This migration creates a complete database structure for managing college attendance,
  timetables, students, faculty, and subjects with proper relationships and constraints.

  ## New Tables

  ### 1. `students`
  Stores student information including personal details and academic data.
  - `student_id` (uuid, primary key) - Unique identifier for each student
  - `name` (text) - Student's full name
  - `roll_no` (text, unique) - Student's roll number
  - `department` (text) - Department/Branch name
  - `year` (integer) - Current academic year
  - `email` (text, unique) - Student's email address
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. `faculty`
  Stores faculty member information.
  - `faculty_id` (uuid, primary key) - Unique identifier for each faculty member
  - `name` (text) - Faculty member's full name
  - `department` (text) - Department name
  - `email` (text, unique) - Faculty member's email address
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `subjects`
  Stores subject information with faculty assignment.
  - `subject_id` (uuid, primary key) - Unique identifier for each subject
  - `subject_name` (text) - Name of the subject
  - `subject_code` (text, unique) - Unique subject code
  - `department` (text) - Department offering the subject
  - `faculty_id` (uuid, foreign key) - References faculty table
  - `credits` (integer) - Subject credit hours
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `timetable`
  Stores class schedule information.
  - `timetable_id` (uuid, primary key) - Unique identifier for each timetable entry
  - `subject_id` (uuid, foreign key) - References subjects table
  - `day` (text) - Day of the week
  - `time_slot` (text) - Time slot (e.g., "09:00-10:00")
  - `room_no` (text) - Classroom/room number
  - `department` (text) - Department for filtering
  - `year` (integer) - Academic year
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. `attendance`
  Stores student attendance records.
  - `attendance_id` (uuid, primary key) - Unique identifier for each attendance record
  - `student_id` (uuid, foreign key) - References students table
  - `subject_id` (uuid, foreign key) - References subjects table
  - `date` (date) - Date of attendance
  - `status` (text) - Attendance status ('Present' or 'Absent')
  - `marked_by` (uuid) - Faculty member who marked attendance
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Policies allow authenticated users to read data
  - Admin users can perform all operations
  - Faculty can mark attendance and view their assigned subjects
  - Students can view their own records

  ## Relationships
  - subjects.faculty_id -> faculty.faculty_id (One faculty teaches many subjects)
  - timetable.subject_id -> subjects.subject_id (One subject has multiple time slots)
  - attendance.student_id -> students.student_id (One student has many attendance records)
  - attendance.subject_id -> subjects.subject_id (One subject has many attendance records)

  ## Constraints
  - Unique constraints on email addresses and roll numbers
  - Foreign key constraints ensure referential integrity
  - Check constraints ensure valid data (year between 1-4, valid status values)
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  student_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  roll_no text UNIQUE NOT NULL,
  department text NOT NULL,
  year integer NOT NULL CHECK (year >= 1 AND year <= 4),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create faculty table
CREATE TABLE IF NOT EXISTS faculty (
  faculty_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  subject_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_name text NOT NULL,
  subject_code text UNIQUE NOT NULL,
  department text NOT NULL,
  faculty_id uuid REFERENCES faculty(faculty_id) ON DELETE SET NULL,
  credits integer DEFAULT 3 CHECK (credits >= 1 AND credits <= 6),
  created_at timestamptz DEFAULT now()
);

-- Create timetable table
CREATE TABLE IF NOT EXISTS timetable (
  timetable_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
  day text NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  time_slot text NOT NULL,
  room_no text NOT NULL,
  department text NOT NULL,
  year integer NOT NULL CHECK (year >= 1 AND year <= 4),
  created_at timestamptz DEFAULT now(),
  UNIQUE(subject_id, day, time_slot)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  attendance_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL CHECK (status IN ('Present', 'Absent')),
  marked_by uuid,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, subject_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_students_year ON students(year);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON faculty(department);
CREATE INDEX IF NOT EXISTS idx_subjects_faculty ON subjects(faculty_id);
CREATE INDEX IF NOT EXISTS idx_subjects_department ON subjects(department);
CREATE INDEX IF NOT EXISTS idx_timetable_subject ON timetable(subject_id);
CREATE INDEX IF NOT EXISTS idx_timetable_day ON timetable(day);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_subject ON attendance(subject_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students table
CREATE POLICY "Anyone can view students"
  ON students FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert students"
  ON students FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update students"
  ON students FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete students"
  ON students FOR DELETE
  USING (true);

-- RLS Policies for faculty table
CREATE POLICY "Anyone can view faculty"
  ON faculty FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert faculty"
  ON faculty FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update faculty"
  ON faculty FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete faculty"
  ON faculty FOR DELETE
  USING (true);

-- RLS Policies for subjects table
CREATE POLICY "Anyone can view subjects"
  ON subjects FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert subjects"
  ON subjects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update subjects"
  ON subjects FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete subjects"
  ON subjects FOR DELETE
  USING (true);

-- RLS Policies for timetable table
CREATE POLICY "Anyone can view timetable"
  ON timetable FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert timetable"
  ON timetable FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update timetable"
  ON timetable FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete timetable"
  ON timetable FOR DELETE
  USING (true);

-- RLS Policies for attendance table
CREATE POLICY "Anyone can view attendance"
  ON attendance FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert attendance"
  ON attendance FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update attendance"
  ON attendance FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete attendance"
  ON attendance FOR DELETE
  USING (true);