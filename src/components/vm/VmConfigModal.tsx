import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { type VirtualMachine } from "./VmDataTable";

interface VmConfigModalProps {
  vm: VirtualMachine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const VmConfigModal = ({ vm, open, onOpenChange, onSave, isSubmitting }: VmConfigModalProps) => {
  const [formData, setFormData] = useState({ cpu: 1, ram: 1024, disk: 10, vmPassword: "" });

  useEffect(() => {
    if (vm) {
      setFormData({ cpu: vm.cpu || 1, ram: vm.ram || 1024, disk: vm.disk || 10, vmPassword: "" });
    }
  }, [vm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cấu hình Máy ảo</DialogTitle>
          <DialogDescription>Thay đổi tài nguyên cho VM <strong>{vm?.vm_name}</strong></DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cpu" className="text-right">CPU</Label>
              <Input id="cpu" type="number" className="col-span-3" value={formData.cpu} onChange={(e) => setFormData({...formData, cpu: Number(e.target.value)})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ram" className="text-right">RAM (MB)</Label>
              <Input id="ram" type="number" className="col-span-3" value={formData.ram} onChange={(e) => setFormData({...formData, ram: Number(e.target.value)})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="disk" className="text-right">Disk (GB)</Label>
              <Input id="disk" type="number" className="col-span-3" value={formData.disk} onChange={(e) => setFormData({...formData, disk: Number(e.target.value)})} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className="mr-2 size-4 animate-spin" />} Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};