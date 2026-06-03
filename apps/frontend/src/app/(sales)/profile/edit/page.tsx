"use client";

// REACT //
import { useEffect, useState } from "react";

// COMPONENTS //
import Dropdown from "@/components/common/Dropdown";
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import { LeadDetailsInfoCard } from "@/components/sales/LeadDetailsInfoCard";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/common/ImageUpload";

// SERVICES //
import {
  getSalesProfileRequest,
  updateSalesProfileRequest,
} from "@/services/api/sales-profile.api.service";

// DATA //
import {
  salesProfileLanguageOptions,
  salesProfileSummaryData,
} from "@/data/sales";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type { SalesProfileData } from "@/types/profile";

// OTHERS //
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

interface EditProfileInputFieldsData {
  email: string;
  fullName: string;
  languagePreference: string;
  phoneNumber: string;
}

/** Edit Profile Page Component */
export default function EditProfilePage() {
  // Define Navigation

  // Define Context
  const { user } = useAuthContext();

  // Define Refs

  // Define States
  const initialEditProfileInputFieldsData: EditProfileInputFieldsData = {
    email: "",
    fullName: "",
    languagePreference: "english",
    phoneNumber: "",
  };

  const [editProfileInputFields, setEditProfileInputFields] =
    useState<EditProfileInputFieldsData>(initialEditProfileInputFieldsData);

  const [salesProfile, setSalesProfile] = useState<SalesProfileData | null>(
    null,
  );
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>("");

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
      value: salesProfile?.userId ?? salesProfileSummaryData.userId,
    },
    {
      isHighlighted: false,
      key: "role",
      label: "Role",
      value: salesProfile?.role ?? salesProfileSummaryData.role,
    },
    {
      isHighlighted: false,
      key: "branch",
      label: "Branch",
      value: salesProfile?.branch ?? salesProfileSummaryData.branch,
    },
    {
      isHighlighted: false,
      key: "joined",
      label: "Joined",
      value:
        (salesProfile?.joinedAt
          ? new Date(salesProfile.joinedAt).toLocaleDateString()
          : "") || salesProfileSummaryData.joined,
    },
  ] as const;

  const canSaveProfile =
    editProfileInputFields.fullName.trim().length > 0 &&
    editProfileInputFields.phoneNumber.trim().length > 0 &&
    !isSubmitting;

  const userCode = user?.userCode ?? user?.userId ?? user?.id ?? "";

  /**
   * Fetches sales profile for edit screen.
   */
  const getSalesProfile = (): void => {
    if (!userCode) {
      setIsProfileLoading(false);
      return;
    }

    /**
     * Call get sales profile API.
     */
    getSalesProfileRequest(userCode)
      .then((response: ApiResponseData<SalesProfileData>) => {
        if (response.status_code === 200 && response.data) {
          // Set sales profile state
          setSalesProfile(response.data);

          // Set editable field state
          setEditProfileInputFields({
            email: response.data.email ?? "",
            fullName: response.data.fullName ?? "",
            languagePreference:
              response.data.languagePreference?.toLowerCase() || "english",
            phoneNumber: response.data.phone ?? "",
          });
        } else {
          setSalesProfile(null);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to load profile right now.");
      })
      .finally(() => {
        // Set profile loading false
        setIsProfileLoading(false);
      });
  };

  /**
   * Handles profile save action.
   */
  const handleSaveProfile = (): void => {
    if (!canSaveProfile) {
      return;
    }

    if (!userCode) {
      toast.error("User code is missing. Please login again.");
      return;
    }

    setIsSubmitting(true);

    /**
     * Call update sales profile API.
     */
    updateSalesProfileRequest(userCode, {
      email: editProfileInputFields.email.trim(),
      fullName: editProfileInputFields.fullName.trim(),
      languagePreference: editProfileInputFields.languagePreference.trim(),
      phone: editProfileInputFields.phoneNumber.trim(),
    })
      .then((response: ApiResponseData<SalesProfileData>) => {
        if (response.status_code === 200 && response.data) {
          // Set updated sales profile state
          setSalesProfile(response.data);

          // Success toast
          toast.success(response.message);
        } else {
          // Error toast
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to update profile. Please try again.");
      })
      .finally(() => {
        // Reset submitting state
        setIsSubmitting(false);
      });
  };

  /**
   * Resets edit form fields back to initial values.
   */
  const handleCancelProfileEdit = (): void => {
    setEditProfileInputFields({
      email: salesProfile?.email ?? "",
      fullName: salesProfile?.fullName ?? "",
      languagePreference:
        salesProfile?.languagePreference?.toLowerCase() || "english",
      phoneNumber: salesProfile?.phone ?? "",
    });
  };

  // Use Effects
  useEffect(() => {
    getSalesProfile();
  }, [userCode]);

  if (isProfileLoading) {
    return (
      <section className="bg-n-100 h-full">
        <div className="flex h-full items-center justify-center">
          <p className="font-secondary text-n-600 text-sm">
            Loading profile...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-n-100 h-full">
      {/* Edit profile page shell */}
      <div className="flex h-full flex-col">
        {/* Edit profile header */}
        <Header title="Edit Profile" />

        {/* Edit profile scroll content */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {/* Content stack */}
          <div className="flex flex-col gap-6">
            {/* Profile Photo */}
            <ImageUpload
              imageUrl={profileImage}
              avatarLabel={
                salesProfile?.fullName
                  ?.split(" ")
                  .slice(0, 2)
                  .map((wordItem) => wordItem.charAt(0).toUpperCase())
                  .join("") ?? salesProfileSummaryData.avatarLabel
              }
              onImageCropped={(croppedBase64Image: string) => {
                setProfileImage(croppedBase64Image);
              }}
            />

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
