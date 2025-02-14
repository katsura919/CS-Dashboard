"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Announcement = {
  _id: string;
  title: string;
  details: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AnnouncementCard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch announcements from backend
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/announcements/get`);
        console.log("Fetched Announcements:", data); // Debugging
        setAnnouncements(data);
      } catch (error) {
        console.log(error);
        console.error("Error fetching announcements:", error);
      }
    }
    fetchAnnouncements();
  }, []);

  // Delete announcement
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/announcements/delete/${id}`);
      setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
      toast.success("Announcement deleted!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete announcement");
    }
  }

  // Open edit dialog
  function handleEditOpen(announcement: Announcement) {
    setSelectedAnnouncement(announcement);
    setTitle(announcement.title);
    setContent(announcement.details);
  }

  // Save edited announcement
  async function handleEditSave() {
    if (!selectedAnnouncement) return;
    try {
      const { data: updated } = await axios.put(
        `${API_BASE_URL}/api/announcements/update/${selectedAnnouncement._id}`,
        { title, details: content }
      );
      setAnnouncements((prev) =>
        prev.map((ann) => (ann._id === selectedAnnouncement._id ? updated : ann))
      );
      setSelectedAnnouncement(null);
      toast.success("Announcement updated!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update announcement");
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {announcements.map((announcement) =>
        announcement._id ? ( // Ensure `_id` is valid
          <Card key={announcement._id} className="relative">
            <CardHeader>
              <CardTitle>{announcement.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{announcement.details}</p>
              <div className="flex gap-2 mt-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditOpen(announcement)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Announcement</DialogTitle>
                    </DialogHeader>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title"
                    />
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Content"
                    />
                    <DialogFooter>
                      <Button onClick={handleEditSave}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(announcement._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null
      )}
    </div>
  );
}
