"use client";

// REACT //
import { useState } from "react";

// COMPONENTS //
import { DatePicker } from "@/components/common/DatePicker";
import Dropdown from "@/components/common/Dropdown";
import FilterDrawer from "@/components/common/FilterDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// DATA //
import {
  salesBranchOptions,
  salesCarBrandOptions,
  salesSourceFilterOptions,
  salesStatusFilterOptions,
} from "@/data/sales";

interface LeadsFilterDrawerPropsData {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Leads filter Drawer Component */
export function LeadsFilterDrawer({
  isOpen,
  onOpenChange,
}: LeadsFilterDrawerPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>(
    salesStatusFilterOptions[0],
  );
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>(
    salesSourceFilterOptions[0],
  );
  const [selectedBranch, setSelectedBranch] = useState<string>(
    salesBranchOptions[0].value,
  );
  const [selectedCarBrand, setSelectedCarBrand] = useState<string>(
    salesCarBrandOptions[0].value,
  );
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  // Helper Functions
  const handleClearFilters = (): void => {
    setSelectedStatusFilter(salesStatusFilterOptions[0]);
    setSelectedSourceFilter(salesSourceFilterOptions[0]);
    setSelectedBranch(salesBranchOptions[0].value);
    setSelectedCarBrand(salesCarBrandOptions[0].value);
    setSelectedStartDate("");
    setSelectedEndDate("");
  };

  const handleApplyFilters = (): void => {
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
            {salesStatusFilterOptions.map((statusFilterItem) => {
              const isSelected = selectedStatusFilter === statusFilterItem;

              return (
                /* Status filter chip */
                <button
                  key={statusFilterItem}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedStatusFilter(statusFilterItem)}
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
            {salesSourceFilterOptions.map((sourceFilterItem) => {
              const isSelected = selectedSourceFilter === sourceFilterItem;

              return (
                /* Source filter chip */
                <button
                  key={sourceFilterItem}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedSourceFilter(sourceFilterItem)}
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
          options={salesBranchOptions}
          selectedOption={selectedBranch}
          onChange={setSelectedBranch}
          placeholder={salesBranchOptions[0].label}
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
              value={selectedStartDate}
              onChange={setSelectedStartDate}
              placeholder="Start Date"
            />

            <DatePicker
              value={selectedEndDate}
              onChange={setSelectedEndDate}
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Car brand dropdown */}
        <Dropdown
          label="Car Brand"
          placeholder="Choose car brand"
          options={salesCarBrandOptions}
          selectedOption={selectedCarBrand}
          onChange={setSelectedCarBrand}
        />

        {/* Drawer actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Clear filters action */}
          <Button
            type="button"
            onClick={handleClearFilters}
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
