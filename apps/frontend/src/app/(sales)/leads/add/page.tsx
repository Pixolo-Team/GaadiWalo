"use client";

// REACT //
import { useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import Dropdown from "@/components/common/Dropdown";
import ContentInsightIdeaTrivia from "@/components/icons/neevo-icons/ContentInsightIdeaTrivia";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// SERVICES //
import { createLeadRequest } from "@/services/api/sales-leads.api.service";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type { CreateLeadResponseData } from "@/types/leads";

// UTILS //
import { validatePhoneNumberValue } from "@/utils/validations";

// OTHERS //
import { toast } from "sonner";

const sourceOptions = [
  { label: "CarWale", value: "CarWale" },
  { label: "CarDekho", value: "CarDekho" },
  { label: "Walk In", value: "Walk In" },
  { label: "Referral", value: "Referral" },
] as const;
const carBrandOptions = [
  { label: "Maruti Suzuki", value: "Maruti Suzuki" },
  { label: "Hyundai", value: "Hyundai" },
  { label: "Tata", value: "Tata" },
  { label: "Mahindra", value: "Mahindra" },
] as const;
const carModelOptions = [
  { label: "Swift", value: "Swift" },
  { label: "Baleno", value: "Baleno" },
  { label: "Brezza", value: "Brezza" },
  { label: "WagonR", value: "WagonR" },
] as const;
const budgetOptions = [
  { label: "Under 5 Lakh", value: "Under 5 Lakh" },
  { label: "5 - 8 Lakh", value: "5 - 8 Lakh" },
  { label: "8 - 12 Lakh", value: "8 - 12 Lakh" },
  { label: "12+ Lakh", value: "12+ Lakh" },
] as const;

interface LeadInputFiledData {
  budget: string;
  carBrand: string;
  carModel: string;
  email: string;
  fullName: string;
  initialNote: string;
  phoneNumber: string;
  source: string;
}

const initialLeadInputFiledData: LeadInputFiledData = {
  budget: "",
  carBrand: "",
  carModel: "",
  email: "",
  fullName: "",
  initialNote: "",
  phoneNumber: "",
  source: "",
};

/**
 * Renders lead create form and submits API request.
 */
export default function AddLeadPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const [leadInputFiled, setLeadInputField] = useState<LeadInputFiledData>(
    initialLeadInputFiledData,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper Functions
  /**
   * Updates one create-lead input field.
   */
  const updateLeadInputFiled = (
    field: keyof LeadInputFiledData,
    value: string,
  ): void => {
    setLeadInputField((previousInputFieldItem) => ({
      ...previousInputFieldItem,
      [field]: value,
    }));
  };

  const canCreateLead =
    leadInputFiled.fullName.trim().length > 0 &&
    leadInputFiled.phoneNumber.trim().length > 0 &&
    leadInputFiled.source.trim().length > 0 &&
    !isSubmitting;

  /**
   * Maps local form state to create-lead API payload.
   */
  const createLeadPayload = {
    budget: leadInputFiled.budget || null,
    carBrand: leadInputFiled.carBrand || null,
    carModel: leadInputFiled.carModel || null,
    email: leadInputFiled.email.trim(),
    fullName: leadInputFiled.fullName,
    initialNote: leadInputFiled.initialNote.trim() || undefined,
    phone: leadInputFiled.phoneNumber,
    source: leadInputFiled.source,
  };

  /**
   * Handles the create lead action.
   */
  const handleCreateLead = (): void => {
    if (!canCreateLead) {
      return;
    }

    const phoneNumberValidationMessage = validatePhoneNumberValue(
      leadInputFiled.phoneNumber,
    );

    if (phoneNumberValidationMessage) {
      toast.error(phoneNumberValidationMessage);
      return;
    }

    setIsSubmitting(true);

    /**
     * Call create lead API.
     */
    createLeadRequest(createLeadPayload)
      .then((response: ApiResponseData<CreateLeadResponseData>) => {
        if (response.status_code === 201 && response.data?.lead.id) {
          toast.success(response.message);
          router.push(ROUTES.sales.leadDetails(response.data.lead.id));
        } else {
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        toast.error("Unable to create lead. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  /**
   * Clears all fields to initial values.
   */
  const handleCancel = (): void => {
    setLeadInputField(initialLeadInputFiledData);
  };

  // Use Effects

  return (
    <section className="bg-n-100 h-full">
      {/* Add lead page shell */}
      <div className="flex h-full flex-col">
        {/* Add lead header */}
        <Header title="Add New Lead" />

        {/* Add lead scroll content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Add lead content container */}
          <div className="flex flex-col gap-6 p-6">
            {/* Informational banner */}
            <div className="flex items-start gap-4 rounded-[14px] bg-blue-100 px-[18px] py-4">
              {/* Icon */}
              <ContentInsightIdeaTrivia
                primaryColor="var(--color-blue-700)"
                className="mt-0.5 size-5 shrink-0"
              />
              <p className="font-secondary text-sm leading-normal font-medium text-blue-800">
                Fill in Name, Phone number, and Source to create a lead.
              </p>
            </div>

            {/* Form sections */}
            <div className="flex flex-col gap-[18px]">
              {/* Personal info section */}
              <div className="flex flex-col gap-3">
                <p className="font-secondary text-n-600 text-xs leading-normal font-semibold tracking-wide uppercase">
                  Personal Info
                </p>

                {/* Personal info fields */}
                <div className="flex flex-col gap-4">
                  <InputBox
                    label="FULL NAME *"
                    placeholder="e.g. Rahul Kumar"
                    value={leadInputFiled.fullName}
                    onChange={(value) => updateLeadInputFiled("fullName", value)}
                  />

                  <InputBox
                    label="PHONE NUMBER *"
                    placeholder="+91 XXXXXXXXXX"
                    value={leadInputFiled.phoneNumber}
                    onChange={(value) =>
                      updateLeadInputFiled("phoneNumber", value)
                    }
                  />

                  <InputBox
                    label="EMAIL (OPTIONAL)"
                    placeholder="email@example.com"
                    type="email"
                    value={leadInputFiled.email}
                    onChange={(value) => updateLeadInputFiled("email", value)}
                  />
                </div>
              </div>

              <div className="bg-n-200 h-px w-full" />

              {/* Lead source section */}
              <div className="flex flex-col gap-3">
                <p className="font-secondary text-n-600 text-xs leading-normal font-semibold tracking-wide uppercase">
                  Lead Source
                </p>

                <Dropdown
                  label="SOURCE *"
                  required
                  title="Select Source"
                  options={sourceOptions}
                  selectedOption={leadInputFiled.source}
                  onChange={(value) => updateLeadInputFiled("source", value)}
                />
              </div>

              <div className="bg-n-200 h-px w-full" />

              {/* Car details section */}
              <div className="flex flex-col gap-3">
                <p className="font-secondary text-n-600 text-xs leading-normal font-semibold tracking-wide uppercase">
                  Car Details
                </p>

                <div className="flex flex-col gap-4">
                  <Dropdown
                    label="CAR BRAND"
                    required
                    title="Select Brand"
                    options={carBrandOptions}
                    selectedOption={leadInputFiled.carBrand}
                    onChange={(value) => updateLeadInputFiled("carBrand", value)}
                  />

                  <Dropdown
                    label="MODEL"
                    title="Select Model"
                    options={carModelOptions}
                    selectedOption={leadInputFiled.carModel}
                    onChange={(value) => updateLeadInputFiled("carModel", value)}
                  />

                  <Dropdown
                    label="BUDGET RANGE"
                    title="Select Budget"
                    options={budgetOptions}
                    selectedOption={leadInputFiled.budget}
                    onChange={(value) => updateLeadInputFiled("budget", value)}
                  />

                  <Textarea
                    label="INITIAL NOTE (OPTIONAL)"
                    value={leadInputFiled.initialNote}
                    onChange={(event) =>
                      updateLeadInputFiled("initialNote", event.target.value)
                    }
                    placeholder="Any additional info about this lead..."
                    className="border-n-200 bg-n-50 font-secondary text-n-800 placeholder:text-n-400 min-h-[120px] w-full resize-y rounded-lg border p-3.5 text-base leading-normal outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="border-n-200 bg-n-50 shrink-0 border-t-[1.6px] p-3.5">
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="primary"
              disabled={!canCreateLead}
              onClick={handleCreateLead}
            >
              Create Lead
            </Button>

            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
