import { NextResponse } from "next/server";
import { getDoc, doc } from "firebase/firestore";

import { db } from "../../firebase";
export async function POST(req) {
    const reqJSON = await req.json();

    const docRef = doc(db, "businesses", "user_" + reqJSON.userId);
    const snapshot = await getDoc(docRef);
    return NextResponse.json({ name: snapshot.data().name });
}