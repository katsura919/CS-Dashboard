"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function AnnouncementPage() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-adjust textarea height
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height first
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set new height
    }
  }, [details]); // Runs when 'details' state changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/announcements/create`,
        { title, details, postedBy }
      );

      if (response.status === 201) {
        router.push("/announcements");
      }
    } catch (err) {
      setError("Failed to create announcement. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-xl px-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4">Create Announcement</h1>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          required
          ref={textAreaRef}
          className="resize-none overflow-hidden"
        />
        <Input
          type="text"
          placeholder="Posted by"
          value={postedBy}
          onChange={(e) => setPostedBy(e.target.value)}
          required
        />

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Create Announcement"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
