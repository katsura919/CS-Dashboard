// app/chat/[slug]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function ChatPage() {
  const { slug } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/ask/chat/${slug}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !slug) return;

    setLoading(true);
    setError(null);

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: newMessage };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    try {
      const response = await axios.post(apiEndpoint, {
        query: newMessage,
        history: messages.map(({ role, content }) => ({ role, content })),
      });

      const aiMessage: Message = {
        id: `${Date.now()}-response`,
        role: "ai",
        content: response.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError("Failed to fetch response. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 dark:bg-gray-900 items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-lg font-semibold text-gray-900 dark:text-gray-100">
        
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4 space-y-3 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "ai" ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                  msg.role === "ai"
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    : "bg-blue-500 text-white"
                }`}
              >
                {msg.role === "ai" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </ScrollArea>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1 bg-gray-100 dark:bg-gray-700 border-none focus:ring-0 text-gray-900 dark:text-gray-100"
          />
          <Button type="submit" disabled={loading} className="ml-3">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
          </Button>
        </form>
      </Card>
    </div>
  );
}
