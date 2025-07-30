"use client";
import { useUser } from "@clerk/nextjs";

import { useEffect, useState } from "react";

type bug = {
  createdAt: string;
  description: string;
  severity: string;
  status: string;
  title: string;
  emailAddress: string;
  bugId: string;
};
export default function Home() {
  const { user } = useUser();
  const [result, setResult] = useState<bug[]>([]);

  const fetchData = async (userEmail: unknown) => {
    const res = await fetch(`/api/bug?email=${userEmail}`, {
      method: "GET",
    });
    const data = await res.json();
    console.log(data.result);
    setResult(data.result);
  };
  useEffect(() => {
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    fetchData(userEmail);
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono pt-28 px-6 overflow-y-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-green-300 drop-shadow-md">
        🐞 Bug Tracker Dashboard
      </h1>

      <div className="space-y-6">
        {result.map((item, index) => (
          <div
            key={index}
            className="w-full bg-[#121212] border border-green-800 rounded-xl p-5 shadow-lg hover:shadow-green-400/30 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full mb-3">
              <h2 className="text-xl font-semibold text-green-300">
                {item.title}
              </h2>
              <div className="text-sm text-green-400 italic mt-2 md:mt-0">
                {item.emailAddress}
              </div>
            </div>

            <p className="text-sm text-green-400 mb-4">{item.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-3">
              <p>
                <span className="font-bold text-green-500">Severity:</span>{" "}
                <span className="uppercase">{item.severity}</span>
              </p>
              <p>
                <span className="font-bold text-green-500">Status:</span>{" "}
                {item.status}
              </p>
              <p className="text-green-500/70 text-xs">
                Created at: {item.createdAt}
              </p>
            </div>

            {/* Status Bar */}
            <div className="w-full h-2 bg-green-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  item.status === "open"
                    ? "bg-yellow-400 w-1/6"
                    : item.status === "in progress"
                    ? "bg-blue-400 w-2/6"
                    : item.status === "resolved"
                    ? "bg-green-400 w-5/6"
                    : item.status === "reopened"
                    ? "bg-orange-400 w-3/6"
                    : item.status === "won't fix"
                    ? "bg-red-500 w-2/6"
                    : item.status === "invalid"
                    ? "bg-gray-500 w-1/6"
                    : item.status === "pending review"
                    ? "bg-purple-400 w-4/6"
                    : item.status === "closed"
                    ? "bg-green-700 w-full"
                    : "bg-gray-700 w-1/6"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
