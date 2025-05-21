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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [escalationVisible, setEscalationVisible] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    concern: "",
    description: "",
  });

  const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/ask/chat/${slug}`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !slug) return;

    setLoading(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: newMessage,
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    try {
      const body: any = {
        query: newMessage,
        history: messages.map(({ role, content }) => ({ role, content })),
      };

      if (!sessionId) {
        body.customerDetails = {
          name: "Guest",
          email: "guest@example.com",
          phoneNumber: "0000000000",
        };
      } else {
        body.sessionId = sessionId;
      }

      const response = await axios.post(apiEndpoint, body);

      const aiMessage: Message = {
        id: `${Date.now()}-response`,
        role: "ai",
        content: response.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (!sessionId && response.data.sessionId) {
        setSessionId(response.data.sessionId);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch response. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContentWithEscalationLink = (content: string) => {
    const fullLink = `[Click here to create a ticket.](escalate://now)`;

    if (content.includes(fullLink)) {
      const [before, after] = content.split(fullLink);

      return (
        <div className="space-y-2">
          {before && (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {before.trim()}
            </ReactMarkdown>
          )}

          <Button
            variant="link"
            className="text-blue-600 underline hover:text-blue-800 p-0 h-auto"
            onClick={() => setEscalationVisible(true)}
          >
            Click here to create a ticket.
          </Button>

          {after && (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {after.trim()}
            </ReactMarkdown>
          )}
        </div>
      );
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            if (href === "escalate://now") {
              return (
                <Button
                  variant="link"
                  className="text-blue-600 underline hover:text-blue-800 p-0 h-auto"
                  onClick={() => setEscalationVisible(true)}
                >
                  {children}
                </Button>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 dark:bg-gray-900 items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Ask our assistant
        </div>

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
                {msg.role === "ai"
                  ? renderContentWithEscalationLink(msg.content)
                  : msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </ScrollArea>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

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

      <Dialog open={escalationVisible} onOpenChange={setEscalationVisible}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Escalate Your Concern</DialogTitle>
          </DialogHeader>

          <form className="space-y-3">
            <Input
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
            <Input
              placeholder="Customer Email"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            />
            <Input
              placeholder="Customer Phone (optional)"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            />
            <Input
              placeholder="Concern (e.g., billing issue)"
              value={formData.concern}
              onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
            />
            <Textarea
              placeholder="Additional description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </form>

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setEscalationVisible(false)}>
              Cancel
            </Button>
            <Button onClick={() => alert("Escalation submitted (placeholder)")}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
