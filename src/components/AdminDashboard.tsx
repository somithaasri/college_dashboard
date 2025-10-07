import { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, GraduationCap, Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Student, Faculty, Subject, Timetable } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty' | 'subjects' | 'timetable'>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [studentsData, facultyData, subjectsData, timetableData] = await Promise.all([
      dataService.getStudents(),
      dataService.getFaculty(),
      dataService.getSubjects(),
      dataService.getTimetable()
    ]);
    setStudents(studentsData);
    setFaculty(facultyData);
    setSubjects(subjectsData);
    setTimetable(timetableData);
  };

  const tabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'faculty', label: 'Faculty', icon: GraduationCap },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'timetable', label: 'Timetable', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage students, faculty, subjects, and timetables</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900 capitalize">{activeTab}</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add {activeTab.slice(0, -1)}
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'students' && <StudentsTable students={students} onUpdate={loadData} />}
            {activeTab === 'faculty' && <FacultyTable faculty={faculty} onUpdate={loadData} />}
            {activeTab === 'subjects' && <SubjectsTable subjects={subjects} faculty={faculty} onUpdate={loadData} />}
            {activeTab === 'timetable' && <TimetableTable timetable={timetable} subjects={subjects} onUpdate={loadData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsTable({ students, onUpdate }: { students: Student[]; onUpdate: () => void }) {
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      await dataService.deleteStudent(id);
      onUpdate();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-slate-200">
            <th className="pb-3 text-sm font-semibold text-slate-700">Roll No</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Name</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Department</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Year</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Email</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.student_id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-4 text-sm text-slate-900">{student.roll_no}</td>
              <td className="py-4 text-sm font-medium text-slate-900">{student.name}</td>
              <td className="py-4 text-sm text-slate-600">{student.department}</td>
              <td className="py-4 text-sm text-slate-600">Year {student.year}</td>
              <td className="py-4 text-sm text-slate-600">{student.email}</td>
              <td className="py-4">
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(student.student_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FacultyTable({ faculty, onUpdate }: { faculty: Faculty[]; onUpdate: () => void }) {
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      await dataService.deleteFaculty(id);
      onUpdate();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-slate-200">
            <th className="pb-3 text-sm font-semibold text-slate-700">Name</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Department</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Email</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculty.map(member => (
            <tr key={member.faculty_id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-4 text-sm font-medium text-slate-900">{member.name}</td>
              <td className="py-4 text-sm text-slate-600">{member.department}</td>
              <td className="py-4 text-sm text-slate-600">{member.email}</td>
              <td className="py-4">
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.faculty_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubjectsTable({ subjects, faculty, onUpdate }: { subjects: Subject[]; faculty: Faculty[]; onUpdate: () => void }) {
  const getFacultyName = (facultyId: string) => {
    return faculty.find(f => f.faculty_id === facultyId)?.name || 'Unknown';
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      await dataService.deleteSubject(id);
      onUpdate();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-slate-200">
            <th className="pb-3 text-sm font-semibold text-slate-700">Code</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Subject Name</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Department</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Faculty</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Credits</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(subject => (
            <tr key={subject.subject_id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-4 text-sm font-medium text-slate-900">{subject.subject_code}</td>
              <td className="py-4 text-sm text-slate-900">{subject.subject_name}</td>
              <td className="py-4 text-sm text-slate-600">{subject.department}</td>
              <td className="py-4 text-sm text-slate-600">{getFacultyName(subject.faculty_id)}</td>
              <td className="py-4 text-sm text-slate-600">{subject.credits}</td>
              <td className="py-4">
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(subject.subject_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TimetableTable({ timetable, subjects, onUpdate }: { timetable: Timetable[]; subjects: Subject[]; onUpdate: () => void }) {
  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.subject_id === subjectId)?.subject_name || 'Unknown';
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this timetable entry?')) {
      await dataService.deleteTimetable(id);
      onUpdate();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-slate-200">
            <th className="pb-3 text-sm font-semibold text-slate-700">Day</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Time Slot</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Subject</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Room</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Department</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Year</th>
            <th className="pb-3 text-sm font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map(entry => (
            <tr key={entry.timetable_id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-4 text-sm font-medium text-slate-900">{entry.day}</td>
              <td className="py-4 text-sm text-slate-900">{entry.time_slot}</td>
              <td className="py-4 text-sm text-slate-600">{getSubjectName(entry.subject_id)}</td>
              <td className="py-4 text-sm text-slate-600">{entry.room_no}</td>
              <td className="py-4 text-sm text-slate-600">{entry.department}</td>
              <td className="py-4 text-sm text-slate-600">Year {entry.year}</td>
              <td className="py-4">
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.timetable_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
