import { Student, Faculty, Subject, Timetable, Attendance } from '../types';

export const mockStudents: Student[] = [
  {
    student_id: 's1',
    name: 'Rahul Kumar',
    roll_no: 'CS2021001',
    department: 'Computer Science',
    year: 3,
    email: 'rahul.kumar@college.edu'
  },
  {
    student_id: 's2',
    name: 'Priya Sharma',
    roll_no: 'CS2021002',
    department: 'Computer Science',
    year: 3,
    email: 'priya.sharma@college.edu'
  },
  {
    student_id: 's3',
    name: 'Amit Patel',
    roll_no: 'CS2021003',
    department: 'Computer Science',
    year: 3,
    email: 'amit.patel@college.edu'
  },
  {
    student_id: 's4',
    name: 'Sneha Gupta',
    roll_no: 'EC2021001',
    department: 'Electronics',
    year: 2,
    email: 'sneha.gupta@college.edu'
  },
  {
    student_id: 's5',
    name: 'Vikram Singh',
    roll_no: 'EC2021002',
    department: 'Electronics',
    year: 2,
    email: 'vikram.singh@college.edu'
  }
];

export const mockFaculty: Faculty[] = [
  {
    faculty_id: 'f1',
    name: 'Dr. Rajesh Verma',
    department: 'Computer Science',
    email: 'rajesh.verma@college.edu'
  },
  {
    faculty_id: 'f2',
    name: 'Prof. Sunita Desai',
    department: 'Computer Science',
    email: 'sunita.desai@college.edu'
  },
  {
    faculty_id: 'f3',
    name: 'Dr. Arjun Mehta',
    department: 'Electronics',
    email: 'arjun.mehta@college.edu'
  }
];

export const mockSubjects: Subject[] = [
  {
    subject_id: 'sub1',
    subject_name: 'Database Management Systems',
    subject_code: 'CS301',
    department: 'Computer Science',
    faculty_id: 'f1',
    credits: 4
  },
  {
    subject_id: 'sub2',
    subject_name: 'Operating Systems',
    subject_code: 'CS302',
    department: 'Computer Science',
    faculty_id: 'f2',
    credits: 4
  },
  {
    subject_id: 'sub3',
    subject_name: 'Computer Networks',
    subject_code: 'CS303',
    department: 'Computer Science',
    faculty_id: 'f1',
    credits: 3
  },
  {
    subject_id: 'sub4',
    subject_name: 'Digital Signal Processing',
    subject_code: 'EC201',
    department: 'Electronics',
    faculty_id: 'f3',
    credits: 3
  }
];

export const mockTimetable: Timetable[] = [
  {
    timetable_id: 't1',
    subject_id: 'sub1',
    day: 'Monday',
    time_slot: '09:00-10:00',
    room_no: 'A101',
    department: 'Computer Science',
    year: 3
  },
  {
    timetable_id: 't2',
    subject_id: 'sub2',
    day: 'Monday',
    time_slot: '10:00-11:00',
    room_no: 'A102',
    department: 'Computer Science',
    year: 3
  },
  {
    timetable_id: 't3',
    subject_id: 'sub3',
    day: 'Tuesday',
    time_slot: '09:00-10:00',
    room_no: 'A101',
    department: 'Computer Science',
    year: 3
  },
  {
    timetable_id: 't4',
    subject_id: 'sub1',
    day: 'Wednesday',
    time_slot: '11:00-12:00',
    room_no: 'A103',
    department: 'Computer Science',
    year: 3
  },
  {
    timetable_id: 't5',
    subject_id: 'sub2',
    day: 'Thursday',
    time_slot: '10:00-11:00',
    room_no: 'A102',
    department: 'Computer Science',
    year: 3
  },
  {
    timetable_id: 't6',
    subject_id: 'sub4',
    day: 'Monday',
    time_slot: '09:00-10:00',
    room_no: 'B201',
    department: 'Electronics',
    year: 2
  }
];

export const mockAttendance: Attendance[] = [
  {
    attendance_id: 'a1',
    student_id: 's1',
    subject_id: 'sub1',
    date: '2025-10-01',
    status: 'Present',
    marked_by: 'f1'
  },
  {
    attendance_id: 'a2',
    student_id: 's2',
    subject_id: 'sub1',
    date: '2025-10-01',
    status: 'Present',
    marked_by: 'f1'
  },
  {
    attendance_id: 'a3',
    student_id: 's3',
    subject_id: 'sub1',
    date: '2025-10-01',
    status: 'Absent',
    marked_by: 'f1'
  },
  {
    attendance_id: 'a4',
    student_id: 's1',
    subject_id: 'sub2',
    date: '2025-10-01',
    status: 'Present',
    marked_by: 'f2'
  },
  {
    attendance_id: 'a5',
    student_id: 's2',
    subject_id: 'sub2',
    date: '2025-10-01',
    status: 'Present',
    marked_by: 'f2'
  },
  {
    attendance_id: 'a6',
    student_id: 's3',
    subject_id: 'sub2',
    date: '2025-10-01',
    status: 'Present',
    marked_by: 'f2'
  },
  {
    attendance_id: 'a7',
    student_id: 's1',
    subject_id: 'sub1',
    date: '2025-10-03',
    status: 'Present',
    marked_by: 'f1'
  },
  {
    attendance_id: 'a8',
    student_id: 's2',
    subject_id: 'sub1',
    date: '2025-10-03',
    status: 'Absent',
    marked_by: 'f1'
  },
  {
    attendance_id: 'a9',
    student_id: 's3',
    subject_id: 'sub1',
    date: '2025-10-03',
    status: 'Present',
    marked_by: 'f1'
  }
];
