"use client";

// REACT //
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// TYPES //
import type {
  AdminOptionItemData,
  AdminSalespersonData,
  AdminTeamOptionsData,
  SalespersonEditFieldsData,
} from "@/types/admin";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import Dropdown from "@/components/common/Dropdown";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import LineArrowReloadHorizontal2 from "@/components/icons/neevo-icons/LineArrowReloadHorizontal2";
import DeleteCircle from "@/components/icons/neevo-icons/DeleteCircle";

// API SERVICES //
import {
  getAdminSalespersonByIdRequest,
  getAdminTeamOptionsRequest,
  resetSalespersonPasswordRequest,
  updateSalespersonRequest,
} from "@/services/api/admin-team.api.service";

// LIBRARIES //
import { toast } from "sonner";

// MODULES //
import { ROUTES } from "@/constants/routes";

/** Admin — Salesperson Detail Page */
export default function SalespersonDetailPage() {
  // Define Navigation
  const router = useRouter();
  const params = useParams<{ salespersonId: string }>();
  const salespersonId = params.salespersonId;

  // Define Context

  // Define Refs

  // Define States
  const [salesperson, setSalesperson] = useState<AdminSalespersonData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [isRemoveSheetOpen, setIsRemoveSheetOpen] = useState<boolean>(false);
  const [teamOptions, setTeamOptions] = useState<AdminTeamOptionsData | null>(null);
  const [editFields, setEditFields] = useState<SalespersonEditFieldsData>({});
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  // Helper Functions
  /** Fetches salesperson details. */
  const fetchSalespersonService = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await getAdminSalespersonByIdRequest(salespersonId);
      if (response.status_code === 200 && response.data) {
        setSalesperson(response.data);
        setEditFields({
          branchId: response.data.branch?.id ?? "",
          email: response.data.email,
          fullName: response.data.fullName,
          isActive: response.data.status === "Active",
          phone: response.data.phone,
          roleId: response.data.role?.id ?? "",
        });
      } else {
        toast.error("Salesperson not found.");
        router.replace(ROUTES.admin.team);
      }
    } catch {
      toast.error("Unable to load salesperson.");
      router.replace(ROUTES.admin.team);
    } finally {
      setIsLoading(false);
    }
  }, [salespersonId, router]);

  /** Saves edited salesperson details. */
  const handleSaveEdit = async (): Promise<void> => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await updateSalespersonRequest(salespersonId, editFields);
      if (response.status_code === 200) {
        toast.success("Profile updated.");
        setSalesperson(response.data ?? null);
        setIsEditing(false);
      } else {
        toast.error(response.error ?? response.message);
      }
    } catch {
      toast.error("Unable to update salesperson.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Resets the salesperson's password. */
  const handleResetPassword = async (): Promise<void> => {
    if (isResetting) return;
    setIsResetting(true);
    try {
      const response = await resetSalespersonPasswordRequest(salespersonId);
      if (response.status_code === 200 && response.data) {
        setTempPassword(response.data.tempPassword);
        toast.success("Password reset successfully.");
      } else {
        toast.error(response.error ?? response.message);
      }
    } catch {
      toast.error("Unable to reset password.");
    } finally {
      setIsResetting(false);
    }
  };

  /** Deactivates or reactivates the salesperson. */
  const handleToggleActive = async (): Promise<void> => {
    if (isRemoving) return;
    setIsRemoving(true);
    const isCurrentlyActive = salesperson?.status === "Active";
    try {
      const response = await updateSalespersonRequest(salespersonId, {
        isActive: !isCurrentlyActive,
      });
      if (response.status_code === 200) {
        toast.success(
          isCurrentlyActive
            ? "Member deactivated and moved to inactive."
            : "Member reactivated.",
        );
        setSalesperson(response.data ?? null);
        setIsRemoveSheetOpen(false);
      } else {
        toast.error(response.error ?? response.message);
      }
    } catch {
      toast.error(
        isCurrentlyActive
          ? "Unable to deactivate member."
          : "Unable to reactivate member.",
      );
    } finally {
      setIsRemoving(false);
      setIsRemoveSheetOpen(false);
    }
  };

  /** Opens the edit form and fetches branch/role options. */
  const handleOpenEdit = (): void => {
    void getAdminTeamOptionsRequest().then((response) => {
      if (response.status_code === 200) setTeamOptions(response.data ?? null);
    });
    setIsEditing(true);
  };

  // Use Effects
  useEffect(() => {
    void fetchSalespersonService();
  }, [fetchSalespersonService]);

  if (isLoading) {
    return (
      <section className="bg-n-100 h-full">
        <Header title="Team Member" />
        <div className="flex flex-col gap-5 p-6 animate-pulse">
          {/* Profile card skeleton */}
          <div className="bg-n-50 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="bg-n-200 size-14 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="bg-n-200 h-4 w-36 rounded-lg" />
                <div className="bg-n-200 h-3 w-24 rounded-lg" />
                <div className="bg-n-200 h-4 w-14 rounded-full" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-n-200 h-16 rounded-xl" />
              <div className="bg-n-200 h-16 rounded-xl" />
            </div>
          </div>

          {/* Detail card skeleton */}
          <div className="bg-n-50 flex flex-col gap-4 rounded-2xl p-5">
            {Array.from({ length: 4 }).map((_, indexItem) => (
              <div key={indexItem} className="flex items-center justify-between">
                <div className="bg-n-200 h-3 w-16 rounded-lg" />
                <div className="bg-n-200 h-3 w-28 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Action buttons skeleton */}
          <div className="flex flex-col gap-3">
            <div className="bg-n-200 h-16 rounded-2xl" />
            <div className="bg-n-200 h-16 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!salesperson) return null;

  return (
    <section className="bg-n-100 h-full">
      <div className="flex flex-col">
        <Header
          title="Team Member"
          rightIcon={
            <span className="font-secondary text-sm font-semibold text-blue-600">
              {isEditing ? "Cancel" : "Edit"}
            </span>
          }
          rightLabel={isEditing ? "Cancel edit" : "Edit member"}
          onRightIconClick={() => (isEditing ? setIsEditing(false) : handleOpenEdit())}
        />

        <div className="flex flex-col gap-5 p-6">
          {/* Profile card */}
          <div className="bg-n-50 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl font-bold text-blue-700">
                  {salesperson.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-n-900 truncate text-base font-bold">
                  {salesperson.fullName}
                </p>
                <p className="font-secondary text-n-500 text-xs">
                  {salesperson.userId}
                </p>
                <span
                  className={`font-secondary mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    salesperson.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-n-200 text-n-500"
                  }`}
                >
                  {salesperson.status}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-n-100 rounded-xl p-3">
                <p className="font-secondary text-n-500 text-xs">Total Leads</p>
                <p className="text-n-900 text-lg font-bold">{salesperson.thisMonth.leads}</p>
              </div>
              <div className="bg-n-100 rounded-xl p-3">
                <p className="font-secondary text-n-500 text-xs">Won</p>
                <p className="text-lg font-bold text-green-600">{salesperson.thisMonth.won}</p>
              </div>
            </div>
          </div>

          {/* Edit form or detail view */}
          {isEditing ? (
            <div className="bg-n-50 flex flex-col gap-4 rounded-2xl p-5">
              <p className="text-n-800 text-sm font-bold">Edit Details</p>

              <InputBox
                label="Full Name"
                placeholder="Enter full name"
                value={editFields.fullName ?? ""}
                onChange={(val) => setEditFields((prev) => ({ ...prev, fullName: val }))}
              />
              <InputBox
                label="Phone"
                placeholder="Enter phone number"
                type="tel"
                value={editFields.phone ?? ""}
                onChange={(val) => setEditFields((prev) => ({ ...prev, phone: val }))}
              />
              <InputBox
                label="Email"
                placeholder="Enter email address"
                type="email"
                value={editFields.email ?? ""}
                onChange={(val) => setEditFields((prev) => ({ ...prev, email: val }))}
              />

              <Dropdown
                label="Branch"
                placeholder="Select branch"
                selectedOption={editFields.branchId ?? ""}
                options={(teamOptions?.branches ?? []).map((branchItem: AdminOptionItemData) => ({
                  label: branchItem.name,
                  value: branchItem.id,
                }))}
                onChange={(val) => setEditFields((prev) => ({ ...prev, branchId: val }))}
              />

              <Dropdown
                label="Role"
                placeholder="Select role"
                selectedOption={editFields.roleId ?? ""}
                options={(teamOptions?.roles ?? []).map((roleItem: AdminOptionItemData) => ({
                  label: roleItem.name,
                  value: roleItem.id,
                }))}
                onChange={(val) => setEditFields((prev) => ({ ...prev, roleId: val }))}
              />

              {/* Active toggle */}
              <div className="flex items-center justify-between">
                <p className="font-secondary text-n-600 text-xs font-medium tracking-wide uppercase">
                  Active Status
                </p>
                <Switch
                  checked={editFields.isActive ?? false}
                  onCheckedChange={(checked) =>
                    setEditFields((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>

              <Button
                type="button"
                variant="primary"
                disabled={isSubmitting}
                onClick={() => void handleSaveEdit()}
                className="mt-1 w-full"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <div className="bg-n-50 flex flex-col gap-3 rounded-2xl p-5">
              <DetailRow label="Email" value={salesperson.email} />
              <DetailRow label="Phone" value={salesperson.phone} />
              <DetailRow label="Branch" value={salesperson.branch?.name ?? "—"} />
              <DetailRow label="Role" value={salesperson.role?.name ?? "—"} />
            </div>
          )}

          {/* Temp password banner */}
          {tempPassword ? (
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="font-secondary text-xs font-semibold text-amber-700">
                Temporary Password (share securely)
              </p>
              <p className="font-secondary mt-1 text-sm font-bold text-amber-900">
                {tempPassword}
              </p>
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={isResetting}
              onClick={() => void handleResetPassword()}
              className="border-n-200 bg-n-50 flex items-center gap-3 rounded-2xl border p-4"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-amber-100">
                <LineArrowReloadHorizontal2
                  primaryColor="var(--color-amber-600)"
                  className="size-5"
                />
              </div>
              <div className="text-left">
                <p className="text-n-800 text-sm font-semibold">Reset Password</p>
                <p className="font-secondary text-n-500 text-xs">
                  Generate a new temporary password
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsRemoveSheetOpen(true)}
              className={`flex items-center gap-3 rounded-2xl border p-4 ${
                salesperson.status === "Active"
                  ? "border-red-100 bg-red-50"
                  : "border-green-100 bg-green-50"
              }`}
            >
              <div
                className={`flex size-9 items-center justify-center rounded-full ${
                  salesperson.status === "Active" ? "bg-red-100" : "bg-green-100"
                }`}
              >
                <DeleteCircle
                  primaryColor={
                    salesperson.status === "Active"
                      ? "var(--color-red-600)"
                      : "var(--color-green-600)"
                  }
                  className="size-5"
                />
              </div>
              <div className="text-left">
                <p
                  className={`text-sm font-semibold ${
                    salesperson.status === "Active"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {salesperson.status === "Active"
                    ? "Deactivate Member"
                    : "Reactivate Member"}
                </p>
                <p className="font-secondary text-n-500 text-xs">
                  {salesperson.status === "Active"
                    ? "Moves member to the inactive list"
                    : "Restores member to the active list"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate / Reactivate confirmation sheet */}
      {isRemoveSheetOpen ? (
        <div className="fixed inset-0 z-50 flex items-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsRemoveSheetOpen(false)}
            aria-label="Close"
          />
          <div className="relative z-10 w-full rounded-t-3xl bg-white px-6 pb-8 pt-6">
            <p className="text-n-900 text-base font-bold">
              {salesperson.status === "Active"
                ? "Deactivate Member?"
                : "Reactivate Member?"}
            </p>
            <p className="font-secondary text-n-600 mt-1 text-sm">
              {salesperson.status === "Active" ? (
                <>
                  <span className="font-semibold">{salesperson.fullName}</span>{" "}
                  will be moved to the inactive list. Their leads will remain
                  assigned.
                </>
              ) : (
                <>
                  <span className="font-semibold">{salesperson.fullName}</span>{" "}
                  will be restored to the active list.
                </>
              )}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                disabled={isRemoving}
                onClick={() => void handleToggleActive()}
                className={`w-full text-white ${
                  salesperson.status === "Active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isRemoving
                  ? "Processing..."
                  : salesperson.status === "Active"
                    ? "Yes, Deactivate"
                    : "Yes, Reactivate"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsRemoveSheetOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

// ─── Local sub-components ───────────────────────────────────────────────────

interface DetailRowPropsData {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowPropsData) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="font-secondary text-n-500 shrink-0 text-xs">{label}</p>
      <p className="text-n-800 min-w-0 break-all text-right text-sm font-medium">{value}</p>
    </div>
  );
}

