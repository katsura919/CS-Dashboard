"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoginModal from "../login-modal";
import RegisterModal from "../register-modal";

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <nav className="p-4 bg-gray-900 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">Process Manager</h1>
      <Button variant="outline" onClick={() => setIsLoginOpen(true)}>
        Login
      </Button>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenRegister={() => {
          setIsLoginOpen(false); // Close login modal
          setIsRegisterOpen(true); // Open register modal
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onOpenLogin={() => {
          setIsRegisterOpen(false); // Close register modal
          setIsLoginOpen(true); // Open login modal
        }}
      />
    </nav>
  );
}
