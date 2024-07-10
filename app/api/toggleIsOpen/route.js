import { NextResponse } from "next/server";
import { updateDoc, doc, arrayRemove } from "firebase/firestore";
import { getAuth } from '@clerk/nextjs/server';

import { db } from "../../firebase";
export async function POST(req) {
    const {userId} = getAuth(req);
    const reqJson = await req.json();
    if(!userId){
        return new Response("Unauthorized", { status: 401 });
    }

    const docRef = doc(db, "businesses", userId);
    await updateDoc(docRef, {
        isOpen: reqJson.isOpen
    });
    return NextResponse.json({ response: "success" });
}