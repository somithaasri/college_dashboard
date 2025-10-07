import { supabase } from '../lib/supabase';
import { Student, Faculty, Subject, Timetable, Attendance, AttendanceReport } from '../types';

class DataService {
  async getStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', id)
      .maybeSingle();

    if (error) throw error;
    return data || undefined;
  }

  async addStudent(student: Omit<Student, 'student_id'>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('student_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('student_id', id);

    if (error) throw error;
    return true;
  }

  async getFaculty(): Promise<Faculty[]> {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getFacultyById(id: string): Promise<Faculty | undefined> {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .eq('faculty_id', id)
      .maybeSingle();

    if (error) throw error;
    return data || undefined;
  }

  async addFaculty(faculty: Omit<Faculty, 'faculty_id'>): Promise<Faculty> {
    const { data, error } = await supabase
      .from('faculty')
      .insert([faculty])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateFaculty(id: string, updates: Partial<Faculty>): Promise<Faculty | null> {
    const { data, error } = await supabase
      .from('faculty')
      .update(updates)
      .eq('faculty_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteFaculty(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('faculty')
      .delete()
      .eq('faculty_id', id);

    if (error) throw error;
    return true;
  }

  async getSubjects(): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('subject_name');

    if (error) throw error;
    return data || [];
  }

  async getSubjectById(id: string): Promise<Subject | undefined> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('subject_id', id)
      .maybeSingle();

    if (error) throw error;
    return data || undefined;
  }

  async getSubjectsByDepartment(department: string): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('department', department)
      .order('subject_name');

    if (error) throw error;
    return data || [];
  }

  async getSubjectsByFaculty(facultyId: string): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('faculty_id', facultyId)
      .order('subject_name');

    if (error) throw error;
    return data || [];
  }

  async addSubject(subject: Omit<Subject, 'subject_id'>): Promise<Subject> {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subject])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSubject(id: string, updates: Partial<Subject>): Promise<Subject | null> {
    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('subject_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteSubject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('subject_id', id);

    if (error) throw error;
    return true;
  }

  async getTimetable(): Promise<Timetable[]> {
    const { data, error } = await supabase
      .from('timetable')
      .select('*')
      .order('day');

    if (error) throw error;
    return data || [];
  }

  async getTimetableByDepartment(department: string, year?: number): Promise<Timetable[]> {
    let query = supabase
      .from('timetable')
      .select('*')
      .eq('department', department);

    if (year !== undefined) {
      query = query.eq('year', year);
    }

    const { data, error } = await query.order('day');

    if (error) throw error;
    return data || [];
  }

  async getTimetableByDay(day: string, department?: string): Promise<Timetable[]> {
    let query = supabase
      .from('timetable')
      .select('*')
      .eq('day', day);

    if (department) {
      query = query.eq('department', department);
    }

    const { data, error } = await query.order('time_slot');

    if (error) throw error;
    return data || [];
  }

  async addTimetable(entry: Omit<Timetable, 'timetable_id'>): Promise<Timetable> {
    const { data, error } = await supabase
      .from('timetable')
      .insert([entry])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTimetable(id: string, updates: Partial<Timetable>): Promise<Timetable | null> {
    const { data, error } = await supabase
      .from('timetable')
      .update(updates)
      .eq('timetable_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTimetable(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('timetable')
      .delete()
      .eq('timetable_id', id);

    if (error) throw error;
    return true;
  }

  async getAttendance(): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async markAttendance(record: Omit<Attendance, 'attendance_id'>): Promise<Attendance> {
    const { data, error } = await supabase
      .from('attendance')
      .upsert([record], {
        onConflict: 'student_id,subject_id,date',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAttendanceByStudent(studentId: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getAttendanceBySubject(subjectId: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('subject_id', subjectId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
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
