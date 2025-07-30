import { db } from "@/lib/db";
import { collection, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Add a new document with a generated id.
  const body = await req.json()
  const {emailAddress,title,description,status,severity} = body
  const createdAt = new Date().toISOString()
  try {
      const docRef = await addDoc(collection(db, "Bug",emailAddress,"bugs"), {
        title,
        description,
        status,
        severity,
        createdAt,
      });
      console.log("Document written with ID: ", docRef.id);
    return NextResponse.json({result:"added a bug"},{status:200})
  } catch (error) {
    return NextResponse.json({error:error},{status:500})
  }
}

// export async function GET() {}
// export async function UPDATE(req: Request) {}
// export async function DELETE(req: Request) {}
