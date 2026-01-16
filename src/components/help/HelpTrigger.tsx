import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCenter } from "./HelpCenter";

export function HelpTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
            >
              <BookOpen className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Help Center</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <HelpCenter open={open} onOpenChange={setOpen} />
    </>
  );
}
