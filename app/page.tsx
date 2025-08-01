"use client";
import { useUser } from "@clerk/nextjs";

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

type comment = {
  authorId: string;
  bugId: string;
  createdAt: string;
  text: string;
  id: string;
};
export default function Home() {
  const { user } = useUser();
  const [result, setResult] = useState<bug[]>([]);
  const [showCommentId, setShowCommentId] = useState<string | null>(null);
  const [commentInput, setcommentInput] = useState<string>("");
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const [comment, setComment] = useState<comment[]>([]);
  const [dropDown, setDropDown] = useState<string | null>(null);

  const fetchData = async () => {
    const res = await fetch(`/api/bug`, {
      method: "GET",
    });
    const data = await res.json();
    console.log(data.result);
    setResult(data.result);
  };

  useEffect(() => {
    fetchData();
  }, [user, userEmail]);

  const handlefetch = async (item: bug) => {
    const res = await fetch(`/api/comment?bugId=${item.id}`, {
      method: "GET",
    });
    const data = await res.json();
    setComment(data.result);
  };

  const handlepPost = async (item: bug) => {
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({
          text: commentInput,
          authorId: userEmail,
          bugId: item.id,
        }),
      });
      const data = await res.json();
      console.log(data);
      setcommentInput("");
      handlefetch(item);
    } catch (error) {
      console.log(error);
    }
  };
  const DeleteData = async (item: comment) => {
    const res = await fetch(
      `/api/comment?email=${userEmail}&commentid=${item.id}&bugId=${item.bugId}`,
      {
        method: "DELETE",
      }
    );
    const data = await res.json();
    console.log(data);
    handlefetch({id:item.bugId} as bug);
  };
  const hsndlecommentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setcommentInput(e.target.value);
  };
  const handleshowComment = (item: bug) => {
    setShowCommentId(showCommentId === item.id ? null : item.id);
    handlefetch(item);
  };

  const handleEdit = async (item: comment) => {
    DeleteData(item);
    setcommentInput(item.text);
  };

  const handleEnter = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    item: bug
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlepPost(item);
    }
  };
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
            <div className="w-full h-2 bg-green-900 rounded-full overflow-hidden mb-6">
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
            <button
              className="mt-4 mb-2 px-4 py-2 rounded bg-green-800 hover:bg-green-700 text-white font-semibold"
              onClick={() => {
                handleshowComment(item);
              }}
            >
              {showCommentId === item.id ? "Hide Comments" : "Show Comments"}
            </button>

            {showCommentId === item.id && (
              <div
                className={`mt-6 border-t border-green-700 pt-4 `}
                key={item.id}
              >
                <h3 className="text-lg font-bold text-green-300 mb-2">
                  💬 Comments
                </h3>

                <div className="mb-4">
                  <textarea
                    placeholder="Write a comment..."
                    className="w-full p-3 rounded-lg bg-green-950 text-green-200 border border-green-600 placeholder:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    onChange={hsndlecommentInput}
                    onKeyDown={(e) => handleEnter(e, item)}
                    value={commentInput}
                  ></textarea>
                  <button
                    onClick={() => handlepPost(item)}
                    className="mt-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
                    disabled={commentInput === ""}
                  >
                    Post Comment
                  </button>
                </div>
                <div className="space-y-5">
                  {comment.map((item) => (
                    <div
                      key={item.createdAt}
                      className="flex flex-col gap-2 bg-green-950 border border-green-800 p-4 rounded-lg shadow-sm hover:shadow-green-500/10 transition"
                    >
                      <div className="text-xs text-green-400/80 mb-1">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-semibold text-green-300">
                              {item.authorId}
                            </span>
                            <span className="text-green-400 text-[11px]">
                              {item.createdAt}
                            </span>
                          </div>

                          <div className="relative">
                            <button
                              className="text-green-300 hover:text-green-200"
                              onClick={() =>
                                setDropDown(
                                  dropDown === item.id ? null : item.id
                                )
                              }
                            >
                              ...
                            </button>
                            {dropDown === item.id && (
                              <div className="absolute right-0 top-4 bg-gray-800 border border-green-600 rounded-md p-2 text-sm z-10 w-28">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="block w-full text-left hover:bg-green-700 px-2 py-1 rounded"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => DeleteData(item)}
                                  className="block w-full text-left hover:bg-red-700 px-2 py-1 rounded"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-green-200 text-sm leading-relaxed whitespace-pre-line">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
