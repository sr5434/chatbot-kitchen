import { NextResponse } from "next/server";
import { getDoc, doc } from "firebase/firestore";

import { db } from "../../firebase";
export async function POST(req) {
    const reqJSON = await req.json();

    const docRef = doc(db, "orders", "user_" + reqJSON.userId);
    const snapshot = await getDoc(docRef);
    const orders = snapshot.data().orders;
    let waitTime = 0;
    for(let i = 0; i < orders.length; i++){
        waitTime += orders[i].prepTime;
    }
    return NextResponse.json({ time: waitTime });
}