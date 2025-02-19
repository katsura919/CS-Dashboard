"use client";

import { use, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AnnouncementDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); // ✅ Correct way to unwrap params
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch announcement details
  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        const response = await axios.get(`${API_URL}/api/announcements/getbyid/${id}`);
        setTitle(response.data.title);
        setDetails(response.data.details);
        setPostedBy(response.data.postedBy);
      } catch (err) {
        setError("Failed to load announcement.");
        console.error("Error fetching announcement:", err);
      }
    }
    fetchAnnouncement();
  }, [id]);

  // Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`${API_URL}/api/announcements/update/${id}`, { title, details, postedBy });

      toast({
        title: "Success",
        description: "Announcement updated successfully!",
        className: "bg-green-500 text-white",
      });
    } catch (err) {
      setError("Failed to update announcement.");
      toast({
        title: "Error",
        description: "Failed to update announcement.",
        variant: "destructive",
      });
      console.error("Error updating announcement:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await axios.delete(`${API_URL}/api/announcements/${id}`);
      toast({
        title: "Deleted",
        description: "Announcement deleted successfully.",
      });
      router.push("/announcements");
    } catch (err) {
      setError("Failed to delete announcement.");
      toast({
        title: "Error",
        description: "Failed to delete announcement.",
        variant: "destructive",
      });
      console.error("Error deleting announcement:", err);
    }
  };

  return (
    <div className="flex flex-col max-w-xl px-4">
      <h1 className="text-2xl font-bold mb-4">Edit Announcement</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea value={details} onChange={(e) => setDetails(e.target.value)} required />
        <Input type="text" value={postedBy} onChange={(e) => setPostedBy(e.target.value)} required />

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Changes"}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
