"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Process Manager</h1>
      <Button className="bg-blue-500" onClick={() => router.push("/dashboard")}>
        Go to Dashboard
      </Button>
    </div>
  );
}
