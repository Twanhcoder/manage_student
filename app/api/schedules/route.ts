import { NextRequest, NextResponse } from "next/server";
import { COLLECTIONS, getCollection } from "@/lib/mongodb";
import { ApiResponse, CreateClassScheduleRequest, ClassSchedule } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("class");
    const academicYear = searchParams.get("academicYear");

    const collection = await getCollection<ClassSchedule>(COLLECTIONS.SCHEDULES);

    let query: any = {};

    // Filter by class
    if (className) {
      query.class = className;
    }

    // Filter by academic year
    if (academicYear) {
      query.academicYear = academicYear;
    }

    const schedules = await collection.find(query).toArray();

    return NextResponse.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch schedules",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const scheduleData: CreateClassScheduleRequest = await request.json();

    // Validation
    if (!scheduleData.class || !scheduleData.schedule || !scheduleData.academicYear) {
      return NextResponse.json(
        {
          success: false,
          error: "Class, schedule, and academic year are required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<ClassSchedule>(COLLECTIONS.SCHEDULES);

    // Check if schedule already exists for this class and academic year
    const existingSchedule = await collection.findOne({
      class: scheduleData.class,
      academicYear: scheduleData.academicYear,
    });
    if (existingSchedule) {
      return NextResponse.json(
        {
          success: false,
          error: "Schedule already exists for this class and academic year",
        },
        { status: 409 }
      );
    }

    const newSchedule = {
      ...scheduleData,
      createdAt: new Date().toISOString(),
    } as ClassSchedule;

    const result = await collection.insertOne(newSchedule);

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: result.insertedId,
          ...newSchedule,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create schedule",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("class");
    const academicYear = searchParams.get("academicYear");
    const updateData = await request.json();

    if (!className || !academicYear) {
      return NextResponse.json(
        {
          success: false,
          error: "Class and academic year are required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<ClassSchedule>(COLLECTIONS.SCHEDULES);

    const result = await collection.updateOne(
      { class: className, academicYear },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Schedule not found",
        },
        { status: 404 }
      );
    }

    const updatedSchedule = await collection.findOne({ class: className, academicYear });

    if (!updatedSchedule) {
      return NextResponse.json(
        {
          success: false,
          error: "Schedule not found after update",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSchedule,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update schedule",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get("class");
    const academicYear = searchParams.get("academicYear");

    if (!className || !academicYear) {
      return NextResponse.json(
        {
          success: false,
          error: "Class and academic year are required",
        },
        { status: 400 }
      );
    }

    const collection = await getCollection<ClassSchedule>(COLLECTIONS.SCHEDULES);

    const result = await collection.deleteOne({ class: className, academicYear });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Schedule not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Schedule deleted successfully" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete schedule",
      },
      { status: 500 }
    );
  }
}