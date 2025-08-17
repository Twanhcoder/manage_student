// app/api/students/route.ts (App Router)

import { NextRequest, NextResponse } from "next/server";
import { COLLECTIONS, getCollection } from "@/lib/mongodb";
import { ApiResponse, CreateStudentRequest, Student } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("class");
    const grade = searchParams.get("grade");
    const search = searchParams.get("search");

    const collection = await getCollection<Student>(COLLECTIONS.STUDENTS);

    let query: any = {};

    // Filter by class
    if (className) {
      query.class = className;
    }

    if (grade) {
      query.class = new RegExp(`Grade ${grade}`, "i");
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    const students = await collection.find(query).toArray();

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch students",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const studentData: CreateStudentRequest = await request.json();

    // Validation
    if (!studentData.id || !studentData.fullName || !studentData.email) {
      return NextResponse.json(
        {
          success: false,
          error: "ID, full name, and email are required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Student>(COLLECTIONS.STUDENTS);

    // Check if student ID already exists
    const existingStudent = await collection.findOne({
      id: studentData.id,
    });
    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          error: "Student ID already exists",
        },
        { status: 409 }
      );
    }

    const newStudent = {
      ...studentData,
      createdAt: new Date().toISOString(),
    } as Student;

    const result = await collection.insertOne(newStudent);

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId,
          ...newStudent,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create student",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const updateData = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Student ID is required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Student>(COLLECTIONS.STUDENTS);

    const result = await collection.updateOne({ id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Student not found",
        },
        { status: 404 }
      );
    }

    const updatedStudent = await collection.findOne({ id });

    if (!updatedStudent) {
      return NextResponse.json(
        {
          success: false,
          error: "Student not found after update",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update student",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Student ID is required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Student>(COLLECTIONS.STUDENTS);

    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Student not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Student deleted successfully" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete student",
      },
      { status: 500 }
    );
  }
}
