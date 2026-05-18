"use client";

// REACT //
import { useState } from "react";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import Dropdown from "@/components/common/Dropdown";
import ContentInsightIdeaTrivia from "@/components/icons/neevo-icons/ContentInsightIdeaTrivia";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// DATA //
import {
  salesAddLeadBudgetOptions,
  salesAddLeadCarBrandOptions,
  salesAddLeadCarModelOptions,
  salesAddLeadSourceOptions,
  salesAddLeadVariantOptions,
} from "@/data/sales";

interface LeadInputFiledData {
  budget: string;
  carBrand: string;
  carModel: string;
  email: string;
  fullName: string;
  initialNote: string;
  phoneNumber: string;
  source: string;
  variant: string;
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
  variant: "",
};

/** Add Lead Page Component */
export default function AddLeadPage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [leadInputFiled, setLeadInputField] = useState<LeadInputFiledData>(
    initialLeadInputFiledData,
  );

  // Helper Functions
  /** Function to Update input Fields */
  const updateLeadInputFiled = (
    field: keyof LeadInputFiledData,
    value: string,
  ): void => {
    setLeadInputField((previousInputField) => ({
      ...previousInputField,
      [field]: value,
    }));
  };

  const canCreateLead =
    leadInputFiled.fullName.trim().length > 0 &&
    leadInputFiled.phoneNumber.trim().length > 0;

  /** Handles the create lead action. */
  const handleCreateLead = (): void => {
    if (!canCreateLead) {
      return;
    }
  };

  /** Function to clear all fields to their initial values */
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
                Fill in at least Name and Phone number to create a lead.
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
                  {/* Full Name Input */}
                  <InputBox
                    label="FULL NAME *"
                    placeholder="e.g. Rahul Kumar"
                    value={leadInputFiled.fullName}
                    onChange={(value) =>
                      updateLeadInputFiled("fullName", value)
                    }
                  />

                  {/* Phone Input */}
                  <InputBox
                    label="PHONE NUMBER *"
                    placeholder="+91 XXXXXXXXXX"
                    value={leadInputFiled.phoneNumber}
                    onChange={(value) =>
                      updateLeadInputFiled("phoneNumber", value)
                    }
                  />

                  {/* Email Input  */}
                  <InputBox
                    label="EMAIL (OPTIONAL)"
                    placeholder="email@example.com"
                    type="email"
                    value={leadInputFiled.email}
                    onChange={(value) => updateLeadInputFiled("email", value)}
                  />
                </div>
              </div>

              {/* Section divider */}
              <div className="bg-n-200 h-px w-full" />

              {/* Lead source section */}
              <div className="flex flex-col gap-3">
                <p className="font-secondary text-n-600 text-xs leading-normal font-semibold tracking-wide uppercase">
                  Lead Source
                </p>

                {/* Source Dropdown */}
                <Dropdown
                  label="SOURCE"
                  required
                  title="Select Source"
                  options={salesAddLeadSourceOptions}
                  selectedOption={leadInputFiled.source}
                  onChange={(value) => updateLeadInputFiled("source", value)}
                />
              </div>

              {/* Section divider */}
              <div className="bg-n-200 h-px w-full" />

              {/* Car details section */}
              <div className="flex flex-col gap-3">
                <p className="font-secondary text-n-600 text-xs leading-normal font-semibold tracking-wide uppercase">
                  Lead Source
                </p>

                {/* Car details fields */}
                <div className="flex flex-col gap-4">
                  {/* Car Brand Dropdown */}
                  <Dropdown
                    label="CAR BRAND"
                    required
                    title="Select Brand"
                    options={salesAddLeadCarBrandOptions}
                    selectedOption={leadInputFiled.carBrand}
                    onChange={(value) =>
                      updateLeadInputFiled("carBrand", value)
                    }
                  />

                  {/* Car Model Dropdown */}
                  <Dropdown
                    label="MODEL"
                    title="Select Model"
                    options={salesAddLeadCarModelOptions}
                    selectedOption={leadInputFiled.carModel}
                    onChange={(value) =>
                      updateLeadInputFiled("carModel", value)
                    }
                  />

                  {/* Car Variant Dropdown */}
                  <Dropdown
                    label="VARIANT / CATEGORY"
                    title="Select"
                    options={salesAddLeadVariantOptions}
                    selectedOption={leadInputFiled.variant}
                    onChange={(value) => updateLeadInputFiled("variant", value)}
                  />

                  {/* Budget Range Dropdown */}
                  <Dropdown
                    label="BUDGET RANGE"
                    title="Select Budget"
                    options={salesAddLeadBudgetOptions}
                    selectedOption={leadInputFiled.budget}
                    onChange={(value) => updateLeadInputFiled("budget", value)}
                  />

                  {/* Optional Textarea Component */}
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
          {/* Action buttons */}
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
