"use client";
import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void; // Opens the RegisterModal
}

const API_BASE_URL = "http://localhost:5000";

export default function LoginModal({ isOpen, onClose, onOpenRegister }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/admin/login`, { username, password });

      saveToken(data.token);
      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-6 animate-fadeIn">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-white">Admin Login</DialogTitle>
          <p className="text-sm text-gray-300 mt-1">Sign in to manage your processes</p>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-2 transition-all"
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-2 transition-all"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2 transition-all flex justify-center items-center"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Login"}
          </Button>
          <div className="text-center text-sm text-gray-300">
            Don't have an account?{" "}
            <button 
              className="text-blue-400 hover:underline"
              onClick={onOpenRegister}
            >
              Register here
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
