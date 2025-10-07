import { useState } from 'react';
import { GraduationCap, Users, BookOpen } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import StudentDashboard from './components/StudentDashboard';

type View = 'landing' | 'admin' | 'faculty' | 'student';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  if (currentView === 'faculty') {
    return <FacultyDashboard />;
  }

  if (currentView === 'student') {
    return <StudentDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-600/30">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            College Attendance & Timetable Management
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive system for managing students, faculty, subjects, timetables, and attendance tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div
            onClick={() => setCurrentView('admin')}
            className="group bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-8 hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/30">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Admin Portal</h2>
            <p className="text-slate-600 leading-relaxed">
              Manage students, faculty, subjects, and timetables. Complete administrative control over the system.
            </p>
            <div className="mt-6 text-blue-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Enter Dashboard →
            </div>
          </div>

          <div
            onClick={() => setCurrentView('faculty')}
            className="group bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-8 hover:border-emerald-500 hover:shadow-2xl transition-all cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-600/30">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Faculty Portal</h2>
            <p className="text-slate-600 leading-relaxed">
              Mark attendance for your classes, view reports, and track student performance across subjects.
            </p>
            <div className="mt-6 text-emerald-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Enter Dashboard →
            </div>
          </div>

          <div
            onClick={() => setCurrentView('student')}
            className="group bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-8 hover:border-sky-500 hover:shadow-2xl transition-all cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-sky-600/30">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Student Portal</h2>
            <p className="text-slate-600 leading-relaxed">
              View your attendance records, timetable, and track your performance across all subjects.
            </p>
            <div className="mt-6 text-sky-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              Enter Dashboard →
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-white rounded-2xl shadow-sm border border-slate-200 px-8 py-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">5</p>
              <p className="text-sm text-slate-600 mt-1">Students</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">3</p>
              <p className="text-sm text-slate-600 mt-1">Faculty</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">4</p>
              <p className="text-sm text-slate-600 mt-1">Subjects</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">6</p>
              <p className="text-sm text-slate-600 mt-1">Time Slots</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
