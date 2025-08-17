import { NextRequest, NextResponse } from "next/server";
import { COLLECTIONS, getCollection } from "@/lib/mongodb";
import { ApiResponse, CreateClassRequest, Class } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get("grade");
    const section = searchParams.get("section");

    const collection = await getCollection<Class>(COLLECTIONS.CLASSES);

    let query: any = {};

    // Filter by grade
    if (grade) {
      query.grade = parseInt(grade);
    }

    // Filter by section
    if (section) {
      query.section = section;
    }

    const classes = await collection.find(query).sort({ grade: 1, section: 1 }).toArray();

    return NextResponse.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch classes",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const classData: CreateClassRequest = await request.json();

    // Validation
    if (!classData.className || !classData.grade || !classData.section) {
      return NextResponse.json(
        {
          success: false,
          error: "Class name, grade, and section are required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Class>(COLLECTIONS.CLASSES);

    // Check if class already exists
    const existingClass = await collection.findOne({
      className: classData.className,
    });
    if (existingClass) {
      return NextResponse.json(
        {
          success: false,
          error: "Class already exists",
        },
        { status: 409 }
      );
    }

    const newClass = {
      ...classData,
    } as Class;

    const result = await collection.insertOne(newClass);

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId,
          ...newClass,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create class",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("className");
    const updateData = await request.json();

    if (!className) {
      return NextResponse.json(
        {
          success: false,
          error: "Class name is required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Class>(COLLECTIONS.CLASSES);

    const result = await collection.updateOne({ className }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Class not found",
        },
        { status: 404 }
      );
    }

    const updatedClass = await collection.findOne({ className });

    if (!updatedClass) {
      return NextResponse.json(
        {
          success: false,
          error: "Class not found after update",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedClass,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update class",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("className");

    if (!className) {
      return NextResponse.json(
        {
          success: false,
          error: "Class name is required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<Class>(COLLECTIONS.CLASSES);

    const result = await collection.deleteOne({ className });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Class not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Class deleted successfully" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete class",
      },
      { status: 500 }
    );
  }
}