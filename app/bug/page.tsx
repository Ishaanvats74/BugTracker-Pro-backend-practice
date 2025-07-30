"use client";

import { useUser } from "@clerk/nextjs";

import React from "react";

const Page = () => {
  const { user } = useUser();
  const emailAddress = user?.emailAddresses[0].emailAddress;

  const handleCreate = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const bug = {
      title: form.get("title") as string,
      description: form.get("Description") as string,
      severity: form.get("Severity") as string,
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
  };

  return (
     <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Report a Bug</h2>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 rounded-lg p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="severity" className="block text-sm font-medium mb-1">
            Severity
          </label>
          <select
            id="severity"
            name="severity"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="High">High</option>
            <option value="Medium" selected>
              Medium
            </option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Submit Bug
        </button>
      </form>
    </div>
  );
};

export default Page;
