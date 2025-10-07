export interface Student {
  student_id: string;
  name: string;
  roll_no: string;
  department: string;
  year: number;
  email: string;
  created_at?: string;
}

export interface Faculty {
  faculty_id: string;
  name: string;
  department: string;
  email: string;
  created_at?: string;
}

export interface Subject {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  department: string;
  faculty_id: string;
  credits: number;
  created_at?: string;
}

export interface Timetable {
  timetable_id: string;
  subject_id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time_slot: string;
  room_no: string;
  department: string;
  year: number;
  created_at?: string;
}

export interface Attendance {
  attendance_id: string;
  student_id: string;
  subject_id: string;
  date: string;
  status: 'Present' | 'Absent';
  marked_by?: string;
  created_at?: string;
}

export interface AttendanceReport {
  student: Student;
  subject: Subject;
  total_classes: number;
  present_count: number;
  absent_count: number;
  percentage: number;
}

export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
