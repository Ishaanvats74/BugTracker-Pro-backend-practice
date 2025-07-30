"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

interface PageProps {
  params: Promise<{
    BugId: string;
  }>;
}
type bug = {
  createdAt: string;
  description: string;
  severity: string;
  status: string;
  title: string;
  emailAddress: string;
  id: string;
};

export default function Page({ params }: PageProps) {
    const { BugId } = use(params);
  const { user } = useUser();
  const [result, setResult] = useState<bug[]>([]);
  const [input, setInput] = useState<string>("");
  const [textarea, setTextarea] = useState<string>("");
  const [severity, setSeverity] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const router = useRouter();

  
  useEffect(() => {
      const userEmail = user?.emailAddresses[0]?.emailAddress;
      const fetchData = async (userEmail: unknown) => {
        const res = await fetch(
          `/api/editBug?email=${userEmail}&id=${BugId}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        console.log(data);
        setResult(data.result);
        setInput(data.result[0].title);
        setTextarea(data.result[0].description);
        setSeverity(data.result[0].severity);
        setStatus(data.result[0].status);
      };
    fetchData(userEmail);
  }, [user,BugId]);

  const handleCreate = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = {
      title: input,
      description: textarea,
      severity: severity,
      status: status,
      emailAddress: user?.emailAddresses[0]?.emailAddress,
      bugId: BugId,
    };

    const res = await fetch("/api/yourBugs", {
      method: "PATCH",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log(data)
    router.push("/");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-green-300 font-mono px-4">
      {result.map((item) => (
        <form
          key={item.id}
          onSubmit={handleCreate}
          className="bg-[#121212] border border-green-800 p-6 rounded-xl shadow-lg w-full max-w-md space-y-5"
        >
          <h2 className="text-3xl font-bold text-center text-green-400">
            🐞 Edit a Bug
          </h2>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
              className="w-full bg-black border border-green-700 text-green-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={textarea}
              onChange={(e) => setTextarea(e.target.value)}
              className="w-full bg-black border border-green-700 text-green-200 rounded-lg p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label
              htmlFor="severity"
              className="block text-sm font-medium mb-1"
            >
              Severity
            </label>
            <select
              id="severity"
              name="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-black border border-green-700 text-green-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="severity"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-black border border-green-700 text-green-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="open">open</option>
              <option value="in progress">in progress</option>
              <option value="resolved">resolved</option>
              <option value="reopened">reopened</option>
              <option value="won't fix">won&apos;t fix</option>
              <option value="invalid">invalid</option>
              <option value="pending review">pending review</option>
              <option value="closed">closed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition duration-200 font-semibold"
          >
            Update Bug
          </button>
        </form>
      ))}
    </div>
  );
}
