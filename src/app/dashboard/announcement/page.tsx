"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function AnnouncementPage() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/announcements/create`,
        {
          title,
          details,
          postedBy,
        }
      );

      if (response.status === 201) {
        router.push("/announcements"); // Redirect to announcements list page
      }
    } catch (err) {
      setError("Failed to create announcement. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-4">Create Announcement</h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Fill in the details below to create a new announcement.
      </p>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

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
        />
        <Input
          type="text"
          placeholder="Posted by"
          value={postedBy}
          onChange={(e) => setPostedBy(e.target.value)}
          required
        />

        <Button type="submit" className="w-full bg-green-600 text-white" disabled={loading}>
          {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Create Announcement"}
        </Button>
      </form>
    </div>
  );
}