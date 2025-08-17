import { Teacher, CreateTeacherRequest, ApiResponse } from "../types";

const API_BASE = "/api/teachers";

export const teacherService = {
  // Get teachers with filters
  async getTeachers(params?: {
    department?: string;
    search?: string;
  }): Promise<Teacher[]> {
    const searchParams = new URLSearchParams();

    if (params?.department) searchParams.append("department", params.department);
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

    const data: ApiResponse<Teacher[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch teachers");
    }

    return data.data || [];
  },

  // Create new teacher
  async createTeacher(teacherData: CreateTeacherRequest): Promise<Teacher> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacherData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse<Teacher> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create teacher");
    }

    return data.data!;
  },

  // Update teacher
  async updateTeacher(
    id: string,
    updateData: Partial<Teacher>
  ): Promise<Teacher> {
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

    const data: ApiResponse<Teacher> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to update teacher");
    }

    return data.data!;
  },

  // Delete teacher
  async deleteTeacher(id: string): Promise<void> {
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
      throw new Error(data.error || "Failed to delete teacher");
    }
  },
};