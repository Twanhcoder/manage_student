import { ObjectId, Document } from "mongodb";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Class interfaces
export interface Class extends Document {
  _id?: ObjectId;
  className: string;
  grade: number;
  section: string;
}

// Student interfaces
export interface Student extends Document {
  id: string;
  fullName: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  class: string;
  email: string;
  phone: string;
  address: string;
  subjects: string[];
  createdAt: string;
}

export interface CreateStudentRequest {
  id: string;
  fullName: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  class: string;
  email: string;
  phone: string;
  address: string;
  subjects: string[];
}

// Subject interfaces
export interface Subject extends Document {
  _id?: ObjectId;
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  instructor: string;
  department: string;
  createdAt: string;
}

export interface CreateSubjectRequest {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  instructor: string;
  department: string;
}

// Teacher interfaces
export interface Teacher extends Document {
  _id?: ObjectId;
  id: string;
  fullName: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  subjectsTaught: string[];
  yearsOfExperience: number;
  qualification: string;
  createdAt: string;
}

export interface CreateTeacherRequest {
  id: string;
  fullName: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  subjectsTaught: string[];
  yearsOfExperience: number;
  qualification: string;
}

// Attendance interfaces
export interface Attendance extends Document {
  _id?: ObjectId;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: "Present" | "Absent" | "Late";
  subject: string;
  teacher: string;
  notes?: string;
  createdAt: string;
}

export interface CreateAttendanceRequest {
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: "Present" | "Absent" | "Late";
  subject: string;
  teacher: string;
  notes?: string;
}

// Schedule interfaces
export interface Period {
  period: number;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  periods: Period[];
}

export interface ClassSchedule extends Document {
  _id?: ObjectId;
  class: string;
  schedule: DaySchedule[];
  academicYear: string;
  createdAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  studentsByClass: Record<string, number>;
  genderDistribution: { male: number; female: number };
  ageDistribution: Record<string, number>;
  totalSubjects: number;
  subjectEnrollments: Record<string, number>;
}

export interface GetStudentsResponse extends ApiResponse {
  data: Student[]
}

export interface GetStudentResponse extends ApiResponse {
  data: Student
}

export interface GetClassesResponse extends ApiResponse {
  data: Class[]
}

export interface GetSubjectsResponse extends ApiResponse {
  data: Subject[]
}

export interface GetTeachersResponse extends ApiResponse {
  data: Teacher[]
}

export interface GetAttendanceResponse extends ApiResponse {
  data: Attendance[]
}

export interface GetScheduleResponse extends ApiResponse {
  data: ClassSchedule
}

export interface GetSchedulesResponse extends ApiResponse {
  data: ClassSchedule[]
}
