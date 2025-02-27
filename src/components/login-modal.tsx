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
  onOpenRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onOpenRegister }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tenant/login`, {
            email,
            password,
        });
        console.log(data)
        // Save token and tenant data to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('tenantData',JSON.stringify(data.tenant));

        // Save token for future API requests
        saveToken(data.token);

        // Update UI with tenant information
        onClose();
        router.push("/dashboard");
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.error || "Invalid email or password");
        } else {
            setError("An unexpected error occurred.");
        }
    } finally {
        setLoading(false);
    }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-6 animate-fadeIn">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-white">Tenant Login</DialogTitle>
          <p className="text-sm text-gray-300 mt-1">Sign in to access your department</p>
        </DialogHeader>
        <div className="space-y-4">
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