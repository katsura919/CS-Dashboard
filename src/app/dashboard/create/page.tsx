"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateProcess() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);
  const router = useRouter();

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const removeStep = (index: number) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const saveProcess = async () => {
    if (!title.trim() || steps.some((s) => s.trim() === "")) return;

    try {
      await axios.post("http://localhost:5000/api/processes/create", { title, steps });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating process:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Process</h1>

      {/* Title Input */}
      <Input placeholder="Process Title" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-3" />

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
          <Button className="bg-red-500" onClick={() => removeStep(index)}>-</Button>
        </div>
      ))}
      <Button className="bg-blue-500 mt-2" onClick={addStep}>+ Add Step</Button>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <Button className="bg-green-500" onClick={saveProcess}>Save Process</Button>
        <Button className="bg-gray-500" onClick={() => router.push("/dashboard")}>Cancel</Button>
      </div>
    </div>
  );
}
