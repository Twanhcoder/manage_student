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
import { Student, Subject } from '@/lib/types';
import { useStudents } from '@/hooks/useStudents';
import { useSubjects } from '@/hooks/useSubjects';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();

  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const { subjects, addSubject, updateSubject, deleteSubject, getSubjectsByIds } = useSubjects();

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

  const handleSaveSubject = (subjectData: Omit<Subject, 'id' | 'createdAt'>) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, subjectData);
    } else {
      addSubject(subjectData);
    }
    setShowSubjectForm(false);
    setEditingSubject(undefined);
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      deleteSubject(id);
    }
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
            onEdit={handleEditSubject}
            onDelete={handleDeleteSubject}
            onAdd={handleAddSubject}
          />
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
    </div>
  );
}

export default App;