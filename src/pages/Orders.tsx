import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, MoreHorizontal, Receipt, Package, CheckCircle, Clock, Truck, Eye, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderDetailDialog } from "@/components/dialogs/OrderDetailDialog";
import { toast } from "sonner";

const orders = [
  {
    id: "SO-2025-001",
    account: "Tata Steel Ltd",
    quote: "QT-2025-001",
    value: "₹45,00,000",
    status: "Processing",
    poNumber: "PO-TSL-2025-0456",
    orderDate: "Jan 16, 2025",
    deliveryDate: "Feb 15, 2025",
  },
  {
    id: "SO-2025-002",
    account: "HDFC Bank",
    quote: "QT-2025-004",
    value: "₹18,75,000",
    status: "Delivered",
    poNumber: "PO-HDFC-2025-1234",
    orderDate: "Jan 10, 2025",
    deliveryDate: "Jan 14, 2025",
  },
  {
    id: "SO-2024-189",
    account: "Infosys Ltd",
    quote: "QT-2024-156",
    value: "₹12,00,000",
    status: "Invoiced",
    poNumber: "PO-INF-2024-7890",
    orderDate: "Dec 20, 2024",
    deliveryDate: "Jan 05, 2025",
  },
  {
    id: "SO-2025-003",
    account: "Reliance Industries",
    quote: "QT-2025-002",
    value: "₹28,50,000",
    status: "Pending PO",
    poNumber: "-",
    orderDate: "Jan 15, 2025",
    deliveryDate: "-",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Delivered":
      return { color: "bg-success/10 text-success border-success/20", icon: CheckCircle };
    case "Processing":
      return { color: "bg-info/10 text-info border-info/20", icon: Package };
    case "Invoiced":
      return { color: "bg-primary/10 text-primary border-primary/20", icon: Receipt };
    case "Pending PO":
      return { color: "bg-accent/10 text-accent border-accent/20", icon: Clock };
    case "In Transit":
      return { color: "bg-warning/10 text-warning border-warning/20", icon: Truck };
    default:
      return { color: "bg-muted text-muted-foreground border-border", icon: Receipt };
  }
};

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const handleViewDetails = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleGenerateInvoice = (order: typeof orders[0]) => {
    toast.success("Invoice generated", {
      description: `Invoice for ${order.id} has been created`,
    });
  };

  const handleTrackDelivery = (order: typeof orders[0]) => {
    toast.info("Delivery tracking", {
      description: `Tracking information for ${order.id} will be available shortly`,
    });
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.account.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout title="Sales Orders">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat-card animate-slide-up">
          <p className="text-sm text-muted-foreground mb-1">Open Orders</p>
          <p className="text-2xl font-bold">18</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <p className="text-sm text-muted-foreground mb-1">Pending PO</p>
          <p className="text-2xl font-bold text-accent">6</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm text-muted-foreground mb-1">MTD Revenue</p>
          <p className="text-2xl font-bold text-success">₹72L</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <p className="text-sm text-muted-foreground mb-1">Avg Fulfillment</p>
          <p className="text-2xl font-bold">4.2 days</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border/50 overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="table-header hover:bg-muted/50">
              <TableHead className="w-[130px]">Order ID</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Quote Ref</TableHead>
              <TableHead>PO Number</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <TableRow key={order.id} className="group cursor-pointer hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm font-medium">{order.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{order.account}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">{order.quote}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{order.poNumber}</TableCell>
                  <TableCell className="text-right font-semibold">{order.value}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-medium gap-1", statusConfig.color)}>
                      <StatusIcon className="h-3 w-3" />
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.deliveryDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGenerateInvoice(order)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTrackDelivery(order)}>
                          <Truck className="h-4 w-4 mr-2" />
                          Track Delivery
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <OrderDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        order={selectedOrder}
      />
    </AppLayout>
  );
}
