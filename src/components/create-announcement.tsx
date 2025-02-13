"use client";
import { useState, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CreateAnnouncementModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateAnnouncementModal({ open, setOpen }: CreateAnnouncementModalProps) {
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements/create`, {
        title,
        details,
        postedBy,
      });

      if (response.status === 201) {
        setOpen(false); // Close modal on success
        router.refresh(); // Refresh data (optional)
      }
    } catch (err) {
      setError("Failed to create announcement. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>


      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}
