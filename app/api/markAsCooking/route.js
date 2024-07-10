import { NextResponse } from "next/server";
import { updateDoc, doc } from "firebase/firestore";
import { getAuth } from '@clerk/nextjs/server';

import { db } from "../../firebase";
export async function POST(req) {
    const {userId} = getAuth(req);
    const reqJson = await req.json();
    if(!userId){
        return new Response("Unauthorized", { status: 401 });
    }
    const statusRef = doc(db, "progress", reqJson.id);
    await updateDoc(statusRef, {
        status: "cooking"
    });
    return NextResponse.json({ response: "success" });
}