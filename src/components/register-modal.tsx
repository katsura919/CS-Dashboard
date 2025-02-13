"use client";
import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void; // Opens the Login Modal
}

const API_BASE_URL = "http://localhost:5000";

export default function RegisterModal({ isOpen, onClose, onOpenLogin }: RegisterModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (!firstName || !lastName) {
      setError("First name and last name are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/register`, {
        firstName,
        lastName,
        username,
        email,
        password,
      });

      onClose();
      onOpenLogin(); // Open login modal after successful registration
    } catch (error: any) {
      setError(error.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-6 animate-fadeIn">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-white">Register</DialogTitle>
          <DialogDescription className="text-sm text-gray-300 mt-1">
            Create an account to get started
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-2 transition-all"
          />
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-2 transition-all"
          />
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-2 transition-all"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-2 transition-all"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-2 transition-all"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-2 transition-all"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg py-2 transition-all flex justify-center items-center"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Register"}
          </Button>
          <div className="text-center text-sm text-gray-300">
            Already have an account?{" "}
            <button 
              className="text-blue-400 hover:underline"
              onClick={onOpenLogin}
            >
              Login here
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
