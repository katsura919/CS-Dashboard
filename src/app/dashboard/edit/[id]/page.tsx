"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditProcess() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);

  useEffect(() => {
    fetchProcess();
  }, []);

  const fetchProcess = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/processes/getbyid/${id}`);
      setTitle(response.data.title);
      setSteps(response.data.steps);
    } catch (error) {
      console.error("Error fetching process:", error);
    }
  };

  const updateProcess = async () => {
    try {
      await axios.put(`http://localhost:5000/api/processes/update/${id}`, { title, steps });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating process:", error);
    }
  };

  const deleteProcess = async () => {
    if (!confirm("Are you sure you want to delete this process?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/processes/delete/${id}`);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting process:", error);
    }
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const deleteStep = (index: number) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Process</h1>

      {/* Title Input */}
      <Input 
        placeholder="Process Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        className="mb-2" 
      />

      {/* Steps Input */}
      <h2 className="text-lg font-semibold mt-4">Steps</h2>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <Input 
            placeholder={`Step ${index + 1}`} 
            value={step} 
            onChange={(e) => {
              const newSteps = [...steps];
              newSteps[index] = e.target.value;
              setSteps(newSteps);
            }} 
          />
          <Button className="bg-red-500" onClick={() => deleteStep(index)}>-</Button>
        </div>
      ))}
      <Button className="bg-blue-500 mt-2" onClick={addStep}>+ Add Step</Button>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <Button className="bg-green-500" onClick={updateProcess}>Update Process</Button>
        <Button className="bg-red-600" onClick={deleteProcess}>Delete Process</Button>
        <Button className="bg-gray-500" onClick={() => router.push("/dashboard")}>Cancel</Button>
      </div>
    </div>
  );
}
