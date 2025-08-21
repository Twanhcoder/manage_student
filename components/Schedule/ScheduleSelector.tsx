import React, { useState, useMemo } from 'react';
import { Clock, Calendar, User, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { ClassSchedule, DaySchedule, Period } from '../../lib/types';

interface ScheduleSelectorProps {
  schedules: ClassSchedule[];
  subjects: Array<{ id: string; name: string; code: string }>;
  teachers: Array<{ id: string; fullName: string; department: string }>;
  classes: string[];
  onSelectPeriod: (classSchedule: ClassSchedule, day: string, period: Period) => void;
  selectedClass?: string;
  onClassChange: (className: string) => void;
}

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  schedules,
  subjects,
  teachers,
  classes,
  onSelectPeriod,
  selectedClass,
  onClassChange
}) => {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  const selectedSchedule = useMemo(() => {
    return schedules.find(schedule => schedule.class === selectedClass);
  }, [schedules, selectedClass]);

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.fullName : teacherId;
  };

  const toggleDayExpansion = (day: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getDayColor = (day: string) => {
    const colors = {
      'Monday': 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      'Tuesday': 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      'Wednesday': 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      'Thursday': 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      'Friday': 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800'
    };
    return colors[day as keyof typeof colors] || 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
  };

  const getPeriodColor = (index: number) => {
    const colors = [
      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
      'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200'
    ];
    return colors[index % colors.length];
  };

  if (!selectedClass) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Class</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Choose a class to view and select from available time slots</p>
          
          <div className="max-w-xs mx-auto">
            <select
              value=""
              onChange={(e) => onClassChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a class...</option>
              {classes.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedSchedule) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Schedule Found</h3>
          <p className="text-gray-500 dark:text-gray-400">No schedule available for {selectedClass}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Class Schedule</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {selectedClass} • Academic Year {selectedSchedule.academicYear}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedClass}
              onChange={(e) => onClassChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {classes.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="p-6">
        <div className="space-y-4">
          {selectedSchedule.schedule.map((daySchedule: DaySchedule) => (
            <div key={daySchedule.day} className={`border rounded-lg ${getDayColor(daySchedule.day)}`}>
              {/* Day Header */}
              <button
                onClick={() => toggleDayExpansion(daySchedule.day)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium text-gray-900 dark:text-white">{daySchedule.day}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {daySchedule.periods.length} period{daySchedule.periods.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {expandedDays[daySchedule.day] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Periods */}
              {expandedDays[daySchedule.day] && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {daySchedule.periods.map((period: Period, index: number) => (
                      <button
                        key={`${daySchedule.day}-${period.period}`}
                        onClick={() => onSelectPeriod(selectedSchedule, daySchedule.day, period)}
                        className={`p-4 rounded-lg border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 text-left ${getPeriodColor(index)} hover:shadow-md`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium opacity-75">Period {period.period}</span>
                          <Clock className="w-4 h-4 opacity-60" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 opacity-60" />
                            <span className="font-medium text-sm">{getSubjectName(period.subject)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 opacity-60" />
                            <span className="text-sm opacity-80">{getTeacherName(period.teacher)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 opacity-60" />
                            <span className="text-sm opacity-80">
                              {formatTime(period.startTime)} - {formatTime(period.endTime)}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedSchedule.schedule.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No schedule periods available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleSelector;