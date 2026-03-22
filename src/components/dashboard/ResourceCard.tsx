import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { type LucideIcon } from "lucide-react";

interface ResourceCardProps {
  title: string;
  percent: number | string; // Cho phép nhận cả chuỗi phòng hờ lỗi API
  detail: string;
  icon: LucideIcon;
}

export const ResourceCard = memo(({ title, percent, detail, icon: Icon }: ResourceCardProps) => {
  // ÉP KIỂU VỀ SỐ THỰC: Chìa khóa để biểu đồ luôn hiện màu!
  const safePercent = Number(percent) || 0;

  const data = [
    { name: "Used", value: safePercent },
    { name: "Free", value: Math.max(0, 100 - safePercent) },
  ];

  // Logic đổi màu: > 85% Đỏ, > 60% Vàng, còn lại Xanh
  const strokeColor = safePercent >= 85 ? "#ef4444" : safePercent >= 60 ? "#f59e0b" : "#10b981";

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
                isAnimationActive={false}
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
                {/* Bắt buộc phải có thuộc tính key */}
                <Cell key="used" fill={strokeColor} />
                <Cell key="free" fill="#f1f5f9" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold" style={{ color: strokeColor }}>
              {safePercent.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="mt-2 text-center text-xs text-muted-foreground font-mono">
          {detail}
        </div>
      </CardContent>
    </Card>
  );
});