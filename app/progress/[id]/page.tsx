"use client";
import { time } from "console";
import { useEffect, useRef, useState } from "react";
export default function Progress({ params: { id } }: { params: { id: string } }) {
    const [status, setStatus] = useState<string>("");
    const [customerName, setCustomerName] = useState<string>("");
    const [width, setWidth] = useState<number>(0);
    let pollingRef:React.MutableRefObject<any> = useRef<any>(null);// My sanity was destroyed by this line
    useEffect(() => {
        fetch("/api/getOrderStatus", {method: "POST", body: JSON.stringify({id: id})}).then((res) => res.json()).then((data) => {
            setStatus(data.status);
            setCustomerName(data.customerName);
        });
        const startPolling = () => {
            pollingRef.current = setInterval(() => {
                fetch("/api/getOrderStatus", {method: "POST", body: JSON.stringify({id: id})}).then((res) => res.json()).then((data) => {
                    setStatus(data.status);
                    setCustomerName(data.order.customerName);
                });
            }, 10000); // Poll every 10 seconds
          };
          startPolling();
          return () => {
            clearInterval(pollingRef.current);
          };
    }, []);
    useEffect(() => {
        if (status === "ready") {
            setWidth(100);
        } else if (status === "cooking") {
            setWidth(50);
        } else {
            setWidth(0);
        }
    }, [status]);
    return (
        <div>
            <h1 className="text-3xl font-bold text-center">Order status</h1>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${width}%` }}></div>
            </div>
            <p>Good {(new Date()).getHours() < 12 ? "morning" : (new Date()).getHours() < 18 ? "afternoon" : "evening"}, {customerName}! Your order is {status}.</p>
        </div>
    )
}