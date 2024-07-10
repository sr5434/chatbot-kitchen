import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore"; 
import OpenAI from "openai";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Your web app's Firebase configuration
import { db } from "../../firebase";

const openai = new OpenAI({ api_key: process.env.OPENAI_API_KEY });

export async function POST(req){
    const reqJSON = await req.json();

    const docRef = doc(db, "businesses", "user_" + reqJSON.userId);
    const snapshot = await getDoc(docRef);
    const assistant = await openai.beta.assistants.retrieve(
        snapshot.data().assistantId
    );
    let threadId;
    if(reqJSON.thread === ''){
        const thread = await openai.beta.threads.create();
        threadId = thread.id;
    } else {
        threadId = reqJSON.thread;
    }
    const handleRequiresAction = async (run) => {
        // Check if there are tools that require outputs
        if (
          run.required_action &&
          run.required_action.submit_tool_outputs &&
          run.required_action.submit_tool_outputs.tool_calls
        ) {
          // Loop through each tool in the required action section
          let toolOutputs = await run.required_action.submit_tool_outputs.tool_calls.map(
            async (tool) => {
                if (tool.function.name === "order") {
                  let args = JSON.parse(tool.function.arguments);
                  const business = await getDoc(doc(db, "businesses", "user_" + reqJSON.userId))
                  // My name is samir. I have no allergies. I only want 2 samosas and a coke. Please order that
                  let line_items = [];
                  const snapshot = business.data()
                  for (let i = 0; i < snapshot.botConf.products.length; i++) {
                    if(args.dishes.includes(snapshot.botConf.products[i].name)){
                      line_items.push({
                        price: snapshot.botConf.products[i].priceId,
                        quantity: args.dishes.filter((v) => (v === snapshot.botConf.products[i].name)).length
                      })
                    }
                  }
                  let newObj = JSON.parse(tool.function.arguments)
                  newObj["userId"] = "user_" + reqJSON.userId;
                  const session = await stripe.checkout.sessions.create({
                    mode: 'payment',
                    payment_method_types: ['card'],
                    line_items: line_items,
                    payment_intent_data: {
                      application_fee_amount: 123,
                      transfer_data: {
                        destination: snapshot.stripeAccountId,
                      },
                    },
                    success_url: `${process.env.URL_BASE}/order/?args=${encodeURI(JSON.stringify(newObj))}`,//?userId=user_${reqJSON.userId}`,
                    cancel_url: `${process.env.URL_BASE}/bot/${reqJSON.userId}`,
                  });
                  return {
                    tool_call_id: tool.id,
                    output: `Checkout link: ${session.url}`,
                  };
                }
            },
          );
          // Submit all tool outputs at once after collecting them in a list
          toolOutputs = await Promise.all(toolOutputs)
          if (toolOutputs.length > 0) {
            run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
              threadId,
              run.id,
              { tool_outputs: toolOutputs },
            );
          }
          // Testing prompt: I would like 2 samosas and 3 cokes. I am named samir and have no allergies. Please order immediately
          // Check status after submitting tool outputs
          return handleRunStatus(run);
        }
      };
      
      const handleRunStatus = async (run) => {
        // Check if the run is completed
        if (run.status === "completed") {
          let messages = await openai.beta.threads.messages.list(threadId);
          return messages.data;
        } else if (run.status === "requires_action") {
          return await handleRequiresAction(run);
        }
      };
    const message = await openai.beta.threads.messages.create(
        threadId,
        {
          role: "user",
          content: reqJSON.message,
        }
    );
    let run = await openai.beta.threads.runs.createAndPoll(
        threadId,
        { 
          assistant_id: assistant.id
        }
    );
    const res = await handleRunStatus(run);
    //Otherwise continue thread
    return NextResponse.json({ message: res[0].content[0].text.value, threadId: threadId });
}
// to test this route, you can use the following curl command
// curl -X POST http://localhost:3000/api/pingModel -H "Content-Type: application/json" -d '{"userId": "2ibwjl0ViiSpyw8Q8NdjpXc2HSr", "message": "Hi", "thread": ""}'
