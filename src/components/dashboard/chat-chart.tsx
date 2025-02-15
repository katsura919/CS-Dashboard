"use client";

import * as React from "react";
import axios from "axios";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  good: {
    label: "Good Responses",
    color: "hsl(var(--chart-1))",
  },
  bad: {
    label: "Bad Responses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChatChart() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/response-count?range=${timeRange}`);
        setChartData(response.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [timeRange]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing chat responses for the selected time range
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillGood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-good)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-good)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillBad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-bad)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-bad)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="good"
                type="natural"
                fill="url(#fillGood)"
                stroke="var(--color-good)"
                stackId="a"
              />
              <Area
                dataKey="bad"
                type="natural"
                fill="url(#fillBad)"
                stroke="var(--color-bad)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
