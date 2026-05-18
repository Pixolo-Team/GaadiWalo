"use client";

// REACT //
import { useState } from "react";

// COMPONENTS //
import FilterDropdown from "@/components/common/FilterDropdown";
import { Header } from "@/components/common/Header";
import { SearchInput } from "@/components/common/SearchInput";
import HorizontalSlider2 from "@/components/icons/neevo-icons/HorizontalSlider2";
import { LeadCard } from "@/components/sales/LeadCard";
import { LeadsFilterDrawer } from "@/components/sales/LeadsFilterDrawer";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// DATA //
import {
  salesLeadFilterTags,
  salesLeads,
  salesSortOptions,
} from "@/data/sales";

/** Leads Page Component */
export default function LeadsPage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [leadSearchValue, setLeadSearchValue] = useState("");
  const [selectedFilterTag, setSelectedFilterTag] = useState<string>(
    salesLeadFilterTags[0].key,
  );
  const [selectedSort, setSelectedSort] = useState<string>(salesSortOptions[0]);

  // Helper Functions
  const handleOpenFilterDrawer = (): void => {
    setIsFilterDrawerOpen(true);
  };

  // Use Effects

  return (
    <section className="bg-n-100 h-full">
      {/* Leads page shell */}
      <div className="flex h-full flex-col">
        {/* Leads header container */}
        <div className="shrink-0">
          {/* Leads header */}
          <Header
            title="My Leads"
            rightIcon={
              <HorizontalSlider2
                primaryColor="var(--color-n-700)"
                className="size-5"
              />
            }
            onRightIconClick={handleOpenFilterDrawer}
          />
        </div>

        {/* Leads scroll content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {/* Leads content stack */}
          <div className="flex flex-col gap-6">
            {/* Search and filter tags */}
            <div className="flex flex-col gap-2">
              {/* Search field */}
              <SearchInput
                value={leadSearchValue}
                onChange={setLeadSearchValue}
                placeholder="Search by name, phone, car..."
              />

              {/* Filter tags */}
              <div className="scrollbar-hide flex gap-1.5 overflow-x-auto">
                {salesLeadFilterTags.map((filterTagItem) => {
                  const isSelected = selectedFilterTag === filterTagItem.key;

                  return (
                    /* Lead filter tag */
                    <button
                      key={filterTagItem.key}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedFilterTag(filterTagItem.key)}
                      className={`font-secondary h-9 shrink-0 rounded-[20px] px-4 text-sm ${
                        isSelected
                          ? "text-n-50 border-2 border-blue-600 bg-blue-600 font-bold"
                          : "border-n-200 bg-n-50 text-n-600 border"
                      }`}
                    >
                      {filterTagItem.label} ({filterTagItem.count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Leads list section */}
            <div className="flex flex-col gap-2">
              {/* Leads count and sort */}
              <div className="flex items-center justify-between gap-3">
                <p className="font-secondary text-n-500 text-xs">
                  Showing {salesLeadFilterTags[0].count} leads
                </p>

                {/* Sort dropdown */}
                <FilterDropdown
                  title={salesSortOptions[0]}
                  prefix="Sort: "
                  options={salesSortOptions}
                  selectedOption={selectedSort}
                  onChange={setSelectedSort}
                />
              </div>

              {/* Leads list */}
              <div className="flex flex-col gap-3">
                {salesLeads.map((leadItem) => (
                  <LeadCard
                    key={leadItem.key}
                    href={ROUTES.sales.leadDetails(leadItem.key)}
                    name={leadItem.name}
                    phoneNumber={leadItem.phoneNumber}
                    source={leadItem.source}
                    statusLabel={leadItem.statusLabel}
                    statusTone={leadItem.statusTone}
                    vehicleName={leadItem.vehicleName}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter drawer */}
        <LeadsFilterDrawer
          isOpen={isFilterDrawerOpen}
          onOpenChange={setIsFilterDrawerOpen}
        />
      </div>
    </section>
  );
}
