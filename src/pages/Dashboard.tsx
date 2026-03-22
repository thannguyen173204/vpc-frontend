"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Cpu, Activity, HardDrive, Loader2 } from "lucide-react";

import { vmService } from "@/services/vmService";
import { ResourceCard } from "@/components/dashboard/ResourceCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";

export default function Page() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. TẠO STATE LƯU TRỮ MỐC THỜI GIAN
  const [timeRange, setTimeRange] = useState<'1h' | '8h' | '24h'>('1h');

  // 2. TRUYỀN THỜI GIAN XUỐNG API
  const fetchStats = async (range = timeRange) => {
    try {
      setIsLoading(true); // Hiển thị loading nhẹ khi đổi tab
      const data = await vmService.getSystemStats(range);
      setStats(data);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. TỰ ĐỘNG GỌI LẠI API KHI timeRange THAY ĐỔI
  useEffect(() => {
    fetchStats(timeRange);
    const interval = setInterval(() => fetchStats(timeRange), 30000);
    return () => clearInterval(interval);
  }, [timeRange]); // <-- useEffect sẽ theo dõi biến này

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="transition-all duration-300 ease-in-out will-change-[width,margin]">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Minicloud</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tổng quan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {isLoading && !stats ? (
              <div className="col-span-3 flex justify-center items-center h-[180px]">
                <Loader2 className="animate-spin mr-2 text-primary" /> Đang đồng bộ ESXi...
              </div>
            ) : stats ? (
              <>
                <ResourceCard title="CPU Usage" percent={stats.cpu.percent} detail={stats.cpu.detail} icon={Cpu} />
                <ResourceCard title="Memory (RAM)" percent={stats.ram.percent} detail={stats.ram.detail} icon={Activity} />
                <ResourceCard title="Datastore (Disk)" percent={stats.disk.percent} detail={stats.disk.detail} icon={HardDrive} />
              </>
            ) : null}
          </div>

          {/* 4. TRUYỀN SỰ KIỆN setTimeRange CHO BIỂU ĐỒ */}
          <PerformanceChart 
            data={stats?.history || []} 
            onTimeRangeChange={setTimeRange} 
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}