import { memo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PerformanceChartProps {
  data: any[];
  // Cập nhật lại type cho đúng 3 mốc thời gian mới
  onTimeRangeChange?: (range: '1h' | '8h' | '24h') => void; 
}

export const PerformanceChart = memo(({ data, onTimeRangeChange }: PerformanceChartProps) => {
  const [timeRange, setTimeRange] = useState<'1h' | '8h' | '24h'>('1h');

  const handleRangeChange = (range: '1h' | '8h' | '24h') => {
    setTimeRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" /> 
          Monitor
        </h2>
        
        {/* THANH CHỌN THỜI GIAN ĐÃ SỬA THÀNH 1H - 8H - 24H */}
        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border w-fit">
          <Button
            variant={timeRange === "1h" ? "secondary" : "ghost"}
            size="sm"
            className={`h-7 px-3 text-xs rounded-md transition-all ${timeRange === "1h" ? "shadow-sm font-medium" : "text-muted-foreground"}`}
            onClick={() => handleRangeChange("1h")}
          >
            1 Giờ
          </Button>
          <Button
            variant={timeRange === "8h" ? "secondary" : "ghost"}
            size="sm"
            className={`h-7 px-3 text-xs rounded-md transition-all ${timeRange === "8h" ? "shadow-sm font-medium" : "text-muted-foreground"}`}
            onClick={() => handleRangeChange("8h")}
          >
            8 Giờ
          </Button>
          <Button
            variant={timeRange === "24h" ? "secondary" : "ghost"}
            size="sm"
            className={`h-7 px-3 text-xs rounded-md transition-all ${timeRange === "24h" ? "shadow-sm font-medium" : "text-muted-foreground"}`}
            onClick={() => handleRangeChange("24h")}
          >
            24 Giờ
          </Button>
        </div>
      </div>
      
      {data && data.length > 0 ? (
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis 
                dataKey="time" 
                tick={{fontSize: 11, fill: '#94a3b8'}} 
                tickMargin={10}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{fontSize: 11, fill: '#94a3b8'}} 
                tickFormatter={(val) => `${val}%`} 
                width={40} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                name="CPU (%)" 
                stroke="#6366f1" 
                strokeWidth={2.5} 
                dot={false}
                activeDot={{ r: 4 }} 
                isAnimationActive={false} 
              />
              <Line 
                type="monotone" 
                dataKey="ram" 
                name="RAM (%)" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                dot={false}
                activeDot={{ r: 4 }} 
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
          Đang thu thập dữ liệu từ hệ thống...
        </div>
      )}
    </div>
  );
});

PerformanceChart.displayName = "PerformanceChart";