import { useState } from 'react';
import { Subject } from '../lib/types';
import { mockSubjects } from '@/lib/data/mockData';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [loading, setLoading] = useState(false);

  const addSubject = (subject: Omit<Subject, 'id' | 'createdAt'>) => {
    const newSubject: Subject = {
      ...subject,
      id: subject.code,
      createdAt: new Date().toISOString()
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === id ? { ...subject, ...updates } : subject
      )
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  const getSubjectById = (id: string) => {
    return subjects.find(subject => subject.id === id);
  };

  const getSubjectsByIds = (ids: string[]) => {
    return subjects.filter(subject => ids.includes(subject.id));
  };

  return {
    subjects,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
    getSubjectsByIds
  };
};