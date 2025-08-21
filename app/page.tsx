'use client'

import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';
import StudentList from '@/components/Students/StudentList';
import SubjectList from '@/components/Subjects/SubjectList';
import Charts from '@/components/Dashboard/Charts';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import StudentForm from '@/components/Students/StudentForm';
import SubjectForm from '@/components/Subjects/SubjectForm';
import TeacherList from '@/components/Teachers/TeacherList';
import TeacherForm from '@/components/Teachers/TeacherForm';
import ScheduleSelector from '@/components/Schedule/ScheduleSelector';
import { CreateSubjectRequest, Student, Subject } from '@/lib/types';
import { useStudents } from '@/hooks/useStudents';
import { useSubjects } from '@/hooks/useSubjects';
import { useTeachers } from '@/hooks/useTeachers';
import { useSchedules } from '@/hooks/useSchedules';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>();
  const [selectedScheduleClass, setSelectedScheduleClass] = useState<string>('');

  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const { subjects, loading, error, addSubject, updateSubject, deleteSubject, getSubjectsByIds, refresh, clearError } = useSubjects();
  const { teachers, loading: teachersLoading, error: teachersError, addTeacher, updateTeacher, deleteTeacher, refresh: refreshTeachers, clearError: clearTeachersError } = useTeachers();
  const { schedules, getScheduleByClass } = useSchedules();

  const handleAddStudent = () => {
    setEditingStudent(undefined);
    setShowStudentForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowStudentForm(true);
  };

  const handleSaveStudent = (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
    } else {
      addStudent(studentData);
    }
    setShowStudentForm(false);
    setEditingStudent(undefined);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };

  const handleAddSubject = () => {
    setEditingSubject(undefined);
    setShowSubjectForm(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setShowSubjectForm(true);
  };

  const handleSaveSubject = async (data: CreateSubjectRequest | { id: string } & Partial<Subject>) => {
    if ('id' in data) {
      // Update existing subject
      const { id, ...updateData } = data;
      return await updateSubject(id, updateData);
    } else {
      // Create new subject
      return await addSubject(data);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    return await deleteSubject(id);
  };

  const handleAddTeacher = () => {
    setEditingTeacher(undefined);
    setShowTeacherForm(true);
  };

  const handleEditTeacher = (teacher: any) => {
    setEditingTeacher(teacher);
    setShowTeacherForm(true);
  };

  const handleSaveTeacher = async (data: any) => {
    if ('id' in data) {
      // Update existing teacher
      const { id, ...updateData } = data;
      return await updateTeacher(id, updateData);
    } else {
      // Create new teacher
      return await addTeacher(data);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    return await deleteTeacher(id);
  };

  const handleSelectPeriod = (classSchedule: any, day: string, period: any) => {
    const subject = subjects.find(s => s.id === period.subject);
    const teacher = teachers.find(t => t.id === period.teacher);
    
    alert(`Selected Period:
Class: ${classSchedule.class}
Day: ${day}
Period: ${period.period}
Time: ${period.startTime} - ${period.endTime}
Subject: ${subject?.name || period.subject}
Teacher: ${teacher?.fullName || period.teacher}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard students={students} subjects={subjects} />;
      case 'students':
        return (
          <StudentList
            students={students}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onAdd={handleAddStudent}
            getSubjectsByIds={getSubjectsByIds}
          />
        );
      case 'subjects':
        return (
          <SubjectList
            subjects={subjects}
            loading={loading}
            error={error}
            onEdit={handleEditSubject}
            onDelete={handleDeleteSubject}
            onAdd={handleAddSubject}
            onRefresh={refresh}
            onClearError={clearError}
          />
        );
      case 'teachers':
        return (
          <TeacherList
            teachers={teachers}
            loading={teachersLoading}
            error={teachersError}
            onEdit={handleEditTeacher}
            onDelete={handleDeleteTeacher}
            onAdd={handleAddTeacher}
            onRefresh={refreshTeachers}
            onClearError={clearTeachersError}
            getSubjectsByIds={getSubjectsByIds}
          />
        );
      case 'schedules':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Class Schedules</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Select time slots from class schedules for student enrollment.
              </p>
            </div>
            <ScheduleSelector
              schedules={schedules}
              subjects={subjects}
              teachers={teachers}
              classes={['Grade 9A', 'Grade 9B', 'Grade 9C', 'Grade 9D', 'Grade 10A', 'Grade 10B', 'Grade 10C', 'Grade 10D', 'Grade 11A', 'Grade 11B', 'Grade 11C', 'Grade 11D', 'Grade 12A', 'Grade 12B', 'Grade 12C']}
              onSelectPeriod={handleSelectPeriod}
              selectedClass={selectedScheduleClass}
              onClassChange={setSelectedScheduleClass}
            />
          </div>
        );
      case 'statistics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistics</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Detailed analytics and insights about your students.
              </p>
            </div>
            <Charts students={students} subjects={subjects} />
          </div>
        );
      default:
        return <Dashboard students={students} subjects={subjects} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <div className="flex-1 lg:ml-64">
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>

      <StudentForm
        student={editingStudent}
        onSave={handleSaveStudent}
        onCancel={() => {
          setShowStudentForm(false);
          setEditingStudent(undefined);
        }}
        isOpen={showStudentForm}
        availableSubjects={subjects.map(s => ({ id: s.id, name: s.name, code: s.code }))}
      />

      <SubjectForm
        subject={editingSubject}
        onSave={handleSaveSubject}
        onCancel={() => {
          setShowSubjectForm(false);
          setEditingSubject(undefined);
        }}
        isOpen={showSubjectForm}
      />

      <TeacherForm
        teacher={editingTeacher}
        onSave={handleSaveTeacher}
        onCancel={() => {
          setShowTeacherForm(false);
          setEditingTeacher(undefined);
        }}
        isOpen={showTeacherForm}
        availableSubjects={subjects.map(s => ({ id: s.id, name: s.name, code: s.code }))}
      />
    </div>
  );
}

export default App;