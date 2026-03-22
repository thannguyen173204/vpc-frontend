import { memo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

interface PerformanceChartProps {
  data: any[];
}

export const PerformanceChart = memo(({ data }: PerformanceChartProps) => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-500" /> 
        Monitor
      </h2>
      
      {data && data.length > 0 ? (
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
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
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
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
                isAnimationActive={false} // TẮT ĐỂ MƯỢT KHI SIDEBAR CO GIÃN
              />
              <Line 
                type="monotone" 
                dataKey="ram" 
                name="RAM (%)" 
                stroke="#10b981" 
                strokeWidth={2.5} 
                dot={false}
                activeDot={{ r: 4 }} 
                isAnimationActive={false} // TẮT ĐỂ MƯỢT KHI SIDEBAR CO GIÃN
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
          Đang thu thập dữ liệu từ Prometheus...
        </div>
      )}
    </div>
  );
});

PerformanceChart.displayName = "PerformanceChart";