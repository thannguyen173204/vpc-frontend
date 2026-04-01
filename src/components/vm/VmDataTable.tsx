import * as React from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayIcon, SquareIcon, ServerIcon, RefreshCwIcon, SettingsIcon, Trash2Icon, Loader2Icon, CopyIcon, TerminalIcon } from "lucide-react"
import { toast } from "sonner"

export type VirtualMachine = {
    _id: string
    vm_name: string
    vm_username?: string // Thêm trường này để render SSH
    ip_address?: string
    cpu: number
    ram: number
    disk: number
    status: string
    createdAt?: string // Dùng để tính toán đếm ngược
}

interface VmDataTableProps {
    data: VirtualMachine[];
    onAction: (action: 'start' | 'stop' | 'restart' | 'delete', vmName: string) => void;
    onConfig: (vm: VirtualMachine) => void;
    isActionLoading: string | null;
}

// COMPONENT ĐẾM NGƯỢC
const VMCountdown = ({ createdAt, status }: { createdAt?: string, status: string }) => {
    const [timeLeft, setTimeLeft] = React.useState<string>("");

    React.useEffect(() => {
        if (status === 'failed') {
            setTimeLeft("Lỗi");
            return;
        }
        if (!createdAt) {
            setTimeLeft("-");
            return;
        }

        const calculateTime = () => {
            const createdTime = new Date(createdAt).getTime();
            const expireTime = createdTime + 9999 * 60 * 1000; // 10 phút
            const now = new Date().getTime();
            const diff = expireTime - now;

            if (diff <= 0) {
                setTimeLeft("Hết hạn");
                return;
            }

            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [createdAt, status]);

    if (timeLeft === "Hết hạn") return <Badge variant="destructive" className="animate-pulse">Đang thu hồi</Badge>;
    if (timeLeft === "Lỗi" || timeLeft === "-") return <span className="text-muted-foreground">-</span>;
    
    const isWarning = timeLeft.startsWith("02") || timeLeft.startsWith("01") || timeLeft.startsWith("00");
    return (
        <Badge variant={isWarning ? "destructive" : "outline"} className={`font-mono ${isWarning ? 'animate-pulse' : ''}`}>
            {timeLeft}
        </Badge>
    );
};

export function VmDataTable({ data, onAction, onConfig, isActionLoading }: VmDataTableProps) {

    const columns: ColumnDef<VirtualMachine>[] = React.useMemo(() => [
        {
            accessorKey: "vm_name",
            header: "Tên máy ảo",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 font-medium">
                    <ServerIcon className="size-4 text-muted-foreground" />
                    {row.original.vm_name}
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.original.status;
                if (status === 'running') return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200">Running</Badge>
                if (status === 'stopped') return <Badge variant="secondary">Stopped</Badge>
                return <Badge variant="outline" className="animate-pulse"><Loader2Icon className="mr-1 size-3 animate-spin" /> Pending</Badge>
            }
        },
        {
            id: "ttl",
            header: "Thời hạn còn lại",
            cell: ({ row }) => <VMCountdown createdAt={row.original.createdAt} status={row.original.status} />
        },
        {
            accessorKey: "ip_address",
            header: "IP Address",
            cell: ({ row }) => (
                <span className="font-mono text-sm text-muted-foreground">
                    {row.original.ip_address || "Đang cấp..."}
                </span>
            )
        },
        {
            id: "ssh",
            header: "Lệnh SSH (Bastion)",
            cell: ({ row }) => {
                if (row.original.status !== 'running') return <span className="text-muted-foreground text-xs">-</span>;
                
                // Mặc định username là ubuntu nếu database chưa trả về
                const username = row.original.vm_username || "ubuntu";
                const sshCmd = `ssh ${username}#${row.original.vm_name}@api.ngocthan.click`;
                
                return (
                    <div className="flex items-center gap-1.5 bg-muted/50 rounded-md p-1 border w-fit">
                        <TerminalIcon className="size-3.5 text-muted-foreground ml-1" />
                        <code className="text-xs max-w-[140px] truncate" title={sshCmd}>
                            {sshCmd}
                        </code>
                        <Button 
                            variant="ghost" 
                            size="icon-xs" 
                            className="size-6 hover:bg-background shrink-0"
                            onClick={() => {
                                navigator.clipboard.writeText(sshCmd);
                                toast.success("Đã copy lệnh SSH vào Clipboard!");
                            }}
                        >
                            <CopyIcon className="size-3.5 text-muted-foreground" />
                        </Button>
                    </div>
                )
            }
        },
        {
            id: "resources",
            header: "Tài nguyên (C/R/D)",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {row.original.cpu} vCPU / {row.original.ram} MB / {row.original.disk} GB
                </span>
            )
        },
        {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => {
                const vm = row.original;
                const isRunning = vm.status === 'running';
                const isProcessing = isActionLoading === vm.vm_name || vm.status === 'pending';

                return (
                    <div className="flex items-center gap-2">
                        {isRunning ? (
                            <Button variant="outline" size="icon-sm" disabled={isProcessing} onClick={() => onAction('stop', vm.vm_name)} title="Tắt máy">
                                {isProcessing ? <Loader2Icon className="size-4 animate-spin" /> : <SquareIcon className="size-4 text-orange-500" />}
                            </Button>
                        ) : (
                            <Button variant="outline" size="icon-sm" disabled={isProcessing} onClick={() => onAction('start', vm.vm_name)} title="Bật máy">
                                {isProcessing ? <Loader2Icon className="size-4 animate-spin" /> : <PlayIcon className="size-4 text-green-500" />}
                            </Button>
                        )}
                        <Button variant="outline" size="icon-sm" disabled={!isRunning || isProcessing} onClick={() => onAction('restart', vm.vm_name)} title="Khởi động lại">
                            <RefreshCwIcon className="size-4 text-blue-500" />
                        </Button>
                        <Button variant="outline" size="icon-sm" disabled={isRunning || isProcessing} onClick={() => onConfig(vm)} title="Cấu hình phần cứng">
                            <SettingsIcon className="size-4 text-gray-500" />
                        </Button>
                        <Button variant="outline" size="icon-sm" className="hover:bg-destructive hover:text-destructive-foreground" disabled={isProcessing} onClick={() => {
                            if(confirm(`Bạn có chắc chắn muốn XÓA vĩnh viễn máy ảo ${vm.vm_name}?`)) onAction('delete', vm.vm_name);
                        }} title="Xóa máy">
                            <Trash2Icon className="size-4" />
                        </Button>
                    </div>
                )
            }
        }
    ], [isActionLoading, onAction, onConfig]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[900px]">
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(h => (
                                    <TableHead key={h.id} className="whitespace-nowrap">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className="py-2.5">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">Không có máy ảo nào.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}