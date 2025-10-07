import { useState, useEffect } from 'react';
import { BookOpen, Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Subject, Student, Attendance } from '../types';

export default function FacultyDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Map<string, 'Present' | 'Absent'>>(new Map());
  const [stats, setStats] = useState<any[]>([]);

  const currentFacultyId = 'f1';

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      loadStudentsForSubject();
      loadAttendanceRecords();
      loadStats();
    }
  }, [selectedSubject, attendanceDate]);

  const loadSubjects = async () => {
    const allSubjects = await dataService.getSubjectsByFaculty(currentFacultyId);
    setSubjects(allSubjects);
    if (allSubjects.length > 0) {
      setSelectedSubject(allSubjects[0].subject_id);
    }
  };

  const loadStudentsForSubject = async () => {
    const subject = subjects.find(s => s.subject_id === selectedSubject);
    if (subject) {
      const allStudents = await dataService.getStudents();
      const filtered = allStudents.filter(s => s.department === subject.department);
      setStudents(filtered);
    }
  };

  const loadAttendanceRecords = async () => {
    const records = await dataService.getAttendanceBySubject(selectedSubject);
    const dateRecords = records.filter(r => r.date === attendanceDate);
    const map = new Map<string, 'Present' | 'Absent'>();
    dateRecords.forEach(record => {
      map.set(record.student_id, record.status);
    });
    setAttendanceRecords(map);
  };

  const loadStats = async () => {
    const subjectStats = await dataService.getAttendanceStatsBySubject(selectedSubject);
    setStats(subjectStats);
  };

  const toggleAttendance = (studentId: string, status: 'Present' | 'Absent') => {
    setAttendanceRecords(prev => {
      const newMap = new Map(prev);
      newMap.set(studentId, status);
      return newMap;
    });
  };

  const saveAttendance = async () => {
    for (const [studentId, status] of attendanceRecords.entries()) {
      await dataService.markAttendance({
        student_id: studentId,
        subject_id: selectedSubject,
        date: attendanceDate,
        status,
        marked_by: currentFacultyId
      });
    }
    alert('Attendance saved successfully!');
    loadStats();
  };

  const markAllPresent = () => {
    const newMap = new Map<string, 'Present' | 'Absent'>();
    students.forEach(student => {
      newMap.set(student.student_id, 'Present');
    });
    setAttendanceRecords(newMap);
  };

  const selectedSubjectData = subjects.find(s => s.subject_id === selectedSubject);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Faculty Dashboard</h1>
          <p className="text-slate-600 mt-1">Mark attendance and view reports</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Subjects</p>
                <p className="text-2xl font-bold text-slate-900">{subjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Students Enrolled</p>
                <p className="text-2xl font-bold text-slate-900">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-amber-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Average Attendance</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.length > 0
                    ? Math.round(stats.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / stats.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Mark Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {subjects.map(subject => (
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.subject_code} - {subject.subject_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={markAllPresent}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Mark All Present
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {selectedSubjectData && (
              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900">{selectedSubjectData.subject_name}</h3>
                <p className="text-sm text-slate-600">{selectedSubjectData.department} - {selectedSubjectData.credits} Credits</p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              {students.map(student => {
                const status = attendanceRecords.get(student.student_id);
                return (
                  <div key={student.student_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-medium text-slate-900">{student.name}</p>
                      <p className="text-sm text-slate-600">{student.roll_no}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAttendance(student.student_id, 'Present')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          status === 'Present'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Present
                      </button>
                      <button
                        onClick={() => toggleAttendance(student.student_id, 'Absent')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          status === 'Absent'
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={saveAttendance}
              className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-lg shadow-emerald-600/30"
            >
              Save Attendance
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Attendance Statistics</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-200">
                    <th className="pb-3 text-sm font-semibold text-slate-700">Student ID</th>
                    <th className="pb-3 text-sm font-semibold text-slate-700">Present</th>
                    <th className="pb-3 text-sm font-semibold text-slate-700">Absent</th>
                    <th className="pb-3 text-sm font-semibold text-slate-700">Total</th>
                    <th className="pb-3 text-sm font-semibold text-slate-700">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map(stat => {
                    const student = students.find(s => s.student_id === stat.studentId);
                    const percentage = parseFloat(stat.percentage);
                    return (
                      <tr key={stat.studentId} className="border-b border-slate-100">
                        <td className="py-4 text-sm text-slate-900">{student?.name || stat.studentId}</td>
                        <td className="py-4 text-sm text-emerald-600 font-medium">{stat.present}</td>
                        <td className="py-4 text-sm text-red-600 font-medium">{stat.absent}</td>
                        <td className="py-4 text-sm text-slate-600">{stat.total}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className={`h-2 rounded-full ${
                                  percentage >= 75 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-900">{percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
