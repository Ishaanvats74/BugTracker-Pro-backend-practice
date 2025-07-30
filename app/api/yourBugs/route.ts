import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userEmail = searchParams.get("email");

  if (!userEmail) {
    return NextResponse.json({ error: "No Email id" }, { status: 500 });
  }
  const querySnapshot = await getDocs(collection(db, "Bug", userEmail, "bugs"));
  const result: unknown[] = [];

  querySnapshot.forEach((doc) => {
    result.push({ ...doc.data(), id: doc.id });
  });

  return NextResponse.json({ result }, { status: 200 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { title, status, severity, description, emailAddress, bugId } = body;
  const frankDocRef = doc(db, "Bug", emailAddress, "bugs", bugId);
  await updateDoc(frankDocRef, {
    title: title,
    status: status,
    severity: severity,
    description: description,
    createdAt: new Date().toLocaleString(),
    emailAddress: emailAddress,
  });
  return NextResponse.json({ result: "Updated" }, { status: 200 });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { userEmail, BugId } = body;

  await deleteDoc(doc(db, "Bug", userEmail, "bugs", BugId));
  return NextResponse.json({ result: "Deleted" }, { status: 200 });
}
