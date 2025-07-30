"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
type bug = {
  createdAt: string;
  description: string;
  severity: string;
  status: string;
  title: string;
  emailAddress: string;
  id: string;
};

const Page = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [result, setResult] = useState<bug[]>([]);
  const router = useRouter();
  const [dropDown, setDropDown] = useState<string | null>(null);
  const userEmail = user?.emailAddresses[0]?.emailAddress;

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
    fetchData(userEmail);
  }, [isSignedIn, user, userEmail, router]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleDelete = async (item: bug) => {
    const res = await fetch("/api/yourBugs", {
      method: "DELETE",
      body: JSON.stringify({ userEmail, BugId: item.id }),
    });
    const data = await res.json();
    console.log(data);
    fetchData(userEmail);
  };
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono pt-28 px-6 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        All Your Reported Bugs
      </h1>

      <div className="space-y-6 max-w-3xl mx-auto">
        {result.map((item) => (
          <div
            key={item.id}
            className="border flex justify-between border-green-500 rounded-lg p-5 bg-gray-900 shadow-md transition hover:scale-[1.02]"
          >
            <div>
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
            <div className="relative">
              <button
                onClick={() =>
                  setDropDown((r) => (r === item.id ? null : item.id))
                }
                className="text-green-300 font-bold px-2 py-1 hover:text-white"
              >
                ...
              </button>
              {dropDown === item.id && (
                <div className="absolute right-0 top-8 bg-gray-800 border border-green-600 rounded-md p-2 text-sm z-10 w-28">
                  <Link
                    href={`/bugid/${item.id}`}
                    className="block w-full text-left hover:bg-green-700 px-2 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    className="block w-full text-left hover:bg-red-700 px-2 py-1 rounded"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
