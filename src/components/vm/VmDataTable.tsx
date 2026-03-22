import * as React from "react"
import { type ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayIcon, SquareIcon, ServerIcon, RefreshCwIcon, SettingsIcon, Trash2Icon, Loader2Icon } from "lucide-react"

export type VirtualMachine = {
    _id: string
    vm_name: string
    ip_address?: string
    cpu: number
    ram: number
    disk: number
    status: string
}

interface VmDataTableProps {
    data: VirtualMachine[];
    onAction: (action: 'start' | 'stop' | 'restart' | 'delete', vmName: string) => void;
    onConfig: (vm: VirtualMachine) => void;
    isActionLoading: string | null; // Chứa tên VM đang được thao tác để hiện icon loading
}

export function VmDataTable({ data, onAction, onConfig, isActionLoading }: VmDataTableProps) {

    // Khai báo columns BÊN TRONG component để dùng được hàm onAction
    const columns: ColumnDef<VirtualMachine>[] = React.useMemo(() => [
        {
            accessorKey: "vm_name",
            header: "Tên máy ảo",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 font-medium">
                    <ServerIcon className="size-4 text-muted-foreground" />
                    {row.getValue("vm_name")}
                </div>
            ),
        },
        {
            accessorKey: "ip_address",
            header: "IP nội bộ",
            cell: ({ row }) => <div>{row.getValue("ip_address") || "---"}</div>,
        },
        {
            accessorKey: "cpu",
            header: "CPU",
            cell: ({ row }) => <div>{row.getValue("cpu")} vCPU</div>,
        },
        {
            accessorKey: "ram",
            header: "RAM",
            cell: ({ row }) => <div>{row.getValue("ram")} MB</div>,
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                if (status === 'running') {
                    return <Badge className="bg-green-500 hover:bg-green-600"><PlayIcon className="mr-1 size-3 fill-current" /> Running</Badge>
                }
                if (status === 'stopped') {
                    return <Badge variant="secondary"><SquareIcon className="mr-1 size-3 fill-current" /> Stopped</Badge>
                }
                if (status === 'pending') {
                    return <Badge variant="outline" className="text-blue-500 border-blue-500"><Loader2Icon className="mr-1 size-3 animate-spin" /> Pending</Badge>
                }
                return <Badge variant="destructive">{status}</Badge>
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const vm = row.original;
                const status = vm.status;
                const vmName = vm.vm_name;

                // LOGIC DISABLED NHƯ BẠN YÊU CẦU:
                const isRunning = status === 'running';
                const isStopped = status === 'stopped';
                const isPending = status === 'pending';
                const isBusy = isActionLoading === vmName; // Đang gọi API cho VM này

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline" size="icon" title="Khởi động"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            disabled={isRunning || isPending || isBusy}
                            onClick={() => onAction('start', vmName)}
                        >
                            {isBusy && !isRunning ? <Loader2Icon className="size-4 animate-spin" /> : <PlayIcon className="size-4" />}
                        </Button>

                        <Button
                            variant="outline" size="icon" title="Tắt máy"
                            className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            disabled={isStopped || isPending || isBusy}
                            onClick={() => onAction('stop', vmName)}
                        >
                            <SquareIcon className="size-4" />
                        </Button>

                        <Button
                            variant="outline" size="icon" title="Khởi động lại"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            disabled={isStopped || isPending || isBusy}
                            onClick={() => onAction('restart', vmName)}
                        >
                            <RefreshCwIcon className="size-4" />
                        </Button>

                        <Button
                            variant="outline" size="icon" title="Cấu hình"
                            className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            disabled={isRunning || isPending || isBusy}
                            onClick={() => onConfig(vm)} // Thêm sự kiện onClick gọi hàm onConfig
                        >
                            <SettingsIcon className="size-4" />
                        </Button>

                        {/* Nút Xóa */}
                        <Button
                            variant="outline" size="icon" title="Xóa VM"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                            disabled={isPending || isBusy}
                            onClick={() => {
                                if (window.confirm(`Bạn có chắc muốn xóa VM ${vmName} không?`)) onAction('delete', vmName)
                            }}
                        >
                            <Trash2Icon className="size-4" />
                        </Button>
                    </div>
                )
            },
        },
    ], [onAction, isActionLoading]);

    const table = useReactTable({
        data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    })

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id}>
                                {hg.headers.map(h => (
                                    <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className="py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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