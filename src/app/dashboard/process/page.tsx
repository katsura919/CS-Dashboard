"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CreateProcess() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const lastStepRef = useRef<HTMLInputElement | null>(null);

  const addStep = () => {
    setSteps((prevSteps) => [...prevSteps, ""]);
    setTimeout(() => lastStepRef.current?.focus(), 100);
  };

  const removeStep = (index: number) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const saveProcess = async () => {
    if (!title.trim() || steps.some((s) => s.trim() === "")) {
      setError("Please provide a title and fill out all steps.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/processes/create`, { title, steps });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating process:", error);
      setError("Failed to save the process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-xl px-4">
      {/* Page Title (Top Left) */}
      <h1 className="text-2xl font-bold mb-4">Create New Process</h1>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Title Input */}
      <Input
        placeholder="Process Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
      />

      {/* Steps Input */}
      <h2 className="text-lg font-semibold mt-4 mb-2">Steps</h2>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <Input
            ref={index === steps.length - 1 ? lastStepRef : null}
            placeholder={`Step ${index + 1}`}
            value={step}
            onChange={(e) => {
              const newSteps = [...steps];
              newSteps[index] = e.target.value;
              setSteps(newSteps);
            }}
          />
          <Button variant="destructive" onClick={() => removeStep(index)}>-</Button>
        </div>
      ))}
      <Button className="mt-2" onClick={addStep}>
        + Add Step
      </Button>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <Button onClick={saveProcess} disabled={loading}>
          {loading ? "Saving..." : "Save Process"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
