import { Attendance, CreateAttendanceRequest, ApiResponse } from "../types";

const API_BASE = "/api/attendance";

export const attendanceService = {
  // Get attendance records with filters
  async getAttendance(params?: {
    studentId?: string;
    class?: string;
    date?: string;
    status?: string;
    subject?: string;
  }): Promise<Attendance[]> {
    const searchParams = new URLSearchParams();

    if (params?.studentId) searchParams.append("studentId", params.studentId);
    if (params?.class) searchParams.append("class", params.class);
    if (params?.date) searchParams.append("date", params.date);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.subject) searchParams.append("subject", params.subject);

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

    const data: ApiResponse<Attendance[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch attendance");
    }

    return data.data || [];
  },

  // Create new attendance record
  async createAttendance(attendanceData: CreateAttendanceRequest): Promise<Attendance> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attendanceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse<Attendance> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to create attendance record");
    }

    return data.data!;
  },

  // Update attendance record
  async updateAttendance(
    studentId: string,
    date: string,
    subject: string,
    updateData: Partial<Attendance>
  ): Promise<Attendance> {
    const response = await fetch(`${API_BASE}?studentId=${studentId}&date=${date}&subject=${subject}`, {
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

    const data: ApiResponse<Attendance> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to update attendance record");
    }

    return data.data!;
  },

  // Delete attendance record
  async deleteAttendance(studentId: string, date: string, subject: string): Promise<void> {
    const response = await fetch(`${API_BASE}?studentId=${studentId}&date=${date}&subject=${subject}`, {
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
      throw new Error(data.error || "Failed to delete attendance record");
    }
  },
};