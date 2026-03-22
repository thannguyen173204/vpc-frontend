import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface VmCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: any) => Promise<void>;
}

export const VmCreateModal = ({ open, onOpenChange, onSubmit }: VmCreateModalProps) => {
  const [data, setData] = useState({
    vmName: "",
    vmUsername: "ubuntu",
    vmPassword: "",
    cpu: 2,
    ram: 2048,
    disk: 20,
    osName: "ubuntu"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9-]+$/.test(data.vmName)) return toast.error("Tên VM chỉ chứa chữ cái không dấu, số và dấu gạch ngang (-)");
    
    onSubmit({
      ...data,
      cpu: Number(data.cpu),
      ram: Number(data.ram),
      disk: Number(data.disk)
    });
    
    // Reset form
    setData({ vmName: "", vmUsername: "ubuntu", vmPassword: "", cpu: 2, ram: 2048, disk: 20, osName: "ubuntu" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Khởi tạo Máy ảo mới</DialogTitle>
          <DialogDescription>Điền thông tin hệ điều hành và cấu hình phần cứng.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tên máy ảo <span className="text-red-500">*</span></Label>
              <Input required placeholder="web-server-01" value={data.vmName} onChange={(e) => setData({...data, vmName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Hệ điều hành</Label>
              <Select value={data.osName} onValueChange={(v) => setData({ ...data, osName: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="ubuntu">Ubuntu 22.04 LTS</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Username</Label><Input required value={data.vmUsername} onChange={(e) => setData({...data, vmUsername: e.target.value})} /></div>
            <div className="space-y-2"><Label>Password</Label><Input type="password" required value={data.vmPassword} onChange={(e) => setData({...data, vmPassword: e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t pt-4">
            <div className="space-y-2"><Label>CPU</Label><Input type="number" value={data.cpu} onChange={(e) => setData({...data, cpu: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>RAM (MB)</Label><Input type="number" value={data.ram} onChange={(e) => setData({...data, ram: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Disk (GB)</Label><Input type="number" value={data.disk} onChange={(e) => setData({...data, disk: Number(e.target.value)})} /></div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" className="min-w-[120px]">Khởi tạo VM</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};