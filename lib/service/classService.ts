import { Class, CreateClassRequest, ApiResponse } from "../types";

const API_BASE = "/api/classes";

export const classService = {
  // Get classes with filters
  async getClasses(params?: {
    grade?: number;
    section?: string;
  }): Promise<Class[]> {
    const searchParams = new URLSearchParams();

    if (params?.grade) searchParams.append("grade", params.grade.toString());
    if (params?.section) searchParams.append("section", params.section);

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

    const data: ApiResponse<Class[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch classes");
    }

    return data.data || [];
  },

  // Create new class
  async createClass(classData: CreateClassRequest): Promise<Class> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse<Class> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create class");
    }

    return data.data!;
  },

  // Update class
  async updateClass(
    className: string,
    updateData: Partial<Class>
  ): Promise<Class> {
    const response = await fetch(`${API_BASE}?className=${className}`, {
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

    const data: ApiResponse<Class> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to update class");
    }

    return data.data!;
  },

  // Delete class
  async deleteClass(className: string): Promise<void> {
    const response = await fetch(`${API_BASE}?className=${className}`, {
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
      throw new Error(data.error || "Failed to delete class");
    }
  },
};