import { ClassSchedule, CreateClassScheduleRequest, ApiResponse } from "../types";

const API_BASE = "/api/schedules";

export const scheduleService = {
  // Get schedules with filters
  async getSchedules(params?: {
    class?: string;
    academicYear?: string;
  }): Promise<ClassSchedule[]> {
    const searchParams = new URLSearchParams();

    if (params?.class) searchParams.append("class", params.class);
    if (params?.academicYear) searchParams.append("academicYear", params.academicYear);

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

    const data: ApiResponse<ClassSchedule[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch schedules");
    }

    return data.data || [];
  },

  // Create new schedule
  async createSchedule(scheduleData: CreateClassScheduleRequest): Promise<ClassSchedule> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse<ClassSchedule> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create schedule");
    }

    return data.data!;
  },

  // Update schedule
  async updateSchedule(
    className: string,
    academicYear: string,
    updateData: Partial<ClassSchedule>
  ): Promise<ClassSchedule> {
    const response = await fetch(`${API_BASE}?class=${className}&academicYear=${academicYear}`, {
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

    const data: ApiResponse<ClassSchedule> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to update schedule");
    }

    return data.data!;
  },

  // Delete schedule
  async deleteSchedule(className: string, academicYear: string): Promise<void> {
    const response = await fetch(`${API_BASE}?class=${className}&academicYear=${academicYear}`, {
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
      throw new Error(data.error || "Failed to delete schedule");
    }
  },
};