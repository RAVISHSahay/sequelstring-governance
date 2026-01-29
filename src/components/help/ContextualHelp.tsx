import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCenter } from "./HelpCenter";
import { cn } from "@/lib/utils";

interface ContextualHelpProps {
  articleId?: string;
  category?: string;
  tooltip?: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "default";
  className?: string;
}

export function ContextualHelp({
  articleId,
  category,
  tooltip = "Get help",
  size = "sm",
  variant = "ghost",
  className,
}: ContextualHelpProps) {
  const [open, setOpen] = useState(false);

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[size];

  const buttonSize = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }[size];

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size="icon"
              onClick={() => setOpen(true)}
              className={cn(buttonSize, "text-muted-foreground hover:text-foreground", className)}
            >
              <HelpCircle className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <HelpCenter
        open={open}
        onOpenChange={setOpen}
        initialArticleId={articleId}
        initialCategory={category}
      />
    </>
  );
}
