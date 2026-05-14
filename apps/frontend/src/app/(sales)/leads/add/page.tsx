"use client";

// REACT //
import { useState } from "react";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import Dropdown from "@/components/common/Dropdown";
import ContentInsightIdeaTrivia from "@/components/icons/neevo-icons/ContentInsightIdeaTrivia";
import { Button } from "@/components/ui/button";

// DATA //
import {
  salesAddLeadBudgetOptions,
  salesAddLeadCarBrandOptions,
  salesAddLeadCarModelOptions,
  salesAddLeadSourceOptions,
  salesAddLeadVariantOptions,
} from "@/data/sales";

/**
 * Renders the add new lead screen.
 */
export default function AddLeadPage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [variant, setVariant] = useState("");
  const [budget, setBudget] = useState("");
  const [initialNote, setInitialNote] = useState("");

  // Helper Functions
  const canCreateLead =
    fullName.trim().length > 0 && phoneNumber.trim().length > 0;

  const handleCreateLead = (): void => {
    if (!canCreateLead) {
      return;
    }
  };

  const handleCancel = (): void => {
    setFullName("");
    setPhoneNumber("");
    setEmail("");
    setSource("");
    setCarBrand("");
    setCarModel("");
    setVariant("");
    setBudget("");
    setInitialNote("");
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
                  <InputBox
                    label="FULL NAME *"
                    placeholder="e.g. Rahul Kumar"
                    value={fullName}
                    onChange={setFullName}
                  />

                  <InputBox
                    label="PHONE NUMBER *"
                    placeholder="+91 XXXXXXXXXX"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                  />

                  <InputBox
                    label="EMAIL (OPTIONAL)"
                    placeholder="email@example.com"
                    type="email"
                    value={email}
                    onChange={setEmail}
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

                <Dropdown
                  label="SOURCE"
                  required
                  title="Select Source"
                  options={salesAddLeadSourceOptions}
                  selectedOption={source}
                  onChange={setSource}
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
                  <Dropdown
                    label="CAR BRAND"
                    required
                    title="Select Brand"
                    options={salesAddLeadCarBrandOptions}
                    selectedOption={carBrand}
                    onChange={setCarBrand}
                  />

                  <Dropdown
                    label="MODEL"
                    title="Select Model"
                    options={salesAddLeadCarModelOptions}
                    selectedOption={carModel}
                    onChange={setCarModel}
                  />

                  <Dropdown
                    label="VARIANT / CATEGORY"
                    title="Select"
                    options={salesAddLeadVariantOptions}
                    selectedOption={variant}
                    onChange={setVariant}
                  />

                  <Dropdown
                    label="BUDGET RANGE"
                    title="Select Budget"
                    options={salesAddLeadBudgetOptions}
                    selectedOption={budget}
                    onChange={setBudget}
                  />

                  {/* Initial note field */}
                  <div className="flex flex-col gap-1">
                    <p className="font-secondary text-n-600 text-xs leading-normal font-medium tracking-wide uppercase">
                      INITIAL NOTE (OPTIONAL)
                    </p>

                    <textarea
                      value={initialNote}
                      onChange={(event) => setInitialNote(event.target.value)}
                      placeholder="Any additional info about this lead..."
                      className="border-n-200 bg-n-50 font-secondary text-n-800 placeholder:text-n-400 min-h-[120px] w-full resize-none rounded-lg border p-3.5 text-base leading-normal outline-none"
                    />
                  </div>
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
