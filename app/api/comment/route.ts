import { db } from "@/lib/db";
import { addDoc, collection, deleteDoc, doc, getDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import { query, getDocs } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, authorId, bugId } = body;
    const createdAt = new Date().toLocaleString();

    await addDoc(collection(db, "comments"), {
      text: text,
      authorId: authorId,
      bugId: bugId,
      createdAt: createdAt,
    });
    return NextResponse.json({ result: "Uploaded a comment" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bugId = searchParams.get("bugId");
  const q = query(collection(db, "comments"), where("bugId", "==", bugId));

  const result: unknown[] = [];
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    result.push({...doc.data(),id:doc.id});
    console.log(doc.id, " => ", doc.data());
  });

  return NextResponse.json({ result }, { status: 200 });
}


export async function DELETE(req:Request) {
    const {searchParams} = new URL(req.url)
    const email = searchParams.get("email");
  const commentid = searchParams.get("commentid");
  const bugId = searchParams.get("bugId");


    if (!commentid || !email || !bugId){
        return NextResponse.json({error:"sdfsdfsd"},{status:500})
    }
    const docRef = doc(db, "comments", commentid);
    const Docs = await getDoc(docRef)
    const commentData = Docs.data()

    if(!commentData){
        return null
    }

    if(commentData.authorId !== email){
        return NextResponse.json({error:"You are not author of this comment"},{status:500})
    }

    if(commentData.bugId !== bugId){
        return NextResponse.json({error:"You are not author of this comment"},{status:500})
    }
    await deleteDoc(docRef);

  return NextResponse.json({ success: :"deleted" }, { status: 200 });
}