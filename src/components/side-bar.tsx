"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { removeToken } from "@/lib/auth";
import { Menu, X, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CreateAnnouncementModal from "@/components/create-announcement"; // Import the modal component

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [openModal, setOpenModal] = useState(false); // State to control the modal
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  return (
    <>
      {/* Sidebar Toggle Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white p-4 flex flex-col transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Toggle Button for Desktop */}
        <button
          className="hidden md:block self-end mb-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Title */}
        <h2 className={`text-xl font-bold mb-6 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}>
          Dashboard
        </h2>

        {/* Dropdown Menu for Create */}
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full bg-green-500 mb-4 flex justify-between items-center">
                {isOpen ? "Create" : <Plus size={20} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="right"
              className="bg-gray-800 text-white shadow-lg"
            >
              <DropdownMenuItem onClick={() => router.push("/dashboard/create-process")}>
                + New Process
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenModal(true)}>
                + New Announcement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Spacer to push logout to bottom */}
        <div className="flex-grow"></div>

        {/* Logout Button */}
        <Button className="w-full bg-red-500" onClick={handleLogout}>
          {isOpen ? "Logout" : "🚪"}
        </Button>
      </aside>

      {/* Create Announcement Modal */}
      <CreateAnnouncementModal open={openModal} setOpen={setOpenModal} />
    </>
  );
}
