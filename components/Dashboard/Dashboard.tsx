import React from 'react';
import { Users, GraduationCap, Calendar, BookOpen } from 'lucide-react';
import StatsCard from './StatsCard';
import Charts from './Charts';
import { Student, Subject } from '../../lib/types';
import { calculateAge } from '@/lib/utils/dateUtils';

interface DashboardProps {
  students: Student[];
  subjects: Subject[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, subjects }) => {
  const totalStudents = students.length;
  const totalSubjects = subjects.length;
  const maleStudents = students.filter(s => s.gender === 'Male').length;
  const femaleStudents = students.filter(s => s.gender === 'Female').length;
  
  const classDistribution = students.reduce((acc, student) => {
    acc[student.class] = (acc[student.class] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const totalClasses = Object.keys(classDistribution).length;
  
  const averageAge = students.length > 0 
    ? students.reduce((sum, student) => sum + calculateAge(student.dateOfBirth), 0) / students.length 
    : 0;

  // Calculate total enrollments
  const totalEnrollments = students.reduce((sum, student) => sum + (student.subjects?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening at your school today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          color="bg-blue-600"
        />
        <StatsCard
          title="Active Classes"
          value={totalClasses}
          icon={GraduationCap}
          trend={{ value: 2, isPositive: true }}
          color="bg-green-600"
        />
        <StatsCard
          title="Total Subjects"
          value={totalSubjects}
          icon={BookOpen}
          trend={{ value: 5, isPositive: true }}
          color="bg-purple-600"
        />
        <StatsCard
          title="Total Enrollments"
          value={totalEnrollments}
          icon={GraduationCap}
          trend={{ value: 15, isPositive: true }}
          color="bg-orange-600"
        />
        <StatsCard
          title="Average Age"
          value={`${averageAge.toFixed(1)} years`}
          icon={Calendar}
          color="bg-indigo-600"
        />
      </div>

      {/* Charts */}
      <Charts students={students} subjects={subjects} />

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {students.slice(0, 5).map((student) => (
            <div key={student.id} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {student.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.fullName} joined {student.class}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(student.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;