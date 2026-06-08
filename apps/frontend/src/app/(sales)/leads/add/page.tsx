"use client";

// REACT //
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type { DropdownOptionData } from "@/types/dropdown";
import type {
  CreateLeadResponseData,
  LeadCarBrandData,
  LeadSourceData,
  LeadTemperatureData,
} from "@/types/leads";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import Dropdown from "@/components/common/Dropdown";
import ContentInsightIdeaTrivia from "@/components/icons/neevo-icons/ContentInsightIdeaTrivia";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// API SERVICES //
import {
  createLeadRequest,
  getCarBrandsRequest,
  getLeadSourcesRequest,
} from "@/services/api/sales-leads.api.service";

// DATA //
import { salesLeadBudgetOptions } from "@/data/sales";

// UTILS //
import { validatePhoneNumberValue } from "@/utils/validations";

// LIBRARIES //
import { toast } from "sonner";

// MODULES //
import { ROUTES } from "@/constants/routes";

const LEAD_TEMPERATURE_OPTIONS: DropdownOptionData[] = [
  { label: "🔥 Hot", value: "HOT" },
  { label: "☀️ Warm", value: "WARM" },
  { label: "❄️ Cold", value: "COLD" },
];

interface LeadInputFiledData {
  budget: string;
  carBrandId: string;
  carModel: string;
  email: string;
  fullName: string;
  initialNote: string;
  phoneNumber: string;
  referrerName: string;
  referrerPhone: string;
  source: string;
  temperature: string;
}

const initialLeadInputFiledData: LeadInputFiledData = {
  budget: "",
  carBrandId: "",
  carModel: "",
  email: "",
  fullName: "",
  initialNote: "",
  phoneNumber: "",
  referrerName: "",
  referrerPhone: "",
  source: "",
  temperature: "",
};

/** Add Lead Page Component */
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
  const [carBrands, setCarBrands] = useState<LeadCarBrandData[]>([]);
  const [leadSourceOptions, setLeadSourceOptions] = useState<
    DropdownOptionData[]
  >([]);

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

  const selectedCarBrand = carBrands.find(
    (carBrandItem) => carBrandItem.id === leadInputFiled.carBrandId,
  );

  // Car Brands
  const carBrandOptions: DropdownOptionData[] = carBrands.map(
    (carBrandItem) => ({
      label: carBrandItem.name,
      value: carBrandItem.id,
    }),
  );

  // Car Models from specific Brand
  const carModelOptions: DropdownOptionData[] =
    selectedCarBrand?.models.map((carModelItem) => ({
      label: carModelItem,
      value: carModelItem,
    })) ?? [];

  const isReferralSource = leadInputFiled.source.toLowerCase() === "referral";

  /**
   * Maps local form state to create-lead API payload.
   */
  const createLeadPayload = {
    budget: leadInputFiled.budget || null,
    carBrand: selectedCarBrand?.name ?? null,
    carModel: leadInputFiled.carModel || null,
    email: leadInputFiled.email.trim(),
    fullName: leadInputFiled.fullName,
    initialNote: leadInputFiled.initialNote.trim() || undefined,
    phone: leadInputFiled.phoneNumber,
    referrerName: isReferralSource
      ? leadInputFiled.referrerName.trim() || null
      : null,
    referrerPhone: isReferralSource
      ? leadInputFiled.referrerPhone.trim() || null
      : null,
    source: leadInputFiled.source,
    temperature:
      (leadInputFiled.temperature as LeadTemperatureData) || null,
  };

  /**
   * Handles car brand selection and model reset.
   */
  const handleCarBrandChange = (carBrandId: string): void => {
    setLeadInputField((previousInputFieldItem) => ({
      ...previousInputFieldItem,
      carBrandId,
      carModel: "",
    }));
  };

  /**
   * Fetches all car brands for add-lead dropdown.
   */
  const getAllCarBrands = (): void => {
    /**
     * Call get car brands API.
     */
    getCarBrandsRequest()
      .then((response: ApiResponseData<LeadCarBrandData[]>) => {
        if (response.status_code === 200) {
          // Set all car brands state
          setCarBrands(response.data ?? []);
        } else {
          // Reset car brands state
          setCarBrands([]);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to load car brands right now.");

        // Reset car brands state
        setCarBrands([]);
      });
  };

  /**
   * Fetches all lead sources for source dropdown.
   */
  const getAllLeadSources = (): void => {
    /**
     * Call get lead sources API.
     */
    getLeadSourcesRequest()
      .then((response: ApiResponseData<LeadSourceData[]>) => {
        if (response.status_code === 200) {
          const sourceOptions = (response.data ?? []).map((leadSourceItem) => ({
            label: leadSourceItem.name,
            value: leadSourceItem.name,
          }));

          // Set Lead Source state
          setLeadSourceOptions(sourceOptions);
        } else {
          // Reset lead source options state
          setLeadSourceOptions([]);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to load lead sources right now.");

        // Reset lead source options state
        setLeadSourceOptions([]);
      });
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
     * Call create lead API
     */
    createLeadRequest(createLeadPayload)
      .then((response: ApiResponseData<CreateLeadResponseData>) => {
        if (response.status_code === 201 && response.data?.lead.id) {
          // Success toast
          toast.success(response.message);

          // Navigate to lead details page
          router.push(ROUTES.sales.leadDetails(response.data.lead.id));
        } else {
          // Error toast
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to create lead. Please try again.");
      })
      .finally(() => {
        // Reset submitting state
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
  useEffect(() => {
    /** Get all Car Brands */
    getAllCarBrands();

    /** Get all lead sources */
    getAllLeadSources();
  }, []);

  return (
    <section className="bg-n-100 h-full">
      {/* Add lead page shell */}
      <div className="flex h-full flex-col">
        {/* Add lead header */}
        <Header title="Add New Lead" />

        {/* Add lead scroll content */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
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
                Fields marked with{" "}
                <span className="text-red-500">*</span> are required. Fill in
                Name, Phone, and Source to enable the Create button.
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
                    label="FULL NAME"
                    isRequired
                    placeholder="e.g. Rahul Kumar"
                    value={leadInputFiled.fullName}
                    onChange={(value) =>
                      updateLeadInputFiled("fullName", value)
                    }
                  />

                  <InputBox
                    label="PHONE NUMBER"
                    isRequired
                    placeholder="e.g. 9876543210"
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
                  label="SOURCE"
                  isRequired
                  title="Select Source"
                  options={leadSourceOptions}
                  selectedOption={leadInputFiled.source}
                  onChange={(value) => updateLeadInputFiled("source", value)}
                />

                {/* Referrer fields — shown only when source is Referral */}
                {isReferralSource ? (
                  <div className="flex flex-col gap-4">
                    <InputBox
                      label="REFERRER NAME"
                      placeholder="e.g. Suresh Mehta"
                      value={leadInputFiled.referrerName}
                      onChange={(value) =>
                        updateLeadInputFiled("referrerName", value)
                      }
                    />
                    <InputBox
                      label="REFERRER PHONE"
                      placeholder="e.g. 9876543210"
                      type="tel"
                      value={leadInputFiled.referrerPhone}
                      onChange={(value) =>
                        updateLeadInputFiled("referrerPhone", value)
                      }
                    />
                  </div>
                ) : null}
              </div>

              <div className="bg-n-200 h-px w-full" />

              {/* Lead temperature section */}
              <div className="flex flex-col gap-3">
                <p className="font-secondary text-n-600 text-xs leading-normal font-semibold tracking-wide uppercase">
                  Lead Temperature
                </p>

                <Dropdown
                  label="TEMPERATURE"
                  title="Select Temperature"
                  options={LEAD_TEMPERATURE_OPTIONS}
                  selectedOption={leadInputFiled.temperature}
                  onChange={(value) =>
                    updateLeadInputFiled("temperature", value)
                  }
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
                    isRequired
                    title="Select Brand"
                    options={carBrandOptions}
                    selectedOption={leadInputFiled.carBrandId}
                    onChange={handleCarBrandChange}
                  />

                  <Dropdown
                    label="MODEL"
                    title="Select Model"
                    options={carModelOptions}
                    selectedOption={leadInputFiled.carModel}
                    onChange={(value) =>
                      updateLeadInputFiled("carModel", value)
                    }
                  />

                  <Dropdown
                    label="BUDGET RANGE"
                    title="Select Budget"
                    options={salesLeadBudgetOptions}
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
                    className="min-h-[120px] w-full resize-y"
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
