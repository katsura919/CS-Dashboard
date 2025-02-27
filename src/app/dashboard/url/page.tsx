"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

export default function ShareChatPage() {
  const [slug, setSlug] = useState<string | null>(null);
  const [chatUrl, setChatUrl] = useState<string>("");

  useEffect(() => {
    try {
      // Get tenant data from localStorage
      const tenantData = localStorage.getItem("tenantData");
      console.log("Raw tenant data:", tenantData);

      // Ensure data exists before parsing
      if (tenantData) {
        const parsedTenantData = JSON.parse(tenantData);
        console.log("Parsed tenant data:", parsedTenantData);

        // Extract slug safely
        const storedSlug = parsedTenantData?.slug ?? null;

        if (storedSlug && typeof storedSlug === "string") {
          setSlug(storedSlug);
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
          setChatUrl(`${baseUrl}/chat/${storedSlug}`);
        }
      }
    } catch (error) {
      console.error("Error parsing tenantData:", error);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Share Chatbot Link
        </h1>

        {slug ? (
          <>
            {/* Chat URL Display */}
            <div className="mt-4">
              <Input value={chatUrl} readOnly className="w-full text-gray-900 dark:text-gray-100" />
            </div>

            {/* QR Code */}
            <div className="mt-4 flex justify-center">
              <QRCodeSVG value={chatUrl} size={150} />
            </div>

            {/* Copy Button */}
            <Button
              onClick={() => {
                navigator.clipboard.writeText(chatUrl);
                alert("Chat link copied to clipboard!");
              }}
              className="mt-4 w-full"
            >
              Copy Link
            </Button>
          </>
        ) : (
          <p className="text-red-500 mt-4">No chat session found. Please start a chat first.</p>
        )}
      </Card>
    </div>
  );
}
