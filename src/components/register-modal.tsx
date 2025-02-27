"use client";
import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onOpenLogin }: RegisterModalProps) {
  const [registrantName, setRegistrantName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      // Validation
      if (!registrantName || !departmentName) {
        setError("Registrant name and department name are required.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      // Call the updated API endpoint
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tenant/register`, {
        registrantName,
        departmentName,
        email,
        password,
      });

      // Show success message
      setTimeout(() => {
        onClose(); // Close the modal
        onOpenLogin(); // Open the login modal
      }, 2000);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Registration failed. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-white">Register</DialogTitle>
          <DialogDescription className="text-sm text-gray-300 mt-1">
            Create a new tenant (department) to get started
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Registrant Name"
            value={registrantName}
            onChange={(e) => setRegistrantName(e.target.value)}
          />
          <Input
            placeholder="Department Name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <Button onClick={handleRegister} disabled={loading} className="w-full flex justify-center">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Register"}
          </Button>
          <div className="text-center text-sm text-gray-300">
            Already have an account?{" "}
            <button className="text-blue-400 hover:underline" onClick={onOpenLogin}>
              Login here
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}