"use client";
import React, { useEffect, useState, useRef } from "react";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

interface DBRecord {
  customerName: string;
  dishes: string[];
  prepTime: number;
  specialInstructions: string;
  id: string;
};

function Item({ data, index, setData, fullData }: { data: DBRecord, index: number, setData: React.Dispatch<React.SetStateAction<DBRecord[]>>, fullData: DBRecord[]}) {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {data.customerName}
        </th>
        <td className="px-6 py-4">
            {data.dishes.join(", ")}
        </td>
        <td className="px-6 py-4">
            {data.specialInstructions}
        </td>
        <td className="px-6 py-4">
          <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={async () => {
            await fetch(`/api/markAsCooking`, {
              method: 'POST',
              body: JSON.stringify({ "id": data.id })
            });
          }}>Mark As Cooking</button>
        </td>
        <td className="px-6 py-4">
          <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={async () => {
            await fetch(`/api/delete`, {
              method: 'POST',
              body: JSON.stringify({ "data": data })
            });
            setData(fullData.toSpliced(index, 1));
          }}>Mark As Complete</button>
        </td>
    </tr>
  );
}

export default function Home() {
  const [url, setURL] = useState("");
  const [data, setData] = useState<DBRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>("");
  const { isSignedIn, user, isLoaded } = useUser();
  useEffect(() => setUserId(user?.id), []);
  useEffect(() => {
    fetch("/api/getURL").then((res) => res.json()).then((data) => {
      setURL(data.url);
    })
  }, []);
  useEffect(() => {
    fetch("/api/getIsOpen", {method: "POST", body: JSON.stringify({userId: user?.id})}).then((res) => res.json()).then((data) => {
      setIsOpen(data.isOpen);
    })
  }, []);
  let pollingRef:React.MutableRefObject<any> = useRef<any>(null);
  useEffect(() => {
    fetch("/api/getOrders").then((res) => res.json()).then((json) => {
      setData(json.orders);
    });
    const startPolling = () => {
      pollingRef.current = setInterval(() => {
        fetch("/api/getOrders").then((res) => res.json()).then((json) => {
          setData(json.orders);
        })
      }, 60000); // Poll every 60 seconds
    };
    startPolling();
    
    return () => {
      clearInterval(pollingRef.current);
    };
  }, []);
  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <UserButton/>
          </div>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a href="/botSettings" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <p className="font-bold">Tell your customers to go to this URL: <a href={url} className="text-blue-500 underline" target="_blank">{url}</a></p>
      {isOpen ? 
          <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={
            () => fetch("/api/toggleIsOpen", {
              method: "POST", 
              body: JSON.stringify({ "isOpen": false })
              }).then((data)=>setIsOpen(false))}>Pause orders</button> : 
          <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={
            () => fetch("/api/toggleIsOpen", {
              method: "POST", 
              body: JSON.stringify({ "isOpen": true })
              }).then((data)=>setIsOpen(true))}>Unpause orders</button>}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Order
                </th>
                <th scope="col" className="px-6 py-3">
                    Special Instructions
                </th>
                <th scope="col" className="px-6 py-3">
                    Mark as Cooking
                </th>
                <th scope="col" className="px-6 py-3">
                    Mark as Done
                </th>
            </tr>
        </thead>
        <tbody>
            {data.map((event) => {return <Item key={data.indexOf(event)} data={event} index={data.indexOf(event)} setData={setData} fullData={data}/>})}
        </tbody>
      </table>
    </div>
  );
}
