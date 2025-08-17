import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Student, Subject } from '../../lib/types';
import { calculateAge } from '@/lib/utils/dateUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsProps {
  students: Student[];
  subjects: Subject[];
}

const Charts: React.FC<ChartsProps> = ({ students, subjects }) => {
  // Gender distribution data
  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [
          students.filter(s => s.gender === 'Male').length,
          students.filter(s => s.gender === 'Female').length,
        ],
        backgroundColor: ['#3B82F6', '#EC4899'],
        borderWidth: 0,
      },
    ],
  };

  // Class distribution data
  const classDistribution = students.reduce((acc, student) => {
    acc[student.class] = (acc[student.class] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const classData = {
    labels: Object.keys(classDistribution),
    datasets: [
      {
        data: Object.values(classDistribution),
        backgroundColor: '#3B82F6',
        borderRadius: 4,
      },
    ],
  };

  // Age distribution data
  const ageDistribution = students.reduce((acc, student) => {
    const age = calculateAge(student.dateOfBirth);
    const ageGroup = `${Math.floor(age / 2) * 2}-${Math.floor(age / 2) * 2 + 1}`;
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ageData = {
    labels: Object.keys(ageDistribution).sort(),
    datasets: [
      {
        data: Object.values(ageDistribution),
        backgroundColor: '#10B981',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // Subject enrollment data
  const subjectEnrollments = students.reduce((acc, student) => {
    (student.subjects || []).forEach(subjectId => {
      const subject = subjects.find(s => s.id === subjectId);
      if (subject) {
        acc[subject.name] = (acc[subject.name] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const topSubjects = Object.entries(subjectEnrollments)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  const subjectData = {
    labels: topSubjects.map(([name]) => name),
    datasets: [
      {
        data: topSubjects.map(([, count]) => count),
        backgroundColor: '#F59E0B',
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gender Distribution</h3>
        <div className="h-64">
          <Doughnut data={genderData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Students by Class</h3>
        <div className="h-64">
          <Bar data={classData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Age Distribution</h3>
        <div className="h-64">
          <Bar data={ageData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Subjects</h3>
        <div className="h-64">
          <Bar data={subjectData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Charts;