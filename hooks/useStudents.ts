// hooks/useStudents.ts
import { useState, useEffect, useCallback } from "react";
import { Student, CreateStudentRequest } from "../lib/types";
import { studentService } from "@/lib/service/studentService";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate simple student ID
  const generateStudentId = () => {
    return `STU${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 5)}`.toUpperCase();
  };

  // Fetch students from API
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch students");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new student
  const addStudent = useCallback(
    async (studentData: Omit<Student, "id" | "createdAt">) => {
      try {
        const newStudentData: CreateStudentRequest & { id: string } = {
          id: generateStudentId(),
          fullName: studentData.fullName,
          gender: studentData.gender,
          dateOfBirth: studentData.dateOfBirth,
          class: studentData.class,
          email: studentData.email,
          phone: studentData.phone,
          address: studentData.address,
          subjects: studentData.subjects || [],
        };

        const newStudent = await studentService.createStudent(newStudentData);
        setStudents((prev) => [newStudent, ...prev]);
        return newStudent;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create student";
        console.error("Error creating student:", err);
        alert(errorMessage); // You can replace with toast notification
        throw err;
      }
    },
    []
  );

  // Update student
  const updateStudent = useCallback(
    async (id: string, updateData: Partial<Student>) => {
      try {
        const updatedStudent = await studentService.updateStudent(
          id,
          updateData
        );
        setStudents((prev) =>
          prev.map((student) => (student.id === id ? updatedStudent : student))
        );
        return updatedStudent;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update student";
        console.error("Error updating student:", err);
        alert(errorMessage); // You can replace with toast notification
        throw err;
      }
    },
    []
  );

  // Delete student
  const deleteStudent = useCallback(async (id: string) => {
    try {
      await studentService.deleteStudent(id);
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete student";
      console.error("Error deleting student:", err);
      alert(errorMessage); // You can replace with toast notification
      throw err;
    }
  }, []);

  // Refresh students
  const refreshStudents = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Initial fetch
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    refreshStudents,
  };
};
