"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getToken } from "@/lib/auth";
import Sidebar from "@/components/side-bar"; // Import Sidebar

interface Process {
  _id: string;
  title: string;
  steps: string[];
}

export default function Dashboard() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/");
    } else {
      fetchProcesses(token);
    }
  }, [router]);

  const fetchProcesses = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:5000/api/processes/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProcesses(response.data);
    } catch (error) {
      console.error("Error fetching processes:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const deleteProcess = async (id: string) => {
    const token = getToken();
    if (!token) return router.push("/");

    try {
      await axios.delete(`http://localhost:5000/api/processes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProcesses(token);
    } catch (error) {
      console.error("Error deleting process:", error);
    }
  };

  if (loading) {
    return <div className="h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar on the left */}
      <div className="ml-64 p-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">Process Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processes.map((process) => (
            <Card key={process._id}>
              <CardHeader>
                <CardTitle>{process.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {process.steps.map((step, index) => (
                    <li key={index} className="text-sm">{index + 1}. {step}</li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-blue-500 px-3 py-1 rounded text-white"
                    onClick={() => router.push(`/dashboard/edit/${process._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 px-3 py-1 rounded text-white"
                    onClick={() => deleteProcess(process._id)}
                  >
                    Delete
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
