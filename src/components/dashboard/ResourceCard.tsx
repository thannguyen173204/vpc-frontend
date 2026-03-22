import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { type LucideIcon } from "lucide-react";

interface ResourceCardProps {
  title: string;
  percent: number;
  detail: string;
  icon: LucideIcon;
}

export const ResourceCard = memo(({ title, percent, detail, icon: Icon }: ResourceCardProps) => {
  const data = [
    { name: "Used", value: percent },
    { name: "Free", value: Math.max(0, 100 - percent) },
  ];

  const strokeColor = percent >= 85 ? "#ef4444" : percent >= 60 ? "#f59e0b" : "#10b981";

  return (
    <Card className="flex flex-col shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[120px] relative">
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            <PieChart>
              <Pie
                isAnimationActive={false} // LUÔN TẮT CHO PIE VÌ NÓ NHỎ
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={strokeColor} />
                <Cell fill="#f1f5f9" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold" style={{ color: strokeColor }}>{percent}%</span>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-2 pb-4">{detail}</div>
      </CardContent>
    </Card>
  );
});

ResourceCard.displayName = "ResourceCard";