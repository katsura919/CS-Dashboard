import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;  // ✅ Pass the icon as a component, not an instance
  description: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,  // ✅ Rename to "Icon" and render it below
  description,
}) => {
  return (
    <Card className="border p-4 rounded-xl shadow-md">
      <CardContent className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{title}</span>
          <Icon className="w-5 h-5 text-gray-400" />  {/* ✅ Render the icon here */}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm">{change}</div>
        <div className="text-xs">{description}</div>
      </CardContent>
    </Card>
  );
};
