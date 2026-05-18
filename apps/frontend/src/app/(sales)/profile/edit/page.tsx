"use client";

// REACT //
import { useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS //
import Dropdown from "@/components/common/Dropdown";
import { Header } from "@/components/common/Header";
import Paperclip1 from "@/components/icons/neevo-icons/Paperclip1";
import { LeadDetailsInfoCard } from "@/components/sales/LeadDetailsInfoCard";
import { Button } from "@/components/ui/button";
import InputBox from "@/components/common/InputBox";

// DATA //
import {
  salesProfileLanguageOptions,
  salesProfileSummaryData,
} from "@/data/sales";

interface EditProfileInputFieldsData {
  email: string;
  fullName: string;
  languagePreference: string;
  phoneNumber: string;
}

/** Edit Profile Page Component */
export default function EditProfilePage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const initialEditProfileInputFieldsData: EditProfileInputFieldsData = {
    email: salesProfileSummaryData.email,
    fullName: salesProfileSummaryData.name,
    languagePreference: salesProfileSummaryData.languagePreference,
    phoneNumber: salesProfileSummaryData.phoneNumber,
  };

  const [editProfileInputFields, setEditProfileInputFields] =
    useState<EditProfileInputFieldsData>(initialEditProfileInputFieldsData);

  // Helper Functions
  /**
   * Updates one edit-profile field while preserving remaining input values.
   */
  const updateEditProfileInputFields = (
    inputFieldKey: keyof EditProfileInputFieldsData,
    inputFieldValue: string,
  ): void => {
    setEditProfileInputFields((previousStateItem) => ({
      ...previousStateItem,
      [inputFieldKey]: inputFieldValue,
    }));
  };

  const editProfileInfoRows = [
    {
      isHighlighted: false,
      key: "user-id",
      label: "User ID",
      value: salesProfileSummaryData.userId,
    },
    {
      isHighlighted: false,
      key: "role",
      label: "Role",
      value: salesProfileSummaryData.role,
    },
    {
      isHighlighted: false,
      key: "branch",
      label: "Branch",
      value: salesProfileSummaryData.branch,
    },
    {
      isHighlighted: false,
      key: "joined",
      label: "Joined",
      value: salesProfileSummaryData.joined,
    },
  ] as const;

  const canSaveProfile =
    editProfileInputFields.fullName.trim().length > 0 &&
    editProfileInputFields.phoneNumber.trim().length > 0;

  /**
   * Handles profile save action.
   */
  const handleSaveProfile = (): void => {
    if (!canSaveProfile) {
      return;
    }
  };

  /**
   * Resets edit form fields back to initial values.
   */
  const handleCancelProfileEdit = (): void => {
    setEditProfileInputFields(initialEditProfileInputFieldsData);
  };

  // Use Effects

  return (
    <section className="bg-n-100 h-full">
      {/* Edit profile page shell */}
      <div className="flex h-full flex-col">
        {/* Edit profile header */}
        <Header title="Edit Profile" />

        {/* Edit profile scroll content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {/* Content stack */}
          <div className="flex flex-col gap-6">
            {/* Avatar and change photo */}
            <div className="flex flex-col items-center gap-1.5">
              {/* Avatar */}
              <div className="flex size-24 items-center justify-center rounded-full border border-blue-300 bg-blue-100">
                <p className="font-primary text-3xl font-semibold text-blue-600">
                  {salesProfileSummaryData.avatarLabel}
                </p>
              </div>

              {/* Change photo action */}
              <Button
                type="button"
                variant="secondary"
                className="border-n-300 bg-n-100 h-auto w-auto gap-2 rounded-[7px] px-[13px] py-[9px] text-xs"
              >
                <Paperclip1
                  primaryColor="var(--color-n-700)"
                  className="size-4"
                />
                Change Photo
              </Button>
            </div>

            {/* Editable form */}
            <div className="flex flex-col gap-4">
              {/* Full name input */}
              <InputBox
                label="FULL NAME"
                placeholder="Full Name"
                value={editProfileInputFields.fullName}
                onChange={(fullNameValue: string) =>
                  updateEditProfileInputFields("fullName", fullNameValue)
                }
              />

              {/* Phone number input */}
              <InputBox
                label="PHONE NUMBER"
                placeholder="Phone Number"
                value={editProfileInputFields.phoneNumber}
                onChange={(phoneNumberValue: string) =>
                  updateEditProfileInputFields("phoneNumber", phoneNumberValue)
                }
              />

              {/* Email input */}
              <InputBox
                label="EMAIL"
                placeholder="Email"
                type="email"
                value={editProfileInputFields.email}
                onChange={(emailValue: string) =>
                  updateEditProfileInputFields("email", emailValue)
                }
              />

              {/* Language preference dropdown */}
              <Dropdown
                label="LANGUAGE PREFERENCE"
                options={salesProfileLanguageOptions}
                selectedOption={editProfileInputFields.languagePreference}
                onChange={(languagePreferenceValue: string) =>
                  updateEditProfileInputFields(
                    "languagePreference",
                    languagePreferenceValue,
                  )
                }
                title="English"
              />
            </div>

            {/* Static profile info */}
            <LeadDetailsInfoCard
              title="Profile Info"
              rows={editProfileInfoRows}
            />
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="border-n-200 bg-n-50 shrink-0 border-t-[1.6px] p-3.5">
          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Save Button */}
            <Button
              type="button"
              variant="primary"
              disabled={!canSaveProfile}
              onClick={handleSaveProfile}
            >
              Save
            </Button>

            {/* Cancel Button */}
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancelProfileEdit}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
