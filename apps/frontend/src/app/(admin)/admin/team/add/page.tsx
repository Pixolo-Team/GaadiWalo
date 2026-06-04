"use client";

// REACT //
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// TYPES //
import type { DropdownOptionData } from "@/types/dropdown";
import type { CreateSalespersonRequestData } from "@/types/admin";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import Dropdown from "@/components/common/Dropdown";
import { Button } from "@/components/ui/button";
import ContentInsightIdeaTrivia from "@/components/icons/neevo-icons/ContentInsightIdeaTrivia";

// API SERVICES //
import {
  createSalespersonRequest,
  getAdminTeamOptionsRequest,
} from "@/services/api/admin-team.api.service";

// MODULES //
import { ROUTES } from "@/constants/routes";

// OTHERS //
import { toast } from "sonner";

const initialFields: CreateSalespersonRequestData = {
  branchId: "",
  email: "",
  fullName: "",
  phone: "",
  roleId: "",
};

/** Add Team Member Page */
export default function AddTeamMemberPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const [fields, setFields] =
    useState<CreateSalespersonRequestData>(initialFields);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [branchOptions, setBranchOptions] = useState<DropdownOptionData[]>([]);
  const [roleOptions, setRoleOptions] = useState<DropdownOptionData[]>([]);

  // Helper Functions
  /**
   * Updates a single field in the form state.
   */
  const updateField = (
    key: keyof CreateSalespersonRequestData,
    value: string,
  ): void => {
    setFields((previousFieldsItem) => ({
      ...previousFieldsItem,
      [key]: value,
    }));
  };

  const canSubmit =
    fields.fullName.trim().length > 0 &&
    fields.phone.trim().length > 0 &&
    fields.email.trim().length > 0 &&
    fields.branchId.length > 0 &&
    fields.roleId.length > 0 &&
    !isSubmitting;

  /**
   * Fetches branch and role options for dropdowns.
   */
  const fetchOptionsService = (): void => {
    getAdminTeamOptionsRequest()
      .then((response) => {
        if (response.status_code === 200 && response.data) {
          setBranchOptions(
            response.data.branches.map((branchItem) => ({
              label: branchItem.name,
              value: branchItem.id,
            })),
          );
          setRoleOptions(
            response.data.roles.map((roleItem) => ({
              label: roleItem.name,
              value: roleItem.id,
            })),
          );
        }
      })
      .catch(() => {
        toast.error("Unable to load form options right now.");
      });
  };

  /**
   * Handles the create team member action.
   */
  const handleCreateMember = (): void => {
    if (!canSubmit) return;

    setIsSubmitting(true);

    createSalespersonRequest(fields)
      .then((response) => {
        if (
          response.status_code === 201 ||
          response.status_code === 200
        ) {
          toast.success(
            `${response.data?.salesperson.fullName ?? "Member"} added. Temp password: ${response.data?.tempPassword ?? "—"}`,
          );
          router.push(ROUTES.admin.team);
        } else {
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        toast.error("Unable to add team member. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  /**
   * Resets all fields to initial values.
   */
  const handleCancel = (): void => {
    setFields(initialFields);
  };

  // Use Effects
  useEffect(() => {
    fetchOptionsService();
  }, []);

  return (
    <section className="bg-n-100 h-full">
      {/* Add team member page shell */}
      <div className="flex h-full flex-col">
        {/* Header */}
        <Header title="Add Team Member" />

        {/* Scroll content */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">
            {/* Info banner */}
            <div className="flex items-start gap-4 rounded-[14px] bg-blue-100 px-[18px] py-4">
              <ContentInsightIdeaTrivia
                primaryColor="var(--color-blue-700)"
                className="mt-0.5 size-5 shrink-0"
              />
              <p className="font-secondary text-sm font-medium leading-normal text-blue-800">
                Fill in all fields to create a salesperson account. A temporary
                password will be generated automatically.
              </p>
            </div>

            {/* Form sections */}
            <div className="flex flex-col gap-[18px]">
              {/* Personal info */}
              <div className="flex flex-col gap-3">
                <p className="font-secondary text-n-600 text-xs font-semibold uppercase leading-normal tracking-wide">
                  Personal Info
                </p>

                <div className="flex flex-col gap-4">
                  <InputBox
                    label="FULL NAME"
                    isRequired
                    placeholder="e.g. Rahul Kumar"
                    value={fields.fullName}
                    onChange={(value) => updateField("fullName", value)}
                  />

                  <InputBox
                    label="PHONE NUMBER"
                    isRequired
                    placeholder="e.g. 9876543210"
                    type="tel"
                    value={fields.phone}
                    onChange={(value) => updateField("phone", value)}
                  />

                  <InputBox
                    label="EMAIL"
                    isRequired
                    placeholder="email@example.com"
                    type="email"
                    value={fields.email}
                    onChange={(value) => updateField("email", value)}
                  />
                </div>
              </div>

              <div className="bg-n-200 h-px w-full" />

              {/* Role & Branch */}
              <div className="flex flex-col gap-3">
                <p className="font-secondary text-n-600 text-xs font-semibold uppercase leading-normal tracking-wide">
                  Role & Branch
                </p>

                <div className="flex flex-col gap-4">
                  <Dropdown
                    label="BRANCH"
                    isRequired
                    title="Select Branch"
                    options={branchOptions}
                    selectedOption={fields.branchId}
                    onChange={(value) => updateField("branchId", value)}
                  />

                  <Dropdown
                    label="ROLE"
                    isRequired
                    title="Select Role"
                    options={roleOptions}
                    selectedOption={fields.roleId}
                    onChange={(value) => updateField("roleId", value)}
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
              disabled={!canSubmit}
              onClick={handleCreateMember}
            >
              {isSubmitting ? "Adding..." : "Add Team Member"}
            </Button>

            <Button type="button" variant="secondary" onClick={handleCancel}>
              Clear
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
