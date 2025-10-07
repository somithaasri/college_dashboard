import { useState, useEffect } from 'react';
import { Calendar, BookOpen, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { dataService } from '../services/dataService';
import { AttendanceReport, Timetable, Subject } from '../types';

export default function StudentDashboard() {
  const [attendanceReports, setAttendanceReports] = useState<AttendanceReport[]>([]);
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const currentStudentId = 's1';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const reports = await dataService.getAttendanceReport(currentStudentId);
    setAttendanceReports(reports);

    const student = await dataService.getStudentById(currentStudentId);
    if (student) {
      const ttData = await dataService.getTimetableByDepartment(student.department, student.year);
      setTimetable(ttData);

      const subjectsData = await dataService.getSubjectsByDepartment(student.department);
      setSubjects(subjectsData);
    }
  };

  const overallAttendance = attendanceReports.length > 0
    ? Math.round(attendanceReports.reduce((sum, r) => sum + r.percentage, 0) / attendanceReports.length)
    : 0;

  const bestSubject = attendanceReports.length > 0
    ? attendanceReports.reduce((best, current) => current.percentage > best.percentage ? current : best)
    : null;

  const worstSubject = attendanceReports.length > 0
    ? attendanceReports.reduce((worst, current) => current.percentage < worst.percentage ? current : worst)
    : null;

  const todayTimetable = timetable.filter(t => t.day === selectedDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="text-slate-600 mt-1">View your attendance and timetable</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Overall Attendance</p>
                <p className="text-2xl font-bold text-slate-900">{overallAttendance}%</p>
              </div>
            </div>
            <div className="mt-3 bg-slate-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  overallAttendance >= 75 ? 'bg-emerald-500' : overallAttendance >= 60 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(overallAttendance, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Best Subject</p>
                <p className="text-lg font-bold text-slate-900">{bestSubject?.subject.subject_code || 'N/A'}</p>
                {bestSubject && (
                  <p className="text-sm text-emerald-600 font-medium">{bestSubject.percentage.toFixed(1)}%</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Needs Improvement</p>
                <p className="text-lg font-bold text-slate-900">{worstSubject?.subject.subject_code || 'N/A'}</p>
                {worstSubject && (
                  <p className="text-sm text-red-600 font-medium">{worstSubject.percentage.toFixed(1)}%</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Attendance Report</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-200">
                    <th className="pb-3 text-sm font-semibold text-slate-700">Subject</th>
                    <th className="pb-3 text-sm font-semibold text-slate-700">Code</th>
                    <th className="pb-3 text-sm font-semibold text-slate-700">Total Classes</th>
                    <th className="pb-3 text-sm font-semibold text-slate-700">Present</th>
                    <th className="pb-3 text-sm font-semibold text-slate-700">Absent</th>
                    <th className="pb-3 text-sm font-semibold text-slate-700">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceReports.map(report => {
                    const percentage = report.percentage;
                    return (
                      <tr key={report.subject.subject_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 text-sm font-medium text-slate-900">{report.subject.subject_name}</td>
                        <td className="py-4 text-sm text-slate-600">{report.subject.subject_code}</td>
                        <td className="py-4 text-sm text-slate-600">{report.total_classes}</td>
                        <td className="py-4 text-sm text-emerald-600 font-medium">{report.present_count}</td>
                        <td className="py-4 text-sm text-red-600 font-medium">{report.absent_count}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[120px]">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  percentage >= 75 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <span className={`text-sm font-semibold ${
                              percentage >= 75 ? 'text-emerald-600' : percentage >= 60 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {percentage.toFixed(1)}%
                            </span>
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

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Timetable</h2>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="p-6">
            {todayTimetable.length > 0 ? (
              <div className="space-y-3">
                {todayTimetable.map(entry => {
                  const subject = subjects.find(s => s.subject_id === entry.subject_id);
                  return (
                    <div key={entry.timetable_id} className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-600 text-white rounded-lg">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{subject?.subject_name || 'Unknown Subject'}</h3>
                            <p className="text-sm text-slate-600">{subject?.subject_code}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">{entry.time_slot}</p>
                          <p className="text-sm text-slate-600">Room {entry.room_no}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No classes scheduled for {selectedDay}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
