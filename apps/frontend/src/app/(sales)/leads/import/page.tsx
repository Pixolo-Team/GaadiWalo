"use client";

// REACT //
import { useRef, useState } from "react";

// LIBRARIES //
import Link from "next/link";

// COMPONENTS //
import Dropdown from "@/components/common/Dropdown";
import { Header } from "@/components/common/Header";
import AddTag from "@/components/icons/neevo-icons/AddTag";
import AttachFileAdd from "@/components/icons/neevo-icons/AttachFileAdd";
import DownloadTray from "@/components/icons/neevo-icons/DownloadTray";

// DATA //
import {
  salesImportExpectedColumns,
  salesImportLeadSourceTagOptions,
} from "@/data/sales";

/** Import Leads Page Component */
export default function ImportLeadsPage() {
  // Define Navigation

  // Define Context

  // Define Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Define States
  const [sourceTag, setSourceTag] = useState<string>(
    salesImportLeadSourceTagOptions[0].value,
  );

  // Helper Functions
  const handleUploadBoxClick = (): void => {
    // Open native file picker
    fileInputRef.current?.click();
  };

  const handleFileSelection = (): void => {
    // File parsing will be wired with backend import flow
  };

  // Use Effects

  return (
    <section className="bg-n-100 h-full">
      {/* Import leads page shell */}
      <div className="flex h-full flex-col">
        {/* Import leads header */}
        <Header title="Import from Excel" />

        {/* Import leads scroll content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Content container */}
          <div className="flex flex-col gap-6 p-6">
            {/* Step indicator */}
            <div className="flex flex-col items-center gap-1.5 pt-3 pb-0.5">
              {/* Steps bars */}
              <div className="flex items-center justify-center gap-1">
                <span className="h-1 w-[22px] rounded-sm bg-blue-600" />
                <span className="bg-n-200 h-1 w-[22px] rounded-sm" />
                <span className="bg-n-200 h-1 w-[22px] rounded-sm" />
              </div>

              {/* Step title */}
              <p className="font-primary text-n-800 text-base font-semibold">
                Upload Your File
              </p>

              {/* Step subtitle */}
              <p className="font-secondary text-n-600 text-xs font-normal">
                Supported: .xlsx, .xls, .csv
              </p>
            </div>

            {/* Source selector card */}
            <div className="flex flex-col gap-3 rounded-[14px] border border-blue-300 bg-blue-50 p-[25px]">
              {/* Source selector heading */}
              <div className="flex items-center gap-2">
                <AddTag
                  primaryColor="var(--color-blue-600)"
                  className="size-5"
                />
                <p className="font-secondary text-sm font-semibold text-blue-800">
                  Where is this data from?
                </p>
              </div>

              {/* Source selector description */}
              <p className="font-secondary text-n-600 text-xs font-normal">
                Optional - tag all leads in this file with a source
              </p>

              {/* Source selector dropdown */}
              <Dropdown
                title="Skip / Mixed sources"
                options={salesImportLeadSourceTagOptions}
                selectedOption={sourceTag}
                onChange={setSourceTag}
                className="text-sm"
              />

              {/* Source selector helper */}
              <p className="font-secondary text-n-500 text-xs leading-tight font-light">
                If your file has a &quot;Source&quot; column, leave blank and we&apos;ll
                read it from there.
              </p>
            </div>

            {/* Upload box */}
            <button
              type="button"
              onClick={handleUploadBoxClick}
              className="border-n-400 bg-n-50 flex flex-col items-center gap-4 rounded-[14px] border border-dashed px-6 py-8"
            >
              {/* Upload icon */}
              <AttachFileAdd
                primaryColor="var(--color-n-500)"
                className="size-8"
              />

              {/* Upload texts */}
              <div className="flex flex-col items-center gap-1">
                <p className="font-secondary text-n-800 text-sm font-semibold">
                  Tap to Upload
                </p>
                <p className="font-secondary text-n-500 text-xs font-normal">
                  or drag &amp; drop your file here
                </p>
              </div>
            </button>

            {/* Hidden input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelection}
              className="hidden"
            />

            {/* Expected columns section */}
            <div className="flex flex-col gap-2">
              <p className="font-secondary text-n-600 text-[11px] font-semibold">
                Expected columns:
              </p>

              {/* Expected columns chips */}
              <div className="flex flex-wrap gap-1.5">
                {salesImportExpectedColumns.map((columnItem) => (
                  <span
                    key={columnItem}
                    className="bg-n-50 font-secondary text-n-600 rounded-lg px-3 py-1.5 text-[11px] font-semibold"
                  >
                    {columnItem}
                  </span>
                ))}
              </div>
            </div>

            {/* Download template action */}
            <Link
              href="#"
              className="flex items-center justify-center gap-1 text-center"
            >
              <DownloadTray
                primaryColor="var(--color-blue-600)"
                className="size-3.5"
              />
              <span className="font-secondary text-sm font-bold text-blue-600">
                Download Sample Template
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
