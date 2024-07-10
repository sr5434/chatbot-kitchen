import { NextResponse } from "next/server";
import { updateDoc, setDoc, doc, arrayUnion } from "firebase/firestore";
import { randomUUID } from "crypto";
import { db } from "../../firebase";

export async function POST(req) {
    const reqJSON = await req.json();
    const id = randomUUID();
    const ordersRef = doc(db, "orders", reqJSON.req.order.userId);
    const progressRef = doc(db, "progress", id);
    let order = reqJSON.req.order;
    order.id = id;
    updateDoc(ordersRef, {
        orders: arrayUnion(order)
    });
    setDoc(progressRef, {
        status: "pending",
        order: order
    })
    return NextResponse.json({ link: `${process.env.URL_BASE}/progress/${id}` });
}