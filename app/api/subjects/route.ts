import { NextRequest, NextResponse } from "next/server";
import { COLLECTIONS, getCollection } from "@/lib/mongodb";
import { ApiResponse, CreateSubjectRequest, Subject } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const search = searchParams.get("search");

    const collection = await getCollection<Subject>(COLLECTIONS.SUBJECTS);

    let query: any = {};

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Search by name, code, or instructor
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { code: new RegExp(search, "i") },
        { instructor: new RegExp(search, "i") },
      ];
    }

    const subjects = await collection.find(query).toArray();

    return NextResponse.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch subjects",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const subjectData: CreateSubjectRequest = await request.json();

    // Validation
    if (!subjectData.id || !subjectData.name || !subjectData.code) {
      return NextResponse.json(
        {
          success: false,
          error: "ID, name, and code are required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Subject>(COLLECTIONS.SUBJECTS);

    // Check if subject ID or code already exists
    const existingSubject = await collection.findOne({
      $or: [{ id: subjectData.id }, { code: subjectData.code }],
    });
    if (existingSubject) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject ID or code already exists",
        },
        { status: 409 }
      );
    }

    const newSubject = {
      ...subjectData,
      createdAt: new Date().toISOString(),
    } as Subject;

    const result = await collection.insertOne(newSubject);

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId,
          ...newSubject,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create subject",
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
          error: "Subject ID is required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Subject>(COLLECTIONS.SUBJECTS);

    const result = await collection.updateOne({ id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject not found",
        },
        { status: 404 }
      );
    }

    const updatedSubject = await collection.findOne({ id });

    if (!updatedSubject) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject not found after update",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSubject,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update subject",
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
          error: "Subject ID is required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Subject>(COLLECTIONS.SUBJECTS);

    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Subject deleted successfully" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete subject",
      },
      { status: 500 }
    );
  }
}