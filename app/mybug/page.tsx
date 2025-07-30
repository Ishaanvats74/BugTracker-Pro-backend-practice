"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
type bug = {
  createdAt: string;
  description: string;
  severity: string;
  status: string;
  title: string;
  emailAddress:string
};

const Page = () => {
  const { user, isSignedIn } = useUser();
  const [result, setResult] = useState<bug[]>([]);
  const router = useRouter();

  const fetchData = async (userEmail: unknown) => {
    const res = await fetch(`/api/yourBugs?email=${userEmail}`, {
      method: "GET",
    });
    const data = await res.json();
    console.log(data);
    setResult(data.result);
  };

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    fetchData(userEmail);

  }, []);
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono pt-28 px-6 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        All Your Reported Bugs
      </h1>

      <div className="space-y-6 max-w-3xl mx-auto">
        {result.map((item, index) => (
          <div
            key={index}
            className="border border-green-500 rounded-lg p-5 bg-gray-900 shadow-md transition hover:scale-[1.02]"
          >
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-sm mb-3 text-green-300">{item.description}</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                item.severity === "High"
                  ? "bg-red-700 text-red-100"
                  : item.severity === "Medium"
                  ? "bg-yellow-600 text-yellow-100"
                  : "bg-green-700 text-green-100"
              }`}
            >
              Severity: {item.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
