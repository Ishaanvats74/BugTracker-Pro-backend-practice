"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import React from "react";

const Page = () => {
    const router = useRouter()
  const { user } = useUser();
  const emailAddress = user?.emailAddresses[0].emailAddress;

  const handleCreate = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const bug = {
      title: form.get("title") as string,
      description: form.get("description") as string,
      severity: form.get("severity") as string,
      emailAddress: emailAddress as string,
      status: "open",
    };
    console.log(bug);
    const fetchdata = async () => {
      const res = await fetch("/api/bug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bug),
      });
      const data = await res.json();
      console.log(data);
    };
    fetchdata();
    router.push('/')
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-green-300 font-mono px-4">
  <form
    onSubmit={handleCreate}
    className="bg-[#121212] border border-green-800 p-6 rounded-xl shadow-lg w-full max-w-md space-y-5"
  >
    <h2 className="text-3xl font-bold text-center text-green-400">
      🐞 Report a Bug
    </h2>

    <div>
      <label htmlFor="title" className="block text-sm font-medium mb-1">
        Title
      </label>
      <input
        id="title"
        name="title"
        type="text"
        required
        className="w-full bg-black border border-green-700 text-green-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>

    <div>
      <label htmlFor="description" className="block text-sm font-medium mb-1">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        required
        className="w-full bg-black border border-green-700 text-green-200 rounded-lg p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>

    <div>
      <label htmlFor="severity" className="block text-sm font-medium mb-1">
        Severity
      </label>
      <select
        id="severity"
        name="severity"
        className="w-full bg-black border border-green-700 text-green-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        defaultValue="Medium"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>

    <button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition duration-200 font-semibold"
    >
      Submit Bug
    </button>
  </form>
</div>
  );
};

export default Page;
