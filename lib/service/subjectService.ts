import { Subject, CreateSubjectRequest, ApiResponse } from "../types";

const API_BASE = "/api/subjects";

export const subjectService = {
  // Get subjects with filters
  async getSubjects(params?: {
    department?: string;
    search?: string;
  }): Promise<Subject[]> {
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

    const data: ApiResponse<Subject[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch subjects");
    }

    return data.data || [];
  },

  // Create new subject
  async createSubject(subjectData: CreateSubjectRequest): Promise<Subject> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subjectData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse<Subject> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create subject");
    }

    return data.data!;
  },

  // Update subject
  async updateSubject(
    id: string,
    updateData: Partial<Subject>
  ): Promise<Subject> {
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

    const data: ApiResponse<Subject> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to update subject");
    }

    return data.data!;
  },

  // Delete subject
  async deleteSubject(id: string): Promise<void> {
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
      throw new Error(data.error || "Failed to delete subject");
    }
  },
};