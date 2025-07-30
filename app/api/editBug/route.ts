import { db } from "@/lib/db";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userEmail = searchParams.get("email");
  const id = searchParams.get("id");

  if (!userEmail || !id) {
    return NextResponse.json({ error: "No Email id" }, { status: 500 });
  }

  const querySnapshot = await getDoc(doc(db, "Bug", userEmail, "bugs", id));
  const result: unknown[] = [];

  result.push({ ...querySnapshot.data(), id: querySnapshot.id });

  return NextResponse.json({ result }, { status: 200 });
}
