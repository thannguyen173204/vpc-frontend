import { useEffect, useState } from "react";
import { useSearchParams } from "react-router"; // Dùng 'next/navigation' nếu là Next.js

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon, ServerIcon, PlayIcon, SquareIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { vmService } from "@/services/vmService";
import { VmDataTable, type VirtualMachine } from "@/components/vm/VmDataTable";
import { VmCreateModal } from "@/components/vm/VmCreateModal";
import { VmConfigModal } from "@/components/vm/VmConfigModal";

// IMPORT ZUSTAND VÀO ĐÂY
import { useNotificationStore } from "@/stores/useNotificationStore";

export default function Instances() {
  const [vms, setVms] = useState<VirtualMachine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedVm, setSelectedVm] = useState<VirtualMachine | null>(null);
  const [isSubmittingConfig, setIsSubmittingConfig] = useState(false);

  const [searchParams] = useSearchParams();

  // KÉO HÀM TỪ KHO ZUSTAND RA ĐỂ SỬ DỤNG
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  const fetchVMs = async () => {
    try {
      const data = await vmService.getAllInstances();
      setVms(data);
    } catch (error) {
      toast.error("Lỗi tải danh sách VM.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVMs();
    const interval = setInterval(() => {
      vmService.getAllInstances().then(setVms).catch(() => { });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleVmAction = async (action: any, vmName: string) => {
    try {
      setActionLoading(vmName);
      const actionMap: any = { 
        start: vmService.startVm, 
        stop: vmService.stopVm, 
        restart: vmService.restartVm, 
        delete: vmService.deleteVm 
      };
      await actionMap[action](vmName);

      // BẮN THÔNG BÁO: KHI START/STOP/RESTART/DELETE THÀNH CÔNG
      const msg = `Thực hiện ${action} thành công trên máy ảo ${vmName}`;
      toast.success(msg);
      addNotification(msg); // Lưu vào Inbox

      if (action === 'delete') fetchVMs();
      else setVms(prev => prev.map(vm => vm.vm_name === vmName ? { ...vm, status: 'pending' } : vm));
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || `Lỗi thao tác ${action}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateVm = async (payload: any) => {
    setIsCreateOpen(false);
    toast.info(`Đang khởi tạo ${payload.vmName}...`);
    try {
      await vmService.createVm(payload);
      
      // BẮN THÔNG BÁO: KHI TẠO VM THÀNH CÔNG
      const msg = `Khởi tạo thành công máy ảo ${payload.vmName}`;
      toast.success(msg);
      addNotification(msg); // Lưu vào Inbox
      
      fetchVMs();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Lỗi tạo VM");
    }
  };

  const handleUpdateConfig = async (formData: any) => {
    if (!selectedVm) return;
    setIsSubmittingConfig(true);
    try {
      await vmService.configVm({ vmName: selectedVm.vm_name, ...formData });
      
      // BẮN THÔNG BÁO: KHI CẤU HÌNH VM THÀNH CÔNG
      const msg = `Đã cập nhật cấu hình cho máy ảo ${selectedVm.vm_name}`;
      toast.success(msg);
      addNotification(msg); // Lưu vào Inbox
      
      setIsConfigOpen(false);
      fetchVMs();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Lỗi cấu hình");
    } finally {
      setIsSubmittingConfig(false);
    }
  };

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
                <BreadcrumbPage>Máy ảo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Virtual Machines</h1>
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusIcon className="mr-2 size-4" />Tạo VM
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={ServerIcon} label="Tổng số VM" value={vms.length} color="bg-blue-100 text-blue-600" />
            <StatCard icon={PlayIcon} label="Đang chạy" value={vms.filter(v => v.status === 'running').length} color="bg-green-100 text-green-600" />
            <StatCard icon={SquareIcon} label="Đã tắt" value={vms.filter(v => v.status === 'stopped').length} color="bg-gray-100 text-gray-600" />
          </div>

          <div className="border rounded-xl bg-card p-4 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center py-20 text-muted-foreground">
                <Loader2Icon className="animate-spin mb-4" /> Tải dữ liệu...
              </div>
            ) : (
              <VmDataTable 
                data={vms} 
                onAction={handleVmAction} 
                onConfig={(vm) => { setSelectedVm(vm); setIsConfigOpen(true); }} 
                isActionLoading={actionLoading} 
              />
            )}
          </div>
        </div>

        <VmCreateModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSubmit={handleCreateVm} />
        <VmConfigModal 
          vm={selectedVm} 
          open={isConfigOpen} 
          onOpenChange={setIsConfigOpen} 
          onSave={handleUpdateConfig} 
          isSubmitting={isSubmittingConfig} 
        />
      </SidebarInset>
    </SidebarProvider>
  )
}

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}><Icon className="size-6" /></div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);