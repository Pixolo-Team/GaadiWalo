"use client";

// COMPONENTS //
import { DatePicker } from "@/components/common/DatePicker";
import Dropdown from "@/components/common/Dropdown";
import FilterDrawer from "@/components/common/FilterDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// TYPES //
import type { DropdownOptionData } from "@/types/dropdown";
import type { LeadsFilterStateData } from "@/types/leads";

interface LeadsFilterDrawerPropsData {
  branchOptions: ReadonlyArray<DropdownOptionData>;
  carBrandOptions: ReadonlyArray<DropdownOptionData>;
  filterState: LeadsFilterStateData;
  isOpen: boolean;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onFilterStateChange: (filterState: LeadsFilterStateData) => void;
  onOpenChange: (open: boolean) => void;
  sourceFilterOptions: ReadonlyArray<string>;
  statusFilterOptions: ReadonlyArray<string>;
}

/** Leads filter Drawer Component */
export function LeadsFilterDrawer({
  branchOptions,
  carBrandOptions,
  filterState,
  isOpen,
  onApplyFilters,
  onClearFilters,
  onFilterStateChange,
  onOpenChange,
  sourceFilterOptions,
  statusFilterOptions,
}: LeadsFilterDrawerPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Helper Functions
  const handleFilterStateChange = (
    fieldName: keyof LeadsFilterStateData,
    fieldValue: string | string[],
  ): void => {
    onFilterStateChange({
      ...filterState,
      [fieldName]: fieldValue,
    });
  };

  /**
   * Toggles one filter chip value in a multi-select field.
   */
  const handleMultiSelectToggle = (
    fieldName: "selectedSourceFilters" | "selectedStatusFilters",
    fieldValue: string,
  ): void => {
    if (fieldValue === "All") {
      handleFilterStateChange(fieldName, []);
      return;
    }

    const selectedItems = filterState[fieldName];
    const nextSelectedItems = selectedItems.includes(fieldValue)
      ? selectedItems.filter((selectedItem) => selectedItem !== fieldValue)
      : [...selectedItems, fieldValue];

    handleFilterStateChange(fieldName, nextSelectedItems);
  };

  const handleApplyFilters = (): void => {
    onApplyFilters();
    onOpenChange(false);
  };

  // Use Effects

  return (
    <FilterDrawer
      title="Filter Leads"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {/* Lead filters content */}
      <div className="flex flex-col gap-5">
        {/* Status filters */}
        <div className="flex flex-col gap-2">
          {/* Filter group label */}
          <p className="font-secondary text-n-600 text-xs font-semibold uppercase">
            Status
          </p>

          {/* Status options */}
          <div className="flex flex-wrap gap-2">
            {statusFilterOptions.map((statusFilterItem) => {
              const isSelected =
                statusFilterItem === "All"
                  ? filterState.selectedStatusFilters.length === 0
                  : filterState.selectedStatusFilters.includes(statusFilterItem);

              return (
                /* Status filter chip */
                <button
                  key={statusFilterItem}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    handleMultiSelectToggle(
                      "selectedStatusFilters",
                      statusFilterItem,
                    )
                  }
                  className="h-auto w-auto rounded-3xl p-0"
                >
                  <Badge
                    className={`font-secondary h-10 rounded-3xl px-4 text-sm font-normal ${
                      isSelected
                        ? "text-n-50 bg-blue-600 font-bold"
                        : "border-n-200 bg-n-50 text-n-700 border"
                    }`}
                  >
                    {statusFilterItem}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* Source filters */}
        <div className="flex flex-col gap-2">
          {/* Filter group label */}
          <p className="font-secondary text-n-600 text-xs font-semibold uppercase">
            Source
          </p>

          {/* Source options */}
          <div className="flex flex-wrap gap-2">
            {sourceFilterOptions.map((sourceFilterItem) => {
              const isSelected =
                sourceFilterItem === "All"
                  ? filterState.selectedSourceFilters.length === 0
                  : filterState.selectedSourceFilters.includes(sourceFilterItem);

              return (
                /* Source filter chip */
                <button
                  key={sourceFilterItem}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    handleMultiSelectToggle(
                      "selectedSourceFilters",
                      sourceFilterItem,
                    )
                  }
                  className="h-auto w-auto rounded-3xl p-0"
                >
                  <Badge
                    className={`font-secondary h-10 rounded-3xl px-4 text-sm font-normal ${
                      isSelected
                        ? "text-n-50 bg-blue-600 font-bold"
                        : "border-n-200 bg-n-50 text-n-700 border"
                    }`}
                  >
                    {sourceFilterItem}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* Branch dropdown */}
        <Dropdown
          label="Branch"
          options={branchOptions}
          selectedOption={filterState.selectedBranch}
          onChange={(value: string) =>
            handleFilterStateChange("selectedBranch", value)
          }
          placeholder={branchOptions[0]?.label ?? "Choose branch"}
        />

        {/* Date range filter */}
        <div className="flex flex-col gap-2">
          {/* Filter group label */}
          <p className="font-secondary text-n-600 text-xs font-semibold uppercase">
            Date Range
          </p>

          {/* Date range fields */}
          <div className="grid grid-cols-2 gap-2">
            <DatePicker
              value={filterState.selectedStartDate}
              onChange={(value: string) =>
                handleFilterStateChange("selectedStartDate", value)
              }
              placeholder="Start Date"
            />

            <DatePicker
              value={filterState.selectedEndDate}
              onChange={(value: string) =>
                handleFilterStateChange("selectedEndDate", value)
              }
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Car brand dropdown */}
        <Dropdown
          label="Car Brand"
          placeholder="Choose car brand"
          options={carBrandOptions}
          selectedOption={filterState.selectedCarBrand}
          onChange={(value: string) =>
            handleFilterStateChange("selectedCarBrand", value)
          }
        />

        {/* Drawer actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Clear filters action */}
          <Button
            type="button"
            onClick={onClearFilters}
            className="border-n-200 bg-n-100 font-secondary text-n-800 hover:bg-n-100 active:bg-n-200 h-12 rounded-md border text-sm font-semibold shadow-none"
          >
            Clear All
          </Button>

          {/* Apply filters action */}
          <Button
            type="button"
            onClick={handleApplyFilters}
            className="font-secondary text-n-50 h-12 rounded-md bg-blue-600 text-sm font-semibold"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </FilterDrawer>
  );
}
