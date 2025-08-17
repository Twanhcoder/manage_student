import { NextRequest, NextResponse } from "next/server";
import { COLLECTIONS, getCollection } from "@/lib/mongodb";
import { ApiResponse, CreateTeacherRequest, Teacher } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const search = searchParams.get("search");

    const collection = await getCollection<Teacher>(COLLECTIONS.TEACHERS);

    let query: any = {};

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    const teachers = await collection.find(query).toArray();

    return NextResponse.json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch teachers",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const teacherData: CreateTeacherRequest = await request.json();

    // Validation
    if (!teacherData.id || !teacherData.fullName || !teacherData.email) {
      return NextResponse.json(
        {
          success: false,
          error: "ID, full name, and email are required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Teacher>(COLLECTIONS.TEACHERS);

    // Check if teacher ID already exists
    const existingTeacher = await collection.findOne({
      id: teacherData.id,
    });
    if (existingTeacher) {
      return NextResponse.json(
        {
          success: false,
          error: "Teacher ID already exists",
        },
        { status: 409 }
      );
    }

    const newTeacher = {
      ...teacherData,
      createdAt: new Date().toISOString(),
    } as Teacher;

    const result = await collection.insertOne(newTeacher);

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId,
          ...newTeacher,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create teacher",
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
          error: "Teacher ID is required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Teacher>(COLLECTIONS.TEACHERS);

    const result = await collection.updateOne({ id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Teacher not found",
        },
        { status: 404 }
      );
    }

    const updatedTeacher = await collection.findOne({ id });

    if (!updatedTeacher) {
      return NextResponse.json(
        {
          success: false,
          error: "Teacher not found after update",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTeacher,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update teacher",
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
          error: "Teacher ID is required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Teacher>(COLLECTIONS.TEACHERS);

    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Teacher not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Teacher deleted successfully" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete teacher",
      },
      { status: 500 }
    );
  }
}