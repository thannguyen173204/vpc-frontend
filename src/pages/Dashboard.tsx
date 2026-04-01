"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Cpu, Activity, HardDrive, Loader2, WifiOff, RefreshCcw } from "lucide-react"; // Thêm icon

import { vmService } from "@/services/vmService";
import { ResourceCard } from "@/components/dashboard/ResourceCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '8h' | '24h'>('1h');
  
  // 1. THÊM STATE KIỂM TRA KẾT NỐI
  const [isOffline, setIsOffline] = useState(false);

  const fetchStats = async (range = timeRange) => {
    try {
      // Đừng hiện loading xoay vòng khi đang tự động cập nhật ngầm
      if (!stats) setIsLoading(true); 
      
      const data = await vmService.getSystemStats(range);
      
      setStats(data);
      setIsOffline(false); // Kết nối lại thành công
    } catch (error) {
      console.error("Mất kết nối Server:", error);
      
      // 2. NẾU LỖI THÌ BÁO OFFLINE
      if (!isOffline) {
        toast.error("Mất kết nối đến máy chủ API!", {
            description: "Hệ thống sẽ tự động thử kết nối lại sau mỗi 30 giây.",
        });
      }
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(timeRange);
    const interval = setInterval(() => fetchStats(timeRange), 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="transition-all duration-300">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Minicloud</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Tổng quan</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* 3. THANH CẢNH BÁO MẤT KẾT NỐI (STICKY BANNER) */}
        {isOffline && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-2 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-destructive text-sm font-medium">
              <WifiOff className="size-4" />
              <span>Đã mất kết nối với Server API. Vui lòng thử lại sau</span>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              className="h-7 text-xs gap-1"
              onClick={() => fetchStats()}
            >
              <RefreshCcw className="size-3" /> Thử lại ngay
            </Button>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {isLoading && !stats ? (
              <div className="col-span-3 flex flex-col justify-center items-center h-[180px] gap-2">
                <Loader2 className="animate-spin text-primary size-8" />
                <span className="text-sm text-muted-foreground">Đang đồng bộ dữ liệu ESXi...</span>
              </div>
            ) : stats ? (
              <>
                <ResourceCard title="CPU Usage" percent={stats.cpu.percent} detail={stats.cpu.detail} icon={Cpu} />
                <ResourceCard title="Memory (RAM)" percent={stats.ram.percent} detail={stats.ram.detail} icon={Activity} />
                <ResourceCard title="Datastore (Disk)" percent={stats.disk.percent} detail={stats.disk.detail} icon={HardDrive} />
              </>
            ) : (
                <div className="col-span-3 h-[180px] border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground">
                    Không có dữ liệu để hiển thị.
                </div>
            )}
          </div>

          <PerformanceChart 
            data={stats?.history || []} 
            onTimeRangeChange={setTimeRange} 
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}