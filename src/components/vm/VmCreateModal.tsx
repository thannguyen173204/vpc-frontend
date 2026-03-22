import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertCircle, InfoIcon } from "lucide-react";

interface VmCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: any) => Promise<void>;
  systemStats?: any;
}

export const VmCreateModal = ({ open, onOpenChange, onSubmit, systemStats }: VmCreateModalProps) => {
  const [data, setData] = useState({
    vmName: "",
    vmUsername: "ubuntu",
    vmPassword: "",
    cpu: 2,
    ram: 2048,
    disk: 20,
    osName: "ubuntu"
  });

  // TÍNH TOÁN TÀI NGUYÊN (Giữ nguyên logic của bạn nhưng thêm fallback an toàn)
  let availableRamMB = 0;
  let availableDiskGB = 0;
  
  if (systemStats) {
    try {
      if (systemStats.ram?.detail) {
        const parts = systemStats.ram.detail.split(' / ');
        availableRamMB = Math.floor((parseFloat(parts[1]) - parseFloat(parts[0])) * 1024);
      }
      if (systemStats.disk?.detail) {
        const parts = systemStats.disk.detail.split(' / ');
        availableDiskGB = Math.floor(parseFloat(parts[1]) - parseFloat(parts[0]));
      }
    } catch (e) {
      console.error("Lỗi parse thông số:", e);
    }
  }

  const isCpuOver = data.cpu > 8;
  const isRamOver = data.ram > availableRamMB;
  const isDiskOver = data.disk > availableDiskGB;
  const isInvalid = isCpuOver || isRamOver || isDiskOver;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9-]+$/.test(data.vmName)) return toast.error("Tên VM không hợp lệ");
    if (isInvalid) return toast.error("Vượt quá tài nguyên!");
    
    onSubmit({ ...data, cpu: Number(data.cpu), ram: Number(data.ram), disk: Number(data.disk) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Khởi tạo máy ảo mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* CẢNH BÁO */}
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-xl p-4 flex gap-3 text-orange-800 dark:text-orange-300 text-sm">
            <AlertCircle className="size-5 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold leading-none">Giới hạn hệ thống (Trải nghiệm)</p>
              <p className="opacity-90">Máy ảo sẽ tự động bị xóa sạch sau <span className="font-bold">10 phút</span>.</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* ROW 1: Tên & OS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tên máy ảo</Label>
                <Input required value={data.vmName} onChange={(e) => setData({...data, vmName: e.target.value})} placeholder="my-vm-01" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Hệ điều hành</Label>
                <Select value={data.osName} onValueChange={(v) => setData({...data, osName: v})}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ubuntu">Ubuntu 22.04 LTS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ROW 2: Auth */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Username</Label>
                <Input required value={data.vmUsername} onChange={(e) => setData({...data, vmUsername: e.target.value})} className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Password</Label>
                <Input type="password" required value={data.vmPassword} onChange={(e) => setData({...data, vmPassword: e.target.value})} placeholder="••••••••" className="bg-background" />
              </div>
            </div>

            {/* ROW 3: HARDWARE (BOX XÁM) */}
            <div className="bg-muted/40 rounded-xl p-4 border border-dashed border-muted-foreground/20 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className={`text-[11px] uppercase tracking-wider font-bold ${isCpuOver ? "text-destructive" : "text-muted-foreground"}`}>CPU (Max: 8)</Label>
                  <Input type="number" className="h-9 bg-background" value={data.cpu} onChange={(e) => setData({...data, cpu: Number(e.target.value)})} />
                </div>
                <div className="space-y-1.5">
                  <Label className={`text-[11px] uppercase tracking-wider font-bold ${isRamOver ? "text-destructive" : "text-muted-foreground"}`}>RAM (MB)</Label>
                  <Input type="number" step="512" className="h-9 bg-background" value={data.ram} onChange={(e) => setData({...data, ram: Number(e.target.value)})} />
                </div>
                <div className="space-y-1.5">
                  <Label className={`text-[11px] uppercase tracking-wider font-bold ${isDiskOver ? "text-destructive" : "text-muted-foreground"}`}>Disk (GB)</Label>
                  <Input type="number" className="h-9 bg-background" value={data.disk} onChange={(e) => setData({...data, disk: Number(e.target.value)})} />
                </div>
              </div>

              {/* RESOURCE INFO */}
              <div className="flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between text-[10px] font-medium uppercase text-muted-foreground/70">
                   <span>Trống: {availableRamMB}MB RAM</span>
                   <span>Trống: {availableDiskGB}GB Disk</span>
                </div>
                {isInvalid && (
                  <p className="text-[11px] text-destructive flex items-center gap-1 font-medium">
                    <InfoIcon className="size-3" /> Tài nguyên yêu cầu vượt mức khả dụng.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isInvalid} className="min-w-[120px]">
              {isInvalid ? "Không đủ tài nguyên" : "Tạo máy ảo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}