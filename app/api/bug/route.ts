import { db } from "@/lib/db";
import {
  collection,
  addDoc,
  getDocs,
  collectionGroup,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { emailAddress, title, description, status, severity } = body;
  const createdAt = new Date().toLocaleString();
  try {
    const docRef = await addDoc(collection(db, "Bug", emailAddress, "bugs"), {
      title,
      description,
      status,
      severity,
      createdAt,
      emailAddress,
    });
    console.log("Document written with ID: ", docRef.id);
    return NextResponse.json({ result: "added a bug" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("email");
  const result: unknown[] = [];

  if (!userEmail) {
    return NextResponse.json({ result: "Missig email" }, { status: 500 });
  }
  const querySnapshot = await getDocs(collectionGroup(db, "bugs"));
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
    console.log(doc.id, " => ", doc.data());
  });
  return NextResponse.json({ result }, { status: 200 });
}
