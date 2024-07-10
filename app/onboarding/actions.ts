"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface FormData {
    name: string;
    address: string;
    systemPrompt: string;
    products: Product[];
}

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    const res = await clerkClient().users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    const response = await fetch('/api/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify(formData)
      });
      const resJSON = await response.json();
      redirect(resJSON.link);
    return { message: res.publicMetadata };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};