import { NextResponse } from "next/server";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from '@clerk/nextjs/server';

import { db } from "../../firebase";
export async function GET(req) {
    const {userId} = getAuth(req);

    if(!userId){
        return new Response("Unauthorized", { status: 401 });
    }

    const docRef = doc(db, "businesses", userId);
    const snapshot = await getDoc(docRef);
    const config = snapshot.data();
    return NextResponse.json({ config: config });
}