import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const deals = [
  {
    id: 1,
    name: "Enterprise Platform License",
    account: "Tata Steel Ltd",
    value: "₹45,00,000",
    stage: "Negotiation",
    owner: "Priya S",
    initials: "PS",
    probability: 80,
  },
  {
    id: 2,
    name: "Cloud Migration Services",
    account: "Reliance Industries",
    value: "₹28,50,000",
    stage: "Proposal",
    owner: "Rahul M",
    initials: "RM",
    probability: 60,
  },
  {
    id: 3,
    name: "Annual Support Contract",
    account: "Infosys Ltd",
    value: "₹12,00,000",
    stage: "Qualified",
    owner: "Anjali K",
    initials: "AK",
    probability: 40,
  },
  {
    id: 4,
    name: "API Integration Package",
    account: "HDFC Bank",
    value: "₹18,75,000",
    stage: "Closed Won",
    owner: "Vikram D",
    initials: "VD",
    probability: 100,
  },
  {
    id: 5,
    name: "Data Analytics Suite",
    account: "Mahindra Group",
    value: "₹32,00,000",
    stage: "Proposal",
    owner: "Priya S",
    initials: "PS",
    probability: 55,
  },
];

const getStageColor = (stage: string) => {
  switch (stage) {
    case "Closed Won":
      return "bg-success/10 text-success border-success/20";
    case "Negotiation":
      return "bg-accent/10 text-accent border-accent/20";
    case "Proposal":
      return "bg-info/10 text-info border-info/20";
    case "Qualified":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export function RecentDeals() {
  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Recent Opportunities
          </h3>
          <p className="text-sm text-muted-foreground">
            Top deals requiring attention
          </p>
        </div>
        <a
          href="/opportunities"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </a>
      </div>
      <div className="space-y-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {deal.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  {deal.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {deal.account}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-foreground">{deal.value}</p>
                <p className="text-xs text-muted-foreground">
                  {deal.probability}% probability
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn("font-medium", getStageColor(deal.stage))}
              >
                {deal.stage}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
