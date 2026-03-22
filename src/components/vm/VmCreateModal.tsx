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

  // TÍNH TOÁN TÀI NGUYÊN KHẢ DỤNG TỪ CHUỖI CỦA BACKEND
  let availableRamMB = 999999;
  let availableDiskGB = 999999;
  
  if (systemStats) {
    try {
      // Parse ram.detail ví dụ: "2.0 / 16.0 GB"
      if (systemStats.ram?.detail) {
        const parts = systemStats.ram.detail.split(' / ');
        const used = parseFloat(parts[0]);
        const total = parseFloat(parts[1]);
        availableRamMB = Math.floor((total - used) * 1024);
      }
      // Parse disk.detail ví dụ: "50.0 / 500.0 GB"
      if (systemStats.disk?.detail) {
        const parts = systemStats.disk.detail.split(' / ');
        const used = parseFloat(parts[0]);
        const total = parseFloat(parts[1]);
        availableDiskGB = Math.floor(total - used);
      }
    } catch (e) {
      console.error("Lỗi parse thông số tài nguyên:", e);
    }
  }

  // LOGIC CHẶN FRONTEND
  const isCpuOver = data.cpu > 8; // Giới hạn cứng 8 core trên UI
  const isRamOver = data.ram > availableRamMB;
  const isDiskOver = data.disk > availableDiskGB;
  const isInvalid = isCpuOver || isRamOver || isDiskOver;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9-]+$/.test(data.vmName)) return toast.error("Tên VM chỉ chứa chữ cái không dấu, số và dấu gạch ngang (-)");
    if (isInvalid) return toast.error("Vui lòng điều chỉnh thông số không vượt quá tài nguyên hệ thống!");
    
    onSubmit({
      ...data,
      cpu: Number(data.cpu),
      ram: Number(data.ram),
      disk: Number(data.disk)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Khởi tạo máy ảo mới</DialogTitle>
        </DialogHeader>

        {/* CẢNH BÁO 10 PHÚT */}
        <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 rounded-lg p-3 flex gap-3 text-orange-800 dark:text-orange-300 text-sm">
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
                <p className="font-semibold">Giới hạn hệ thống (Trải nghiệm)</p>
                <p>Vì tài nguyên máy chủ có hạn, máy ảo của bạn sẽ <strong>tự động bị thu hồi và xóa sạch sau 10 phút</strong>. Vui lòng lưu lại dữ liệu trước khi hết giờ.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tên máy ảo (Ký tự & số)</Label>
              <Input required value={data.vmName} onChange={(e) => setData({...data, vmName: e.target.value})} placeholder="vidu-vm-01" />
            </div>
            <div className="space-y-2">
              <Label>Hệ điều hành</Label>
              <Select value={data.osName} onValueChange={(v) => setData({...data, osName: v})}>
                <SelectTrigger><SelectValue placeholder="Chọn OS" /></SelectTrigger>
                <SelectContent><SelectItem value="ubuntu">Ubuntu 22.04 LTS</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Username</Label><Input required value={data.vmUsername} onChange={(e) => setData({...data, vmUsername: e.target.value})} /></div>
            <div className="space-y-2"><Label>Password</Label><Input type="password" required value={data.vmPassword} onChange={(e) => setData({...data, vmPassword: e.target.value})} /></div>
          </div>
          
          {/* HIỂN THỊ TÀI NGUYÊN KHẢ DỤNG */}
          <div className="grid grid-cols-3 gap-4 border-t pt-4 bg-muted/20 p-3 rounded-lg mt-2">
            <div className="space-y-2">
              <Label className={isCpuOver ? "text-destructive" : ""}>CPU (Max: 8)</Label>
              <Input type="number" className={isCpuOver ? "border-destructive focus-visible:ring-destructive" : ""} value={data.cpu} onChange={(e) => setData({...data, cpu: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label className={isRamOver ? "text-destructive" : ""}>RAM (Trống {availableRamMB === 999999 ? '?' : availableRamMB} MB)</Label>
              <Input type="number" step="512" className={isRamOver ? "border-destructive focus-visible:ring-destructive" : ""} value={data.ram} onChange={(e) => setData({...data, ram: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label className={isDiskOver ? "text-destructive" : ""}>Disk (Trống {availableDiskGB === 999999 ? '?' : availableDiskGB} GB)</Label>
              <Input type="number" className={isDiskOver ? "border-destructive focus-visible:ring-destructive" : ""} value={data.disk} onChange={(e) => setData({...data, disk: Number(e.target.value)})} />
            </div>
            
            {isInvalid && (
              <p className="col-span-3 text-xs text-destructive flex items-center gap-1 mt-1">
                <InfoIcon className="size-3.5" /> Thông số nhập vào cao hơn tài nguyên còn trống của hệ thống.
              </p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isInvalid}>
              {isInvalid ? "Không đủ tài nguyên" : "Tạo máy ảo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}