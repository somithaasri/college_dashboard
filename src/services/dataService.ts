import { Student, Faculty, Subject, Timetable, Attendance, AttendanceReport } from '../types';
import { mockStudents, mockFaculty, mockSubjects, mockTimetable, mockAttendance } from './mockData';

class DataService {
  private students: Student[] = [...mockStudents];
  private faculty: Faculty[] = [...mockFaculty];
  private subjects: Subject[] = [...mockSubjects];
  private timetable: Timetable[] = [...mockTimetable];
  private attendance: Attendance[] = [...mockAttendance];

  async getStudents(): Promise<Student[]> {
    return this.students;
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    return this.students.find(s => s.student_id === id);
  }

  async addStudent(student: Omit<Student, 'student_id'>): Promise<Student> {
    const newStudent: Student = {
      ...student,
      student_id: `s${Date.now()}`
    };
    this.students.push(newStudent);
    return newStudent;
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student | null> {
    const index = this.students.findIndex(s => s.student_id === id);
    if (index === -1) return null;
    this.students[index] = { ...this.students[index], ...data };
    return this.students[index];
  }

  async deleteStudent(id: string): Promise<boolean> {
    const index = this.students.findIndex(s => s.student_id === id);
    if (index === -1) return false;
    this.students.splice(index, 1);
    return true;
  }

  async getFaculty(): Promise<Faculty[]> {
    return this.faculty;
  }

  async getFacultyById(id: string): Promise<Faculty | undefined> {
    return this.faculty.find(f => f.faculty_id === id);
  }

  async addFaculty(faculty: Omit<Faculty, 'faculty_id'>): Promise<Faculty> {
    const newFaculty: Faculty = {
      ...faculty,
      faculty_id: `f${Date.now()}`
    };
    this.faculty.push(newFaculty);
    return newFaculty;
  }

  async updateFaculty(id: string, data: Partial<Faculty>): Promise<Faculty | null> {
    const index = this.faculty.findIndex(f => f.faculty_id === id);
    if (index === -1) return null;
    this.faculty[index] = { ...this.faculty[index], ...data };
    return this.faculty[index];
  }

  async deleteFaculty(id: string): Promise<boolean> {
    const index = this.faculty.findIndex(f => f.faculty_id === id);
    if (index === -1) return false;
    this.faculty.splice(index, 1);
    return true;
  }

  async getSubjects(): Promise<Subject[]> {
    return this.subjects;
  }

  async getSubjectById(id: string): Promise<Subject | undefined> {
    return this.subjects.find(s => s.subject_id === id);
  }

  async getSubjectsByDepartment(department: string): Promise<Subject[]> {
    return this.subjects.filter(s => s.department === department);
  }

  async getSubjectsByFaculty(facultyId: string): Promise<Subject[]> {
    return this.subjects.filter(s => s.faculty_id === facultyId);
  }

  async addSubject(subject: Omit<Subject, 'subject_id'>): Promise<Subject> {
    const newSubject: Subject = {
      ...subject,
      subject_id: `sub${Date.now()}`
    };
    this.subjects.push(newSubject);
    return newSubject;
  }

  async updateSubject(id: string, data: Partial<Subject>): Promise<Subject | null> {
    const index = this.subjects.findIndex(s => s.subject_id === id);
    if (index === -1) return null;
    this.subjects[index] = { ...this.subjects[index], ...data };
    return this.subjects[index];
  }

  async deleteSubject(id: string): Promise<boolean> {
    const index = this.subjects.findIndex(s => s.subject_id === id);
    if (index === -1) return false;
    this.subjects.splice(index, 1);
    return true;
  }

  async getTimetable(): Promise<Timetable[]> {
    return this.timetable;
  }

  async getTimetableByDepartment(department: string, year?: number): Promise<Timetable[]> {
    return this.timetable.filter(t =>
      t.department === department && (year === undefined || t.year === year)
    );
  }

  async getTimetableByDay(day: string, department?: string): Promise<Timetable[]> {
    return this.timetable.filter(t =>
      t.day === day && (department === undefined || t.department === department)
    );
  }

  async addTimetable(entry: Omit<Timetable, 'timetable_id'>): Promise<Timetable> {
    const newEntry: Timetable = {
      ...entry,
      timetable_id: `t${Date.now()}`
    };
    this.timetable.push(newEntry);
    return newEntry;
  }

  async updateTimetable(id: string, data: Partial<Timetable>): Promise<Timetable | null> {
    const index = this.timetable.findIndex(t => t.timetable_id === id);
    if (index === -1) return null;
    this.timetable[index] = { ...this.timetable[index], ...data };
    return this.timetable[index];
  }

  async deleteTimetable(id: string): Promise<boolean> {
    const index = this.timetable.findIndex(t => t.timetable_id === id);
    if (index === -1) return false;
    this.timetable.splice(index, 1);
    return true;
  }

  async getAttendance(): Promise<Attendance[]> {
    return this.attendance;
  }

  async markAttendance(record: Omit<Attendance, 'attendance_id'>): Promise<Attendance> {
    const existing = this.attendance.findIndex(
      a => a.student_id === record.student_id &&
           a.subject_id === record.subject_id &&
           a.date === record.date
    );

    if (existing !== -1) {
      this.attendance[existing] = { ...this.attendance[existing], ...record };
      return this.attendance[existing];
    }

    const newRecord: Attendance = {
      ...record,
      attendance_id: `a${Date.now()}`
    };
    this.attendance.push(newRecord);
    return newRecord;
  }

  async getAttendanceByStudent(studentId: string): Promise<Attendance[]> {
    return this.attendance.filter(a => a.student_id === studentId);
  }

  async getAttendanceBySubject(subjectId: string): Promise<Attendance[]> {
    return this.attendance.filter(a => a.subject_id === subjectId);
  }

  async getAttendanceReport(studentId: string): Promise<AttendanceReport[]> {
    const studentAttendance = await this.getAttendanceByStudent(studentId);
    const student = await this.getStudentById(studentId);

    if (!student) return [];

    const subjectMap = new Map<string, Attendance[]>();
    studentAttendance.forEach(record => {
      const existing = subjectMap.get(record.subject_id) || [];
      existing.push(record);
      subjectMap.set(record.subject_id, existing);
    });

    const reports: AttendanceReport[] = [];
    for (const [subjectId, records] of subjectMap.entries()) {
      const subject = await this.getSubjectById(subjectId);
      if (!subject) continue;

      const total = records.length;
      const present = records.filter(r => r.status === 'Present').length;
      const absent = total - present;
      const percentage = total > 0 ? (present / total) * 100 : 0;

      reports.push({
        student,
        subject,
        total_classes: total,
        present_count: present,
        absent_count: absent,
        percentage: Math.round(percentage * 100) / 100
      });
    }

    return reports;
  }

  async getAttendanceStatsBySubject(subjectId: string) {
    const records = await this.getAttendanceBySubject(subjectId);
    const studentMap = new Map<string, { present: number; absent: number }>();

    records.forEach(record => {
      const stats = studentMap.get(record.student_id) || { present: 0, absent: 0 };
      if (record.status === 'Present') {
        stats.present++;
      } else {
        stats.absent++;
      }
      studentMap.set(record.student_id, stats);
    });

    return Array.from(studentMap.entries()).map(([studentId, stats]) => ({
      studentId,
      ...stats,
      total: stats.present + stats.absent,
      percentage: ((stats.present / (stats.present + stats.absent)) * 100).toFixed(2)
    }));
  }

  async getOverallStats() {
    const subjects = await this.getSubjects();
    const subjectStats = await Promise.all(
      subjects.map(async subject => {
        const records = await this.getAttendanceBySubject(subject.subject_id);
        const present = records.filter(r => r.status === 'Present').length;
        const total = records.length;
        const percentage = total > 0 ? (present / total) * 100 : 0;

        return {
          subject,
          total_classes: total,
          present_count: present,
          percentage: Math.round(percentage * 100) / 100
        };
      })
    );

    subjectStats.sort((a, b) => b.percentage - a.percentage);

    return {
      mostAttended: subjectStats[0] || null,
      leastAttended: subjectStats[subjectStats.length - 1] || null,
      allSubjects: subjectStats
    };
  }
}

export const dataService = new DataService();
