import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server';
import { doc, setDoc, updateDoc } from "firebase/firestore";
import OpenAI from "openai";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

import { db } from '../../firebase';

const openai = new OpenAI({ api_key: process.env.OPENAI_API_KEY });

export async function POST(req){
    const {userId} = getAuth(req);
   
    if(!userId){
      return new Response("Unauthorized", { status: 401 });
    }
    let reqJSON = await req.json(); // Convert reqJSON to JSON string
    if (reqJSON.oldAssistantId !== undefined) {
      const response = await openai.beta.assistants.del(reqJSON.oldAssistantId);
    }
    //create an openai assistant
    const systemPrompt = `You are a chatbot for a restaurant named ${reqJSON.name}. The address is ${reqJSON.address}. You are helping a customer order food. When they order food, add up the time to prepare the dishes that they ordered and return that as an ETA. Please ask the user about any allergies they may have and warn them of any foods that contain said allergens. Always ask for the customer's name. Below are special instructions provided to you by the restaurant:
    ${reqJSON.systemPrompt}
    Products available for purchase:
    | Name | Description | Time to Cook | Price |
    ${reqJSON.products.map((product) => `| ${product.name} | ${product.desc} | ${product.prepTime} | ${product.price} |`).join("\n")}`;
    const assistant = await openai.beta.assistants.create({
      instructions: systemPrompt,
      name: reqJSON.name,
      tools: [
        { type: "function",
          function: {
            "name": "order",
            "description": "Order food on behalf of the customer",
            "parameters": {
              "type": "object",
              "properties": {
                "dishes": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "description": "List of the dishes the customer has ordered e.g. [\"Hamburger\", \"Chicken Wings\", \"Coca Cola\", \"Coca Cola\"]"
                },
                "prepTime": {
                  "type": "number",
                  "description": "Your estimate of the time it will take to prepare the dishes in minutes"
                },
                "specialInstructions": {
                  "type": "string",
                  "description": "Special instructions for the restaurant"
                },
                "customerName": {
                  "type": "string",
                  "description": "The name of the customer"
                },
              },
              "required": [
                "dishes",
                "prepTime",
                "specialInstructions",
                "customerName"
              ]
            }
          }
        }
      ],
      model: "gpt-4-turbo",
    });
    if (reqJSON.oldAssistantId !== undefined) {
      await updateDoc(doc(db, "businesses", userId), {
          name: reqJSON.name,
          address: reqJSON.address,
          botConf: {
              systemPrompt: reqJSON.systemPrompt,
              products: reqJSON.products,
          },
          assistantId: assistant.id,
          isOpen: true
      });
      return NextResponse.json({ message: 'Profile updated succesfully!' });
    } else{
      //If we don't have an old assistant id, then we have not been onboarded yet
      //If we do, then we don't wanna wipe out their orders
      await setDoc(doc(db, "orders", userId), {
          orders: []
      });
      // Set up stripe
      const account = await stripe.accounts.create({
        controller: {
          losses: {
            payments: 'application',
          },
          fees: {
            payer: 'application',
          },
          stripe_dashboard: {
            type: 'express',
          },
        },
      });
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.URL_BASE}/reauth`,
        return_url: `${process.env.URL_BASE}/`,
        type: 'account_onboarding',
      });
      for(let i = 0; i < reqJSON.products.length; i++){
        const price = await stripe.prices.create({
          currency: 'usd',
          unit_amount: parseFloat(reqJSON.products[i].price)*100,
          product_data: {
            name: reqJSON.products[i].name,
          },
        });
        reqJSON.products[i].priceId = price.id;
      }
      await setDoc(doc(db, "businesses", userId), {
        name: reqJSON.name,
        address: reqJSON.address,
        botConf: {
            systemPrompt: reqJSON.systemPrompt,
            products: reqJSON.products,
        },
        assistantId: assistant.id,
        isOpen: true,
        stripeAccountId: account.id
      });
      return NextResponse.json({ link: accountLink.url });
    }
}