import { NextRequest, NextResponse } from "next/server";
import { COLLECTIONS, getCollection } from "@/lib/mongodb";
import { ApiResponse, CreateAttendanceRequest, Attendance } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const className = searchParams.get("class");
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const subject = searchParams.get("subject");

    const collection = await getCollection<Attendance>(COLLECTIONS.ATTENDANCE);

    let query: any = {};

    // Filter by student ID
    if (studentId) {
      query.studentId = studentId;
    }

    // Filter by class
    if (className) {
      query.class = className;
    }

    // Filter by date
    if (date) {
      query.date = date;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by subject
    if (subject) {
      query.subject = subject;
    }

    const attendance = await collection.find(query).sort({ date: -1, createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch attendance",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const attendanceData: CreateAttendanceRequest = await request.json();

    // Validation
    if (!attendanceData.studentId || !attendanceData.studentName || !attendanceData.class || !attendanceData.date || !attendanceData.status || !attendanceData.subject || !attendanceData.teacher) {
      return NextResponse.json(
        {
          success: false,
          error: "Student ID, student name, class, date, status, subject, and teacher are required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Attendance>(COLLECTIONS.ATTENDANCE);

    // Check if attendance record already exists for this student, date, and subject
    const existingAttendance = await collection.findOne({
      studentId: attendanceData.studentId,
      date: attendanceData.date,
      subject: attendanceData.subject,
    });

    if (existingAttendance) {
      return NextResponse.json(
        {
          success: false,
          error: "Attendance record already exists for this student, date, and subject",
        },
        { status: 409 }
      );
    }

    const newAttendance = {
      ...attendanceData,
      createdAt: new Date().toISOString(),
    } as Attendance;

    const result = await collection.insertOne(newAttendance);

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId,
          ...newAttendance,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create attendance record",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const date = searchParams.get("date");
    const subject = searchParams.get("subject");
    const updateData = await request.json();

    if (!studentId || !date || !subject) {
      return NextResponse.json(
        {
          success: false,
          error: "Student ID, date, and subject are required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Attendance>(COLLECTIONS.ATTENDANCE);

    const result = await collection.updateOne(
      { studentId, date, subject },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Attendance record not found",
        },
        { status: 404 }
      );
    }

    const updatedAttendance = await collection.findOne({ studentId, date, subject });

    if (!updatedAttendance) {
      return NextResponse.json(
        {
          success: false,
          error: "Attendance record not found after update",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedAttendance,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update attendance record",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const date = searchParams.get("date");
    const subject = searchParams.get("subject");

    if (!studentId || !date || !subject) {
      return NextResponse.json(
        {
          success: false,
          error: "Student ID, date, and subject are required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Attendance>(COLLECTIONS.ATTENDANCE);

    const result = await collection.deleteOne({ studentId, date, subject });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Attendance record not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Attendance record deleted successfully" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete attendance record",
      },
      { status: 500 }
    );
  }
}