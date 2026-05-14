"use client";

// REACT //
import { useState } from "react";

// COMPONENTS //
import Dropdown from "@/components/common/Dropdown";
import { Header } from "@/components/common/Header";
import AttachFileAdd from "@/components/icons/neevo-icons/AttachFileAdd";
import { Button } from "@/components/ui/button";
import InputBox from "@/components/common/InputBox";

// DATA //
import {
  salesProfileLanguageOptions,
  salesProfileSummaryData,
} from "@/data/sales";

/**
 * Renders the edit profile screen.
 */
export default function EditProfilePage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [fullName, setFullName] = useState("Rahul Sharma");
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
  const [email, setEmail] = useState("rahul.sharma@autolead.in");
  const [languagePreference, setLanguagePreference] = useState(
    salesProfileLanguageOptions[0].value,
  );

  // Helper Functions

  // Use Effects

  return (
    <section className="h-full bg-n-100">
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
              <div className="border-blue-300 bg-blue-100 flex size-24 items-center justify-center rounded-full border">
                <p className="font-primary text-blue-600 text-3xl font-semibold">
                  {salesProfileSummaryData.avatarLabel}
                </p>
              </div>

              {/* Change photo action */}
              <Button
                type="button"
                variant="secondary"
                className="h-auto w-auto gap-2 rounded-[7px] border-n-300 bg-n-100 px-[13px] py-[9px] text-xs"
              >
                <AttachFileAdd
                  primaryColor="var(--color-n-700)"
                  className="size-4"
                />
                Change Photo
              </Button>
            </div>

            {/* Editable form */}
            <div className="flex flex-col gap-4">
              <InputBox
                label="FULL NAME"
                placeholder="Full Name"
                value={fullName}
                onChange={setFullName}
              />

              <InputBox
                label="PHONE NUMBER"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={setPhoneNumber}
              />

              <InputBox
                label="EMAIL"
                placeholder="Email"
                type="email"
                value={email}
                onChange={setEmail}
              />

              <Dropdown
                label="LANGUAGE PREFERENCE"
                options={salesProfileLanguageOptions}
                selectedOption={languagePreference}
                onChange={setLanguagePreference}
                title="English"
              />
            </div>

            {/* Static profile info */}
            <div className="flex flex-col gap-1.5">
              <p className="font-secondary text-n-600 text-xs font-medium tracking-wide uppercase">
                EMAIL
              </p>

              {/* Info card */}
              <div className="bg-n-50 rounded-[14px] px-5 py-5">
                {/* Rows */}
                <div className="flex flex-col gap-3">
                  {/* User id row */}
                  <div className="flex items-center justify-between">
                    <p className="font-secondary text-n-700 text-sm">User ID</p>
                    <p className="font-secondary text-n-800 text-sm font-medium">SP001</p>
                  </div>

                  {/* Divider */}
                  <div className="bg-n-200 h-px w-full" />

                  {/* Role row */}
                  <div className="flex items-center justify-between">
                    <p className="font-secondary text-n-700 text-sm">Role</p>
                    <p className="font-secondary text-n-800 text-sm font-medium">Sales Executive</p>
                  </div>

                  {/* Divider */}
                  <div className="bg-n-200 h-px w-full" />

                  {/* Branch row */}
                  <div className="flex items-center justify-between">
                    <p className="font-secondary text-n-700 text-sm">Branch</p>
                    <p className="font-secondary text-n-800 text-sm font-medium">Mumbai - Andheri</p>
                  </div>

                  {/* Divider */}
                  <div className="bg-n-200 h-px w-full" />

                  {/* Joined row */}
                  <div className="flex items-center justify-between">
                    <p className="font-secondary text-n-700 text-sm">Joined</p>
                    <p className="font-secondary text-n-800 text-sm font-medium">Jan 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
