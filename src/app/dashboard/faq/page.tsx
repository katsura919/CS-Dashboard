"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

export default function CreateFAQ() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const saveFAQ = async () => {
      if (!question.trim() || !answer.trim()) {
          setError("Please provide both question and answer.");
          return;
      }
  
      try {
          setLoading(true);
          setError(null);
          
          // Get tenant data from localStorage
          const tenantData = localStorage.getItem('tenantData');
          console.log('Raw tenant data:', tenantData);
          
          if (!tenantData) {
              setError("Tenant data is required.");
              return;
          }
  
          // Parse the tenant data
          const parsedTenantData = JSON.parse(tenantData);
          console.log('Parsed tenant data:', parsedTenantData);
          
          // Extract tenantId from parsed data
          const tenantId = parsedTenantData?.id || parsedTenantData;
          console.log("Tenant ID: ", tenantId);
          if (!tenantId) {
              setError("Tenant ID is required.");
              return;
          }
  
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/faqs/create`, {
              question,
              answer,
              tenantId
          });
  
          toast({
              title: "Success",
              description: "FAQ created successfully!",
              className: "bg-green-500 text-white",
          });
  
          // Clear input fields after success
          setQuestion("");
          setAnswer("");
      } catch (error) {
          console.error("Error creating FAQ:", error);
          setError("Failed to save the FAQ. Please try again.");
          toast({
              title: "Error",
  description: "Failed to save the FAQ.",
  variant: "destructive",
          });
      } finally {
          setLoading(false);
      }
  };

    return (
        <div className="flex flex-col max-w-xl px-4">
            {/* Page Title */}
            <h1 className="text-2xl font-bold mb-4">Create New FAQ</h1>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Question Input */}
            <Input
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="mb-4"
            />

            {/* Answer Input */}
            <Textarea
                placeholder="Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="mb-4"
            />

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
                <Button onClick={saveFAQ} disabled={loading}>
                    {loading ? "Saving..." : "Save FAQ"}
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}