import { useState, useEffect, useCallback } from 'react';
import { ClassSchedule, CreateClassScheduleRequest } from '../lib/types';
import { scheduleService } from '@/lib/service/scheduleService';

interface UseSchedulesOptions {
  class?: string;
  academicYear?: string;
}

export const useSchedules = (options?: UseSchedulesOptions) => {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedules from API
  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scheduleService.getSchedules(options);
      setSchedules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  }, [options?.class, options?.academicYear]);

  // Load schedules on mount and when options change
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Add new schedule
  const addSchedule = async (scheduleData: CreateClassScheduleRequest) => {
    try {
      setError(null);
      const newSchedule = await scheduleService.createSchedule(scheduleData);
      setSchedules(prev => [...prev, newSchedule]);
      return { success: true, data: newSchedule };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create schedule';
      setError(errorMessage);
      console.error('Error creating schedule:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Update existing schedule
  const updateSchedule = async (className: string, academicYear: string, updates: Partial<ClassSchedule>) => {
    try {
      setError(null);
      const updatedSchedule = await scheduleService.updateSchedule(className, academicYear, updates);
      setSchedules(prev => 
        prev.map(schedule => 
          schedule.class === className && schedule.academicYear === academicYear 
            ? updatedSchedule 
            : schedule
        )
      );
      return { success: true, data: updatedSchedule };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update schedule';
      setError(errorMessage);
      console.error('Error updating schedule:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Delete schedule
  const deleteSchedule = async (className: string, academicYear: string) => {
    try {
      setError(null);
      await scheduleService.deleteSchedule(className, academicYear);
      setSchedules(prev => prev.filter(schedule => 
        !(schedule.class === className && schedule.academicYear === academicYear)
      ));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete schedule';
      setError(errorMessage);
      console.error('Error deleting schedule:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Get schedule by class and academic year
  const getScheduleByClass = (className: string, academicYear: string = '2023-2024') => {
    return schedules.find(schedule => 
      schedule.class === className && schedule.academicYear === academicYear
    );
  };

  // Refresh schedules
  const refresh = () => {
    fetchSchedules();
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    schedules,
    loading,
    error,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleByClass,
    refresh,
    clearError
  };
};