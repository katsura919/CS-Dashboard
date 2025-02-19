"use client";

import { use, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProcessDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); // Correct way to unwrap params
  const { toast } = useToast(); // ✅ Initialize toast

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // Fetch process details
  useEffect(() => {
    async function fetchProcess() {
      try {
        const response = await axios.get(`${API_URL}/api/processes/getbyid/${id}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setSteps(response.data.steps || []);
        setCreatedAt(response.data.createdAt);
        setUpdatedAt(response.data.updatedAt);
      } catch (err) {
        setError("Failed to load process details.");
        console.error("Error fetching process:", err);
      }
    }
    fetchProcess();
  }, [id]);
  

  // Auto-adjust textarea height
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Adjust height
    }
  }, [description]);

  // Handle step addition
  const addStep = () => {
    if (steps.some(step => step.trim() === "")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Steps cannot be empty.",
      });
      return;
    }
    setSteps([...steps, ""]); // Add a new step
  };

  // Handle step removal
  const removeStep = (index: number) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
  };

  // Handle step change
  const handleStepChange = (index: number, value: string) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.put(`${API_URL}/api/processes/update/${id}`, {
        title,
        description,
        steps, // ✅ Ensure steps are sent in the request
      });
  
      toast({
        title: "Success",
        description: "Process updated successfully!",
        className: "bg-green-500 text-white",
      });
  
      // ✅ Ensure UI updates reflect changes
      setTitle(response.data.title);
      setDescription(response.data.description);
      setSteps(response.data.steps || []);
    } catch (err) {
      setError("Failed to update process. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update process. Please try again.",
        className: "bg-red-500 text-white",
      });
      console.error("Error updating process:", err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col max-w-xl px-4">
      <h1 className="text-2xl font-bold mb-4">Edit Process</h1>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          ref={textAreaRef}
          className="resize-none overflow-hidden"
        />
        <div className="mt-4 text-sm text-gray-500">
        {createdAt && <p>Created At: {new Date(createdAt).toLocaleString()}</p>}
        {updatedAt && <p>Last Updated: {new Date(updatedAt).toLocaleString()}</p>}
        </div>
        {/* Steps Section */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Steps</h2>
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <Input
                type="text"
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-1"
              />
              <Button variant="destructive" size="icon" onClick={() => removeStep(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addStep} className="mt-2">
            <Plus className="w-4 h-4 mr-2" /> Add Step
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/processes")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
