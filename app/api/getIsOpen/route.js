import { NextResponse } from "next/server";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from '@clerk/nextjs/server';

import { db } from "../../firebase";
export async function POST(req) {
    let {userId} = getAuth(req);
    const reqJSON = await req.json();
    if(!userId){
        userId = "user_"+reqJSON.userId;
    }
    const docRef = doc(db, "businesses", userId);
    const snapshot = await getDoc(docRef);
    console.log(userId)
    const isOpen = snapshot.data().isOpen;
    return NextResponse.json({ isOpen: isOpen });
}