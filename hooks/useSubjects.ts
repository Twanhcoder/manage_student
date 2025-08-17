import { useState, useEffect, useCallback } from 'react';
import { Subject, CreateSubjectRequest } from '../lib/types';
import { subjectService } from '@/lib/service/subjectService';

interface UseSubjectsOptions {
  department?: string;
  search?: string;
}

export const useSubjects = (options?: UseSubjectsOptions) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subjects from API
  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subjectService.getSubjects(options);
      setSubjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subjects');
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  }, [options?.department, options?.search]);

  // Load subjects on mount and when options change
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Add new subject
  const addSubject = async (subjectData: CreateSubjectRequest) => {
    try {
      setError(null);
      const newSubject = await subjectService.createSubject(subjectData);
      setSubjects(prev => [...prev, newSubject]);
      return { success: true, data: newSubject };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subject';
      setError(errorMessage);
      console.error('Error creating subject:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Update existing subject
  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    try {
      setError(null);
      const updatedSubject = await subjectService.updateSubject(id, updates);
      setSubjects(prev => 
        prev.map(subject => 
          subject.id === id ? updatedSubject : subject
        )
      );
      return { success: true, data: updatedSubject };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subject';
      setError(errorMessage);
      console.error('Error updating subject:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Delete subject
  const deleteSubject = async (id: string) => {
    try {
      setError(null);
      await subjectService.deleteSubject(id);
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete subject';
      setError(errorMessage);
      console.error('Error deleting subject:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Get subject by ID
  const getSubjectById = (id: string) => {
    return subjects.find(subject => subject.id === id);
  };

  // Get subjects by IDs
  const getSubjectsByIds = (ids: string[]) => {
    return subjects.filter(subject => ids.includes(subject.id));
  };

  // Refresh subjects (useful for manual refresh)
  const refresh = () => {
    fetchSubjects();
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    subjects,
    loading,
    error,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
    getSubjectsByIds,
    refresh,
    clearError
  };
};