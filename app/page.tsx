"use client";
import { useUser } from "@clerk/nextjs";

import { useEffect, useState } from "react";

type bug = {
  createdAt: string;
  description: string;
  severity: string;
  status: string;
  title: string;
  emailAddress:string;
  bugId:string
};
export default function Home() {
  const {  user } = useUser();
  const [result, setResult] = useState<bug[]>([]);



  const fetchData = async (userEmail:unknown) => {
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
        className="bg-[#121212] border border-green-800 rounded-xl p-5 shadow-lg hover:shadow-green-400/30 transition-all duration-300"
      >
        <h2 className="text-xl font-semibold text-green-300">{item.title}</h2>
        <p className="text-sm text-green-400 mt-2">{item.description}</p>

        <div className="mt-4 text-sm space-y-1">
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
      </div>
    ))}
  </div>
</div>
  );
}
