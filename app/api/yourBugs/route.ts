import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { collection, getDocs } from "firebase/firestore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userEmail = searchParams.get("email");

  if(!userEmail){
    return NextResponse.json({error:"No Email id"},{status:500})
  }
  const querySnapshot = await getDocs(collection(db, 'Bug',userEmail,'bugs'));
  const result:unknown[] = []
  querySnapshot.forEach((doc) => {
    result.push(doc.data())
  });

  return NextResponse.json({result},{status:200})
}

export async function PATCH(req:Request) {
  
}