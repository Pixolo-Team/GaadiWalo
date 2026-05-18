// REACT //
import type { ReactNode } from "react";

// COMPONENTS //
import CalendarMark from "@/components/icons/neevo-icons/CalendarMark";
import LineArrowReloadHorizontal2 from "@/components/icons/neevo-icons/LineArrowReloadHorizontal2";
import Phone from "@/components/icons/neevo-icons/Phone";
import UserAddPlus from "@/components/icons/neevo-icons/UserAddPlus";
import WhatsappLogo from "@/components/icons/neevo-icons/WhatsappLogo";

interface LeadActivityData {
  description: string;
  key: string;
  meta: string;
  tone: "amber" | "blue" | "green" | "neutral" | "purple";
  type: "calendar" | "call" | "lead" | "status" | "whatsapp";
}

interface ActivityTabPropsData {
  activities: ReadonlyArray<LeadActivityData>;
}

const activityToneClassNameData = {
  amber: {
    background: "bg-amber-100",
    color: "var(--color-amber-500)",
  },
  blue: {
    background: "bg-blue-50",
    color: "var(--color-blue-600)",
  },
  green: {
    background: "bg-green-100",
    color: "var(--color-green-600)",
  },
  neutral: {
    background: "bg-n-100",
    color: "var(--color-n-600)",
  },
  purple: {
    background: "bg-purple-100",
    color: "var(--color-purple-600)",
  },
} as const;

/** Lead Activity Tab */
export function ActivityTab({ activities }: ActivityTabPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  /**
   * Returns the icon for a lead activity item.
   */
  const getActivityIcon = (activityItem: LeadActivityData): ReactNode => {
    const iconColor = activityToneClassNameData[activityItem.tone].color;

    if (activityItem.type === "call") {
      return <Phone primaryColor={iconColor} className="size-4" />;
    }

    if (activityItem.type === "whatsapp") {
      return <WhatsappLogo primaryColor={iconColor} className="size-4" />;
    }

    if (activityItem.type === "calendar") {
      return <CalendarMark primaryColor={iconColor} className="size-4" />;
    }

    if (activityItem.type === "status") {
      return (
        <LineArrowReloadHorizontal2
          primaryColor={iconColor}
          className="size-4"
        />
      );
    }

    return <UserAddPlus primaryColor={iconColor} className="size-4" />;
  };

  // Use Effects

  return (
    <div className="bg-n-50 rounded-[14px] p-5">
      {/* Activity timeline */}
      <div className="flex flex-col">
        {activities.map((activityItem, activityIndex) => {
          const toneClassName = activityToneClassNameData[activityItem.tone];
          const isLastItem = activityIndex === activities.length - 1;

          return (
            /* Activity item */
            <div key={activityItem.key} className="flex gap-3.5">
              {/* Timeline marker */}
              <div className="flex w-8 flex-col items-center">
                <span
                  className={`flex size-8 items-center justify-center rounded-full ${toneClassName.background}`}
                >
                  {getActivityIcon(activityItem)}
                </span>

                {/* Timeline line */}
                {!isLastItem ? <span className="bg-n-200 w-px flex-1" /> : null}
              </div>

              {/* Activity copy */}
              <div className="flex min-w-0 flex-1 flex-col gap-1 pb-7">
                <p className="font-secondary text-n-800 text-sm leading-[1.4]">
                  {activityItem.description}
                </p>
                <p className="font-secondary text-n-500 text-xs font-medium">
                  {activityItem.meta}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
