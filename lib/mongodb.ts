// lib/mongodb.ts
import { MongoClient, Db, Collection, Document as MongoDocument } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri: string = process.env.MONGODB_URI || "mongodb://localhost:27017";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Trong development mode, sử dụng global variable để tránh tạo nhiều kết nối
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Trong production mode, tạo client mới
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Hàm helper để lấy database
export async function getDatabase(
  dbName: string = "Manage_Student"
): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

// Hàm helper để lấy collection
export async function getCollection<T extends MongoDocument = MongoDocument>(
  collectionName: string,
  dbName: string = "Manage_Student"
): Promise<Collection<T>> {
  const db = await getDatabase(dbName);
  return db.collection<T>(collectionName);
}

// Collection names constants
export const COLLECTIONS = {
  STUDENTS: "Students",
  TEACHERS: "Teachers",
  SUBJECTS: "Subjects",
  CLASSES: "ClassList",
  ATTENDANCE: "Attendance",
  SCHEDULES: "ClassSchedules",
} as const;