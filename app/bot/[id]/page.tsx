"use client";
import { useState, useEffect, useRef } from "react";
import Message  from "../../components/message"
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline"

interface Response {
  message: string;
  threadId: string;
}

interface Message {
  role: string;
  message: string;
}

function Messages({ messages: messages }: { messages: Message[] }) {
  return (
    <div>
      {messages.map((message, index) => (
        <Message key={index} role={message.role} message={message.message} />
      ))}
    </div>
  );
}

export default function Home({ params: { id } }: { params: { id: string } }) {
  const [messages, setMessages] = useState<{role: string, message: string}[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const [threadId, setThreadId] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [waitTime, setWaitTime] = useState<number>(0);//TODO: Make it say "1 hour and 30 minutes" instead of "90 minutes"
  useEffect(() => {
    fetch('/api/getName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
            "userId": id
        })
    }).then((response) => response.json()).then((data) => {setBusinessName(data.name)});
    fetch('/api/getWaitTime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({
          "userId": id
      })
  }).then((response) => response.json()).then((data) => {setWaitTime(data.time)});
  }, []);
  let pollingRef:React.MutableRefObject<any> = useRef<any>(null);
  useEffect(() => {
    fetch('/api/getIsOpen', {method: "POST", body: JSON.stringify({userId: id})}).then((response) => response.json()).then((data) => {setIsOpen(data.isOpen)});
    const startPolling = () => {
      pollingRef.current = setInterval(() => {
        fetch('/api/getIsOpen', {method: "POST", body: JSON.stringify({userId: id})}).then((response) => response.json()).then((data) => {setIsOpen(data.isOpen)});
      }, 5000); // Poll every 5 seconds
    };
    startPolling();

    return () => {
      clearInterval(pollingRef.current);
    };
    
  }, []);
  const handleInput = async (e: any) => {
    const fieldValue = e.target.value;

    await setNewMessage(fieldValue);
  }
  const submitHandler = async (e: any) => {
    e.preventDefault();
    setMessages([...messages, {
      "role": "user",
      "message": newMessage
    }]);
    setNewMessage("");
    const response: any = await fetch('/api/pingModel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({
        "message": newMessage,
        "userId": id,
        "thread": threadId
      })
    });
    const resJson: Response = await response.json();
    if(threadId === "") {
        setThreadId(resJson.threadId)
    }
    setMessages((msgs) => [...msgs, {
      "role": "assistant",
      "message": resJson.message
    }]);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center">{businessName}</h1>
      {isOpen ? <div><p className="text-center">It will take us about {waitTime} minutes before we can start filling your order.</p>
      <Messages messages={messages}/>
      <form onSubmit={submitHandler} className="flex flex-row items-center">
        <textarea
          value={newMessage}
          onChange={handleInput}
          className="p-1.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-11/12"
        />
        <button 
          type="submit"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-3.5 text-center mt-2"
        >
          <ArrowUpCircleIcon className="h-6 w-6 inline-block"/>
        </button>
      </form></div> : <p className="text-center">Sorry, we are currently closed</p>}
    </div>
  );
}