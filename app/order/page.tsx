"use client";
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react';
import { navigate } from '../actions';
export default function Order() {
    const searchParams = useSearchParams();
    //const order = JSON.parse(decodeURI(searchParams.get('args') ?? 'null'));
    const orderString = searchParams.get('args') ?? 'null'
    const order = JSON.parse(decodeURI(orderString));
    useEffect(() => {
        console.log("I fired")
        const fetchAndRedirect = async () => {
            const response = await fetch('/api/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    req: {
                        order: order,//Order includes userid
                    }
                })
            })
            const resJSON = await response.json();
            navigate(resJSON.link)
        }
        fetchAndRedirect();
    }, [order])
    return <p>Redirecting...</p>
}