import { NextResponse } from "next/server";
import { getDoc, doc } from "firebase/firestore";

import { db } from "../../firebase";
export async function POST(req) {
    const reqJSON = await req.json();

    const docRef = doc(db, "progress", reqJSON.id);
    const snapshot = await getDoc(docRef);
    return NextResponse.json(snapshot.data());
}