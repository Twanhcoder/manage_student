// lib/services/studentService.ts
import { Student, CreateStudentRequest, ApiResponse } from "../types";

const API_BASE = "/api/students";

export const studentService = {
  // Lấy danh sách students với filters
  async getStudents(params?: {
    class?: string;
    grade?: string;
    search?: string;
  }): Promise<Student[]> {
    const searchParams = new URLSearchParams();

    if (params?.class) searchParams.append("class", params.class);
    if (params?.grade) searchParams.append("grade", params.grade);
    if (params?.search) searchParams.append("search", params.search);

    const url = `${API_BASE}${
      searchParams.toString() ? "?" + searchParams.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Student[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch students");
    }

    return data.data || [];
  },

  // Tạo student mới
  async createStudent(studentData: CreateStudentRequest): Promise<Student> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse<Student> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create student");
    }

    return data.data!;
  },

  // Cập nhật student
  async updateStudent(
    id: string,
    updateData: Partial<Student>
  ): Promise<Student> {
    const response = await fetch(`${API_BASE}?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse<Student> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to update student");
    }

    return data.data!;
  },

  // Xóa student
  async deleteStudent(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to delete student");
    }
  },
};
