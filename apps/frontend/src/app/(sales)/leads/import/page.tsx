"use client";

// REACT //
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type { DropdownOptionData } from "@/types/dropdown";
import type {
  ImportLeadsResponseData,
  LeadImportDuplicateModeData,
  LeadImportParseResultData,
  LeadImportRawRowData,
} from "@/types/lead-import";
import type { LeadSourceData } from "@/types/leads";

// SERVICES //
import {
  buildLeadImportPreviewService,
  downloadLeadImportTemplateService,
  parseLeadImportFileService,
} from "@/services/lead-import.service";
import {
  getLeadSourcesRequest,
  importLeadsRequest,
} from "@/services/api/sales-leads.api.service";

// LIBRARIES //
import { toast } from "sonner";

// COMPONENTS //
import Dropdown from "@/components/common/Dropdown";
import { Header } from "@/components/common/Header";
import AddTag from "@/components/icons/neevo-icons/AddTag";
import AttachFileAdd from "@/components/icons/neevo-icons/AttachFileAdd";
import DownloadTray from "@/components/icons/neevo-icons/DownloadTray";
import { Button } from "@/components/ui/button";

// DATA //
import {
  salesImportDuplicateModeOptions,
  salesImportExpectedColumns,
  salesImportLeadSourceTagOptions,
} from "@/data/sales";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

type ImportStepData = "upload" | "preview" | "result";

const stepIndexMap: Record<ImportStepData, number> = {
  upload: 0,
  preview: 1,
  result: 2,
};

/** Import Leads Page Component */
export default function ImportLeadsPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Define States
  const [currentStep, setCurrentStep] = useState<ImportStepData>("upload");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [sourceTag, setSourceTag] = useState<string>(
    salesImportLeadSourceTagOptions[0].value,
  );
  const [duplicateMode, setDuplicateMode] =
    useState<LeadImportDuplicateModeData>("skip");
  const [leadSourceOptions, setLeadSourceOptions] = useState<
    DropdownOptionData[]
  >(salesImportLeadSourceTagOptions.slice());
  const [rawImportRows, setRawImportRows] = useState<LeadImportRawRowData[]>([]);
  const [importSummary, setImportSummary] =
    useState<ImportLeadsResponseData | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // Helper Functions
  /**
   * Opens the native file picker.
   */
  const handleUploadBoxClick = (): void => {
    fileInputRef.current?.click();
  };

  /**
   * Builds source-tag dropdown options from API data with a mixed-source fallback.
   */
  const buildLeadSourceOptions = (
    leadSourceItems: LeadSourceData[],
  ): DropdownOptionData[] => {
    const dynamicSourceOptions = leadSourceItems.map((leadSourceItem) => ({
      label: leadSourceItem.name,
      value: leadSourceItem.name,
    }));

    return [
      salesImportLeadSourceTagOptions[0],
      ...dynamicSourceOptions,
    ];
  };

  /**
   * Resolves the current step heading copy.
   */
  const getStepTitle = (): string => {
    if (currentStep === "preview") {
      return "Preview & Validate";
    }

    if (currentStep === "result") {
      return "Import Summary";
    }

    return "Upload Your File";
  };

  /**
   * Resolves the current step helper copy.
   */
  const getStepSubtitle = (): string => {
    if (currentStep === "preview") {
      return `${parseResult?.validCount ?? 0} ready to import`;
    }

    if (currentStep === "result") {
      return `${importSummary?.importedCount ?? 0} leads imported`;
    }

    return "Supported: .xlsx, .xls, .csv";
  };

  /**
   * Parses the selected upload file and moves the UI into preview mode.
   */
  const handleFileSelection = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setIsParsing(true);
    setSelectedFileName(selectedFile.name);
    setImportSummary(null);

    try {
      const parsedRows = await parseLeadImportFileService(selectedFile);

      if (parsedRows.length === 0) {
        toast.error("This file does not contain any readable rows.");
        setRawImportRows([]);
        setCurrentStep("upload");
        return;
      }

      setRawImportRows(parsedRows);
      setCurrentStep("preview");
    } catch {
      toast.error("Unable to parse this file. Please try another sheet.");
      setRawImportRows([]);
      setCurrentStep("upload");
    } finally {
      setIsParsing(false);
    }
  };

  /**
   * Sends valid preview rows to the backend import API.
   */
  const handleImportLeads = (): void => {
    if (!parseResult || parseResult.importRows.length === 0 || isImporting) {
      return;
    }

    setIsImporting(true);

    importLeadsRequest({
      duplicateMode,
      rows: parseResult.importRows,
    })
      .then((response: ApiResponseData<ImportLeadsResponseData>) => {
        if (response.status_code === 200 && response.data) {
          setImportSummary(response.data);
          setCurrentStep("result");
          toast.success(response.message);
          return;
        }

        toast.error(response.error ?? response.message);
      })
      .catch(() => {
        toast.error("Unable to import leads right now. Please try again.");
      })
      .finally(() => {
        setIsImporting(false);
      });
  };

  /**
   * Resets the import screen back to its initial upload state.
   */
  const handleResetImport = (): void => {
    setCurrentStep("upload");
    setSelectedFileName("");
    setRawImportRows([]);
    setImportSummary(null);
    setDuplicateMode("skip");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Downloads a sample CSV template for import formatting reference.
   */
  const handleDownloadTemplate = (): void => {
    downloadLeadImportTemplateService();
  };

  /**
   * Navigates back to the leads list after import completion.
   */
  const handleViewLeads = (): void => {
    router.push(ROUTES.sales.leads);
  };

  // Use Effects
  useEffect(() => {
    getLeadSourcesRequest()
      .then((response: ApiResponseData<LeadSourceData[]>) => {
        if (response.status_code === 200 && response.data) {
          setLeadSourceOptions(buildLeadSourceOptions(response.data));
          return;
        }

        setLeadSourceOptions(salesImportLeadSourceTagOptions.slice());
      })
      .catch(() => {
        toast.error("Unable to load lead source options right now.");
        setLeadSourceOptions(salesImportLeadSourceTagOptions.slice());
      });
  }, []);

  const parseResult: LeadImportParseResultData | null =
    rawImportRows.length === 0
      ? null
      : buildLeadImportPreviewService(rawImportRows, sourceTag);

  const activeStepIndex = stepIndexMap[currentStep];

  return (
    <section className="bg-n-100 h-full">
      <div className="flex h-full flex-col">
        <Header title="Import from Excel" />

        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col items-center gap-1.5 pt-3 pb-0.5">
              <div className="flex items-center justify-center gap-1">
                {[0, 1, 2].map((stepItem) => (
                  <span
                    key={stepItem}
                    className={
                      stepItem <= activeStepIndex
                        ? "h-1 w-[22px] rounded-sm bg-blue-600"
                        : "bg-n-200 h-1 w-[22px] rounded-sm"
                    }
                  />
                ))}
              </div>

              <p className="font-primary text-n-800 text-base font-semibold">
                {getStepTitle()}
              </p>

              <p className="font-secondary text-n-600 text-xs font-normal">
                {getStepSubtitle()}
              </p>
            </div>

            {(currentStep === "upload" || currentStep === "preview") && (
              <div className="flex flex-col gap-3 rounded-[14px] border border-blue-300 bg-blue-50 p-[25px]">
                <div className="flex items-center gap-2">
                  <AddTag
                    primaryColor="var(--color-blue-600)"
                    className="size-5"
                  />
                  <p className="font-secondary text-sm font-semibold text-blue-800">
                    Where is this data from?
                  </p>
                </div>

                <p className="font-secondary text-n-600 text-xs font-normal">
                  Optional - tag all leads in this file with a source
                </p>

                <Dropdown
                  title="Skip / Mixed sources"
                  options={leadSourceOptions}
                  selectedOption={sourceTag}
                  onChange={setSourceTag}
                  className="text-sm"
                />

                <p className="font-secondary text-n-500 text-xs leading-tight font-light">
                  If your file has a &quot;Source&quot; column, we&apos;ll keep
                  that value. Otherwise, we&apos;ll use this tag.
                </p>
              </div>
            )}

            {currentStep === "upload" && (
              <>
                <button
                  type="button"
                  onClick={handleUploadBoxClick}
                  className="border-n-400 bg-n-50 flex flex-col items-center gap-4 rounded-[14px] border border-dashed px-6 py-8"
                >
                  <AttachFileAdd
                    primaryColor="var(--color-n-500)"
                    className="size-8"
                  />

                  <div className="flex flex-col items-center gap-1">
                    <p className="font-secondary text-n-800 text-sm font-semibold">
                      {isParsing ? "Reading file..." : "Tap to Upload"}
                    </p>
                    <p className="font-secondary text-n-500 text-xs font-normal">
                      or drag &amp; drop your file here
                    </p>
                  </div>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelection}
                  className="hidden"
                />

                <div className="flex flex-col gap-2">
                  <p className="font-secondary text-n-600 text-[11px] font-semibold">
                    Expected columns:
                  </p>

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

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="flex items-center justify-center gap-1 text-center"
                >
                  <DownloadTray
                    primaryColor="var(--color-blue-600)"
                    className="size-3.5"
                  />
                  <span className="font-secondary text-sm font-bold text-blue-600">
                    Download Sample Template
                  </span>
                </button>
              </>
            )}

            {currentStep === "preview" && parseResult && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-n-50 rounded-[14px] border border-green-200 p-4">
                    <p className="font-secondary text-xs font-medium text-n-500">
                      Valid
                    </p>
                    <p className="font-primary text-lg font-semibold text-green-700">
                      {parseResult.validCount}
                    </p>
                  </div>

                  <div className="bg-n-50 rounded-[14px] border border-amber-200 p-4">
                    <p className="font-secondary text-xs font-medium text-n-500">
                      Duplicates
                    </p>
                    <p className="font-primary text-lg font-semibold text-amber-700">
                      {parseResult.duplicateCount}
                    </p>
                  </div>

                  <div className="bg-n-50 rounded-[14px] border border-red-200 p-4">
                    <p className="font-secondary text-xs font-medium text-n-500">
                      Errors
                    </p>
                    <p className="font-primary text-lg font-semibold text-red-700">
                      {parseResult.errorCount}
                    </p>
                  </div>
                </div>

                <div className="bg-n-50 flex flex-col gap-3 rounded-[14px] border border-n-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-secondary text-n-800 text-sm font-semibold">
                        {selectedFileName || "Selected file"}
                      </p>
                      <p className="font-secondary text-n-500 text-xs">
                        Total rows: {parseResult.totalRows}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      className="h-auto w-auto px-3 py-2 text-sm"
                      onClick={handleResetImport}
                    >
                      Choose another file
                    </Button>
                  </div>

                  <Dropdown
                    label="DUPLICATE HANDLING"
                    title="Choose duplicate action"
                    options={salesImportDuplicateModeOptions}
                    selectedOption={duplicateMode}
                    onChange={(value) =>
                      setDuplicateMode(value as LeadImportDuplicateModeData)
                    }
                  />
                </div>

                <div className="flex flex-col gap-3">
                  {parseResult.rows.map((previewRowItem) => {
                    const toneClassName =
                      previewRowItem.previewStatus === "valid"
                        ? "border-green-200 bg-green-50"
                        : previewRowItem.previewStatus === "duplicate"
                          ? "border-amber-200 bg-amber-50"
                          : "border-red-200 bg-red-50";
                    const statusLabel =
                      previewRowItem.previewStatus === "valid"
                        ? "Ready"
                        : previewRowItem.previewStatus === "duplicate"
                          ? "Duplicate"
                          : "Error";

                    return (
                      <div
                        key={`${previewRowItem.rowNumber}-${previewRowItem.phone}`}
                        className={`rounded-[14px] border p-4 ${toneClassName}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-secondary text-n-800 text-sm font-semibold">
                              Row {previewRowItem.rowNumber}:{" "}
                              {previewRowItem.fullName || "Unnamed Lead"}
                            </p>
                            <p className="font-secondary text-n-600 text-xs">
                              {previewRowItem.phone || "No phone"}{" "}
                              {previewRowItem.resolvedSource
                                ? `• ${previewRowItem.resolvedSource}`
                                : ""}
                            </p>
                          </div>

                          <span className="font-secondary text-xs font-semibold text-n-700">
                            {statusLabel}
                          </span>
                        </div>

                        {previewRowItem.validationErrors.length > 0 && (
                          <div className="mt-3 flex flex-col gap-1">
                            {previewRowItem.validationErrors.map((errorItem) => (
                              <p
                                key={`${previewRowItem.rowNumber}-${errorItem}`}
                                className="font-secondary text-xs text-n-700"
                              >
                                {errorItem}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {currentStep === "result" && importSummary && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-n-50 rounded-[14px] border border-green-200 p-4">
                    <p className="font-secondary text-xs font-medium text-n-500">
                      Imported
                    </p>
                    <p className="font-primary text-lg font-semibold text-green-700">
                      {importSummary.importedCount}
                    </p>
                  </div>

                  <div className="bg-n-50 rounded-[14px] border border-blue-200 p-4">
                    <p className="font-secondary text-xs font-medium text-n-500">
                      Updated
                    </p>
                    <p className="font-primary text-lg font-semibold text-blue-700">
                      {importSummary.updatedCount}
                    </p>
                  </div>

                  <div className="bg-n-50 rounded-[14px] border border-amber-200 p-4">
                    <p className="font-secondary text-xs font-medium text-n-500">
                      Skipped
                    </p>
                    <p className="font-primary text-lg font-semibold text-amber-700">
                      {importSummary.skippedCount}
                    </p>
                  </div>

                  <div className="bg-n-50 rounded-[14px] border border-red-200 p-4">
                    <p className="font-secondary text-xs font-medium text-n-500">
                      Errors
                    </p>
                    <p className="font-primary text-lg font-semibold text-red-700">
                      {importSummary.errorCount}
                    </p>
                  </div>
                </div>

                <div className="bg-n-50 flex flex-col gap-2 rounded-[14px] border border-n-200 p-4">
                  <p className="font-secondary text-n-800 text-sm font-semibold">
                    Processed {importSummary.totalRows} backend rows
                  </p>

                  <div className="flex flex-col gap-2">
                    {importSummary.results.map((resultItem) => (
                      <div
                        key={`${resultItem.rowNumber}-${resultItem.status}`}
                        className="border-n-200 flex items-start justify-between gap-3 rounded-xl border p-3"
                      >
                        <div className="min-w-0">
                          <p className="font-secondary text-n-800 text-sm font-semibold">
                            Row {resultItem.rowNumber}
                          </p>
                          <p className="font-secondary text-n-600 text-xs">
                            {resultItem.reason}
                          </p>
                        </div>

                        <span className="font-secondary text-n-700 text-xs font-semibold uppercase">
                          {resultItem.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {(currentStep === "preview" || currentStep === "result") && (
          <div className="border-n-200 bg-n-50 shrink-0 border-t-[1.6px] p-3.5">
            <div className="flex flex-col gap-2">
              {currentStep === "preview" ? (
                <>
                  <Button
                    type="button"
                    variant="primary"
                    disabled={parseResult?.importRows.length === 0 || isImporting}
                    onClick={handleImportLeads}
                  >
                    {isImporting
                      ? "Importing Leads..."
                      : `Import ${parseResult?.importRows.length ?? 0} Leads`}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleResetImport}
                  >
                    Back
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" variant="primary" onClick={handleViewLeads}>
                    View Leads
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleResetImport}
                  >
                    Import Another File
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
