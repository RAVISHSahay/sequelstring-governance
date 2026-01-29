import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export interface TourStep {
  id: string;
  target: string; // CSS selector or data-tour attribute
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
  spotlightPadding?: number;
}

interface OnboardingContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  hasCompletedTour: boolean;
  setHasCompletedTour: (value: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const TOUR_COMPLETED_KEY = "sequelstring_tour_completed";

const defaultSteps: TourStep[] = [
  {
    id: "welcome",
    target: "[data-tour='sidebar-logo']",
    title: "Welcome to SequelString CRM! 🎉",
    content: "Let's take a quick tour to help you get started with your Revenue Governance Platform.",
    placement: "right",
  },
  {
    id: "dashboard",
    target: "[data-tour='nav-dashboard']",
    title: "Dashboard Overview",
    content: "Your command center. View pipeline value, active opportunities, win rates, and key performance metrics at a glance.",
    placement: "right",
  },
  {
    id: "accounts",
    target: "[data-tour='nav-accounts']",
    title: "Account Management",
    content: "Manage your enterprise accounts with multi-level hierarchies, stakeholder mapping, and 360° relationship views.",
    placement: "right",
  },
  {
    id: "opportunities",
    target: "[data-tour='nav-opportunities']",
    title: "Opportunities Pipeline",
    content: "Track deals through configurable sales stages with governance controls, budget validation, and stage-weighted forecasting.",
    placement: "right",
  },
  {
    id: "quotes",
    target: "[data-tour='nav-quotes']",
    title: "Quote Builder (CPQ)",
    content: "Create professional quotes with complex pricing models, discount controls, and approval workflows.",
    placement: "right",
  },
  {
    id: "incentives",
    target: "[data-tour='nav-incentives']",
    title: "Incentive Engine",
    content: "Manage sales targets, commission plans, and payout rules. Link incentives directly to commercial discipline.",
    placement: "right",
  },
  {
    id: "quick-actions",
    target: "[data-tour='quick-actions']",
    title: "Quick Actions",
    content: "Create new leads, accounts, opportunities, or quotes instantly from anywhere in the app.",
    placement: "bottom",
  },
  {
    id: "search",
    target: "[data-tour='global-search']",
    title: "Global Search",
    content: "Quickly find accounts, deals, contacts, and more using the global search.",
    placement: "bottom",
  },
  {
    id: "user-menu",
    target: "[data-tour='user-menu']",
    title: "Your Profile & Settings",
    content: "Access your profile, settings, and sign out from here. You're all set to start using SequelString CRM!",
    placement: "bottom",
  },
];

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTourState] = useState(() => {
    return localStorage.getItem(TOUR_COMPLETED_KEY) === "true";
  });

  const setHasCompletedTour = useCallback((value: boolean) => {
    localStorage.setItem(TOUR_COMPLETED_KEY, String(value));
    setHasCompletedTourState(value);
  }, []);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setHasCompletedTour(true);
  }, [setHasCompletedTour]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setHasCompletedTour(true);
  }, [setHasCompletedTour]);

  const nextStep = useCallback(() => {
    if (currentStep < defaultSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Auto-start tour on first visit
  useEffect(() => {
    if (!hasCompletedTour) {
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedTour, startTour]);

  return (
    <OnboardingContext.Provider
      value={{
        isActive,
        currentStep,
        steps: defaultSteps,
        startTour,
        endTour,
        nextStep,
        prevStep,
        skipTour,
        hasCompletedTour,
        setHasCompletedTour,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
