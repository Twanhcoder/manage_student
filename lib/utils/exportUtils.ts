import { Student } from '../types';

export const exportToCSV = (students: Student[], filename: string) => {
  const headers = [
    'Full Name',
    'Gender',
    'Date of Birth',
    'Class',
    'Email',
    'Phone',
    'Address',
    'Created At'
  ];

  const csvContent = [
    headers.join(','),
    ...students.map(student => [
      `"${student.fullName}"`,
      student.gender,
      student.dateOfBirth,
      `"${student.class}"`,
      student.email,
      `"${student.phone}"`,
      `"${student.address}"`,
      student.createdAt
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};