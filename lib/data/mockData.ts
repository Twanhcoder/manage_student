import { Student, Subject } from '../types';

export const mockStudents: Student[] = [
  {
    id: '1',
    fullName: 'John Smith',
    gender: 'Male',
    dateOfBirth: '2005-03-15',
    class: 'Grade 10A',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    subjects: ['MATH101', 'ENG101', 'SCI101'],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    fullName: 'Emma Johnson',
    gender: 'Female',
    dateOfBirth: '2004-07-22',
    class: 'Grade 11B',
    email: 'emma.johnson@email.com',
    phone: '+1 (555) 234-5678',
    address: '456 Oak Ave, City, State 12345',
    subjects: ['MATH201', 'ENG201', 'SCI201', 'HIST201'],
    createdAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    fullName: 'Michael Brown',
    gender: 'Male',
    dateOfBirth: '2006-01-08',
    class: 'Grade 9C',
    email: 'michael.brown@email.com',
    phone: '+1 (555) 345-6789',
    address: '789 Pine St, City, State 12345',
    subjects: ['MATH001', 'ENG001', 'SCI001'],
    createdAt: '2024-01-12T09:15:00Z'
  },
  {
    id: '4',
    fullName: 'Sarah Davis',
    gender: 'Female',
    dateOfBirth: '2005-11-30',
    class: 'Grade 10A',
    email: 'sarah.davis@email.com',
    phone: '+1 (555) 456-7890',
    address: '321 Elm St, City, State 12345',
    subjects: ['MATH101', 'ENG101', 'ART101'],
    createdAt: '2024-01-08T16:45:00Z'
  },
  {
    id: '5',
    fullName: 'David Wilson',
    gender: 'Male',
    dateOfBirth: '2004-05-17',
    class: 'Grade 11A',
    email: 'david.wilson@email.com',
    phone: '+1 (555) 567-8901',
    address: '654 Maple Ave, City, State 12345',
    subjects: ['MATH201', 'ENG201', 'SCI201', 'HIST201', 'ART201'],
    createdAt: '2024-01-05T11:20:00Z'
  },
  {
    id: '6',
    fullName: 'Lisa Anderson',
    gender: 'Female',
    dateOfBirth: '2006-09-12',
    class: 'Grade 9A',
    email: 'lisa.anderson@email.com',
    phone: '+1 (555) 678-9012',
    address: '987 Cedar St, City, State 12345',
    subjects: ['MATH001', 'ENG001', 'SCI001', 'ART001'],
    createdAt: '2024-01-03T13:10:00Z'
  },
  {
    id: '7',
    fullName: 'James Miller',
    gender: 'Male',
    dateOfBirth: '2005-12-25',
    class: 'Grade 10B',
    email: 'james.miller@email.com',
    phone: '+1 (555) 789-0123',
    address: '147 Birch St, City, State 12345',
    subjects: ['MATH101', 'ENG101', 'SCI101', 'HIST101'],
    createdAt: '2024-01-01T08:30:00Z'
  },
  {
    id: '8',
    fullName: 'Ashley Taylor',
    gender: 'Female',
    dateOfBirth: '2004-04-03',
    class: 'Grade 11C',
    email: 'ashley.taylor@email.com',
    phone: '+1 (555) 890-1234',
    address: '258 Spruce Ave, City, State 12345',
    subjects: ['MATH201', 'ENG201', 'SCI201'],
    createdAt: '2023-12-28T15:45:00Z'
  }
];

export const mockSubjects: Subject[] = [
  {
    id: 'MATH001',
    name: 'Basic Mathematics',
    code: 'MATH001',
    description: 'Fundamental mathematical concepts for Grade 9 students',
    credits: 3,
    instructor: 'Dr. Sarah Johnson',
    department: 'Mathematics',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'MATH101',
    name: 'Algebra I',
    code: 'MATH101',
    description: 'Introduction to algebraic concepts and problem solving',
    credits: 4,
    instructor: 'Prof. Michael Chen',
    department: 'Mathematics',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'MATH201',
    name: 'Advanced Algebra',
    code: 'MATH201',
    description: 'Advanced algebraic concepts and applications',
    credits: 4,
    instructor: 'Dr. Emily Rodriguez',
    department: 'Mathematics',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'ENG001',
    name: 'English Literature I',
    code: 'ENG001',
    description: 'Introduction to English literature and writing',
    credits: 3,
    instructor: 'Ms. Jennifer Adams',
    department: 'English',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'ENG101',
    name: 'English Composition',
    code: 'ENG101',
    description: 'Advanced writing and composition skills',
    credits: 3,
    instructor: 'Dr. Robert Wilson',
    department: 'English',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'ENG201',
    name: 'Advanced Literature',
    code: 'ENG201',
    description: 'Study of classical and modern literature',
    credits: 4,
    instructor: 'Prof. Lisa Thompson',
    department: 'English',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'SCI001',
    name: 'General Science',
    code: 'SCI001',
    description: 'Introduction to basic scientific principles',
    credits: 3,
    instructor: 'Dr. David Martinez',
    department: 'Science',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'SCI101',
    name: 'Biology I',
    code: 'SCI101',
    description: 'Introduction to biological sciences',
    credits: 4,
    instructor: 'Dr. Amanda Foster',
    department: 'Science',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'SCI201',
    name: 'Chemistry I',
    code: 'SCI201',
    description: 'Fundamental principles of chemistry',
    credits: 4,
    instructor: 'Prof. James Parker',
    department: 'Science',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'HIST101',
    name: 'World History',
    code: 'HIST101',
    description: 'Survey of world historical events and cultures',
    credits: 3,
    instructor: 'Dr. Maria Garcia',
    department: 'History',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'HIST201',
    name: 'Modern History',
    code: 'HIST201',
    description: 'Study of modern historical developments',
    credits: 3,
    instructor: 'Prof. Thomas Lee',
    department: 'History',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'ART001',
    name: 'Art Fundamentals',
    code: 'ART001',
    description: 'Basic principles of visual arts',
    credits: 2,
    instructor: 'Ms. Rachel Green',
    department: 'Arts',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'ART101',
    name: 'Drawing & Painting',
    code: 'ART101',
    description: 'Intermediate drawing and painting techniques',
    credits: 3,
    instructor: 'Prof. Kevin Brown',
    department: 'Arts',
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: 'ART201',
    name: 'Advanced Art',
    code: 'ART201',
    description: 'Advanced artistic techniques and portfolio development',
    credits: 4,
    instructor: 'Dr. Nicole White',
    department: 'Arts',
    createdAt: '2024-01-01T08:00:00Z'
  }
];

export const classList = [
  'Grade 9A', 'Grade 9B', 'Grade 9C',
  'Grade 10A', 'Grade 10B', 'Grade 10C',
  'Grade 11A', 'Grade 11B', 'Grade 11C',
  'Grade 12A', 'Grade 12B', 'Grade 12C'
]