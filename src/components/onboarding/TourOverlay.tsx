import { useEffect, useState, useCallback } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipPosition {
  top: number;
  left: number;
}

export function TourOverlay() {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTour, endTour } = useOnboarding();
  const [targetPosition, setTargetPosition] = useState<Position | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentTourStep = steps[currentStep];

  const calculatePositions = useCallback(() => {
    if (!currentTourStep) return;

    const targetElement = document.querySelector(currentTourStep.target);
    
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const padding = currentTourStep.spotlightPadding ?? 8;
      
      setTargetPosition({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      // Calculate tooltip position based on placement
      const tooltipWidth = 320;
      const tooltipHeight = 200;
      const gap = 16;
      
      let newTop = 0;
      let newLeft = 0;

      switch (currentTourStep.placement) {
        case "right":
          newTop = rect.top + rect.height / 2 - tooltipHeight / 2;
          newLeft = rect.right + gap;
          break;
        case "left":
          newTop = rect.top + rect.height / 2 - tooltipHeight / 2;
          newLeft = rect.left - tooltipWidth - gap;
          break;
        case "top":
          newTop = rect.top - tooltipHeight - gap;
          newLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case "bottom":
        default:
          newTop = rect.bottom + gap;
          newLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
      }

      // Keep tooltip within viewport
      newTop = Math.max(16, Math.min(newTop, window.innerHeight - tooltipHeight - 16));
      newLeft = Math.max(16, Math.min(newLeft, window.innerWidth - tooltipWidth - 16));

      setTooltipPosition({ top: newTop, left: newLeft });
    } else {
      // If target not found, position tooltip in center
      setTargetPosition(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 160,
      });
    }
  }, [currentTourStep]);

  useEffect(() => {
    if (isActive) {
      setIsTransitioning(true);
      calculatePositions();
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep, calculatePositions]);

  useEffect(() => {
    if (isActive) {
      const handleResize = () => calculatePositions();
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleResize, true);
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleResize, true);
      };
    }
  }, [isActive, calculatePositions]);

  useEffect(() => {
    if (isActive) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") skipTour();
        if (e.key === "ArrowRight") nextStep();
        if (e.key === "ArrowLeft") prevStep();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isActive, nextStep, prevStep, skipTour]);

  if (!isActive || !currentTourStep) return null;

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto">
      {/* Overlay with spotlight cutout */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ transition: "all 0.3s ease-in-out" }}
      >
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetPosition && (
              <rect
                x={targetPosition.left}
                y={targetPosition.top}
                width={targetPosition.width}
                height={targetPosition.height}
                rx="8"
                fill="black"
                style={{ transition: "all 0.3s ease-in-out" }}
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Spotlight ring animation */}
      {targetPosition && (
        <div
          className="absolute border-2 border-primary rounded-lg animate-pulse pointer-events-none"
          style={{
            top: targetPosition.top,
            left: targetPosition.left,
            width: targetPosition.width,
            height: targetPosition.height,
            transition: "all 0.3s ease-in-out",
            boxShadow: "0 0 0 4px rgba(var(--primary), 0.3), 0 0 20px rgba(var(--primary), 0.5)",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className={cn(
          "absolute w-80 bg-card border border-border rounded-xl shadow-2xl p-5 z-[10000]",
          isTransitioning && "opacity-0"
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transition: "all 0.3s ease-in-out, opacity 0.15s ease-in-out",
        }}
      >
        {/* Close button */}
        <button
          onClick={skipTour}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {currentTourStep.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {currentTourStep.content}
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentStep
                  ? "bg-primary w-4"
                  : index < currentStep
                  ? "bg-primary/50"
                  : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTour}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip tour
          </Button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Button size="sm" onClick={nextStep} className="gap-1">
              {isLastStep ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
