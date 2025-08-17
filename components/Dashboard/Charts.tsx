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
  // Helper function to safely get class name
  const getClassName = (student: Student): string => {
    return student.class || 'Unassigned';
  };

  // Helper function to safely calculate age group
  const getAgeGroup = (dateOfBirth: string): string => {
    try {
      const age = calculateAge(dateOfBirth);
      if (isNaN(age) || age < 0) return 'Unknown';
      
      // Create more meaningful age groups
      if (age < 16) return 'Under 16';
      if (age < 18) return '16-17';
      if (age < 20) return '18-19';
      if (age < 22) return '20-21';
      if (age < 25) return '22-24';
      return '25+';
    } catch (error) {
      return 'Unknown';
    }
  };

  // Gender distribution data with better handling
  const genderCounts = students.reduce((acc, student) => {
    const gender = student.gender || 'Not Specified';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genderData = {
    labels: Object.keys(genderCounts),
    datasets: [
      {
        data: Object.values(genderCounts),
        backgroundColor: [
          '#3B82F6', // Blue for Male
          '#EC4899', // Pink for Female  
          '#6B7280', // Gray for Not Specified
          '#10B981', // Green for other values
        ],
        borderWidth: 0,
      },
    ],
  };

  // Class distribution data with better handling
  const classDistribution = students.reduce((acc, student) => {
    const className = getClassName(student);
    acc[className] = (acc[className] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort classes naturally (Grade 1A, Grade 1B, etc.)
  const sortedClasses = Object.keys(classDistribution).sort((a, b) => {
    if (a === 'Unassigned') return 1;
    if (b === 'Unassigned') return -1;
    return a.localeCompare(b, undefined, { numeric: true });
  });

  const classData = {
    labels: sortedClasses,
    datasets: [
      {
        label: 'Number of Students',
        data: sortedClasses.map(className => classDistribution[className]),
        backgroundColor: '#3B82F6',
        borderRadius: 4,
      },
    ],
  };

  // Age distribution data with better handling
  const ageDistribution = students.reduce((acc, student) => {
    if (!student.dateOfBirth) {
      acc['Unknown'] = (acc['Unknown'] || 0) + 1;
      return acc;
    }
    
    const ageGroup = getAgeGroup(student.dateOfBirth);
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort age groups logically
  const ageGroupOrder = ['Under 16', '16-17', '18-19', '20-21', '22-24', '25+', 'Unknown'];
  const sortedAgeGroups = Object.keys(ageDistribution).sort((a, b) => {
    const indexA = ageGroupOrder.indexOf(a);
    const indexB = ageGroupOrder.indexOf(b);
    return indexA - indexB;
  });

  const ageData = {
    labels: sortedAgeGroups,
    datasets: [
      {
        label: 'Number of Students',
        data: sortedAgeGroups.map(group => ageDistribution[group]),
        backgroundColor: '#10B981',
        borderRadius: 4,
      },
    ],
  };

  // Subject enrollment data with better handling
  const subjectEnrollments = students.reduce((acc, student) => {
    const studentSubjects = student.subjects || [];
    
    studentSubjects.forEach(subjectId => {
      const subject = subjects.find(s => s.id === subjectId);
      if (subject && subject.name) {
        acc[subject.name] = (acc[subject.name] || 0) + 1;
      }
    });
    
    return acc;
  }, {} as Record<string, number>);

  // Get top 8 subjects or all if less than 8
  const topSubjects = Object.entries(subjectEnrollments)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  // If no subjects enrolled, show a placeholder
  const subjectData = topSubjects.length > 0 ? {
    labels: topSubjects.map(([name]) => name),
    datasets: [
      {
        label: 'Enrolled Students',
        data: topSubjects.map(([, count]) => count),
        backgroundColor: '#F59E0B',
        borderRadius: 4,
      },
    ],
  } : {
    labels: ['No Enrollments'],
    datasets: [
      {
        label: 'Enrolled Students',
        data: [0],
        backgroundColor: '#D1D5DB',
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
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Gender Distribution
        </h3>
        <div className="h-64">
          {students.length > 0 ? (
            <Doughnut data={genderData} options={doughnutOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No student data available
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Students by Class
        </h3>
        <div className="h-64">
          {students.length > 0 ? (
            <Bar data={classData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No student data available
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Age Distribution
        </h3>
        <div className="h-64">
          {students.length > 0 ? (
            <Bar data={ageData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No student data available
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Popular Subjects
        </h3>
        <div className="h-64">
          {subjects.length > 0 ? (
            <Bar data={subjectData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No subject data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;