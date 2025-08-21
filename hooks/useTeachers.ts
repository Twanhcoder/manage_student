import { useState, useEffect, useCallback } from 'react';
import { Teacher, CreateTeacherRequest } from '../lib/types';
import { teacherService } from '@/lib/service/teacherService';

interface UseTeachersOptions {
  department?: string;
  search?: string;
}

export const useTeachers = (options?: UseTeachersOptions) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate simple teacher ID
  const generateTeacherId = () => {
    return `T${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 3)}`.toUpperCase();
  };

  // Fetch teachers from API
  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teacherService.getTeachers(options);
      setTeachers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teachers');
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  }, [options?.department, options?.search]);

  // Load teachers on mount and when options change
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Add new teacher
  const addTeacher = async (teacherData: Omit<Teacher, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const newTeacherData: CreateTeacherRequest = {
        id: generateTeacherId(),
        ...teacherData,
      };
      const newTeacher = await teacherService.createTeacher(newTeacherData);
      setTeachers(prev => [newTeacher, ...prev]);
      return { success: true, data: newTeacher };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create teacher';
      setError(errorMessage);
      console.error('Error creating teacher:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Update existing teacher
  const updateTeacher = async (id: string, updates: Partial<Teacher>) => {
    try {
      setError(null);
      const updatedTeacher = await teacherService.updateTeacher(id, updates);
      setTeachers(prev => 
        prev.map(teacher => 
          teacher.id === id ? updatedTeacher : teacher
        )
      );
      return { success: true, data: updatedTeacher };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update teacher';
      setError(errorMessage);
      console.error('Error updating teacher:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Delete teacher
  const deleteTeacher = async (id: string) => {
    try {
      setError(null);
      await teacherService.deleteTeacher(id);
      setTeachers(prev => prev.filter(teacher => teacher.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete teacher';
      setError(errorMessage);
      console.error('Error deleting teacher:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Get teacher by ID
  const getTeacherById = (id: string) => {
    return teachers.find(teacher => teacher.id === id);
  };

  // Get teachers by IDs
  const getTeachersByIds = (ids: string[]) => {
    return teachers.filter(teacher => ids.includes(teacher.id));
  };

  // Refresh teachers (useful for manual refresh)
  const refresh = () => {
    fetchTeachers();
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    teachers,
    loading,
    error,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById,
    getTeachersByIds,
    refresh,
    clearError
  };
};