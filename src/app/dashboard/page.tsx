"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Process {
  _id: string;
  title: string;
  steps: string[];
}

export default function Dashboard() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/processes/get");
      setProcesses(response.data);
    } catch (error) {
      console.error("Error fetching processes:", error);
    }
  };

  const deleteProcess = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/processes/delete/${id}`);
      fetchProcesses();
    } catch (error) {
      console.error("Error deleting process:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Process Dashboard</h1>

      <Button className="mb-4 bg-green-500" onClick={() => router.push("/dashboard/create")}>
        + Create New Process
      </Button>

      {/* List of Processes */}
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
                <Button className="bg-blue-500" onClick={() => router.push(`/dashboard/edit/${process._id}`)}>Edit</Button>
                <Button className="bg-red-500" onClick={() => deleteProcess(process._id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
