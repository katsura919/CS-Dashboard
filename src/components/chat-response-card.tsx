import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ResponseStats {
  totalResponses: number;
  goodResponses: number;
  badResponses: number;
  goodPercentage: string;
  badPercentage: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

console.log(API_BASE_URL);
export default function ChatResponseCard() {
  const [stats, setStats] = useState<ResponseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/analytics/chat-response-stats`)
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Card className="max-w-md w-full mx-auto p-6 shadow-xl rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Chat Response Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading...</p>
          </div>
        ) : stats ? (
          <>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-lg shadow">
              Good Responses: {stats.goodPercentage}
            </p>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 px-4 py-2 rounded-lg shadow">
              Bad Responses: {stats.badPercentage}
            </p>
            <p className="text-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg shadow">
              Total Responses: {stats.totalResponses}
            </p>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        )}
      </CardContent>
    </Card>
  );
}
