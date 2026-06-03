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
  UpdateSalespersonRequestData,
} from "@/types/admin";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import LineArrowReloadHorizontal2 from "@/components/icons/neevo-icons/LineArrowReloadHorizontal2";
import DeleteCircle from "@/components/icons/neevo-icons/DeleteCircle";

// API SERVICES //
import {
  getAdminSalespersonByIdRequest,
  getAdminTeamOptionsRequest,
  removeSalespersonRequest,
  resetSalespersonPasswordRequest,
  updateSalespersonRequest,
} from "@/services/api/admin-team.api.service";

// MODULES //
import { ROUTES } from "@/constants/routes";

// OTHERS //
import { toast } from "sonner";

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

  /** Removes the salesperson with unassign strategy. */
  const handleRemove = async (): Promise<void> => {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      const response = await removeSalespersonRequest(salespersonId, {
        strategy: "unassigned",
      });
      if (response.status_code === 200) {
        toast.success("Salesperson removed.");
        router.replace(ROUTES.admin.team);
      } else {
        toast.error(response.error ?? response.message);
      }
    } catch {
      toast.error("Unable to remove salesperson.");
    } finally {
      setIsRemoving(false);
      setIsRemoveSheetOpen(false);
    }
  };

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
        <div className="flex h-40 items-center justify-center">
          <p className="font-secondary text-n-600 text-sm">Loading...</p>
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

              <EditField
                label="Full Name"
                value={editFields.fullName ?? ""}
                onChange={(val) => setEditFields((prev) => ({ ...prev, fullName: val }))}
              />
              <EditField
                label="Phone"
                value={editFields.phone ?? ""}
                type="tel"
                onChange={(val) => setEditFields((prev) => ({ ...prev, phone: val }))}
              />
              <EditField
                label="Email"
                value={editFields.email ?? ""}
                type="email"
                onChange={(val) => setEditFields((prev) => ({ ...prev, email: val }))}
              />

              {/* Branch */}
              <div className="flex flex-col gap-1.5">
                <label className="text-n-700 text-xs font-semibold uppercase tracking-wide">
                  Branch
                </label>
                <select
                  value={editFields.branchId ?? ""}
                  onChange={(e) =>
                    setEditFields((prev) => ({ ...prev, branchId: e.target.value }))
                  }
                  className="border-n-200 text-n-800 font-secondary w-full rounded-xl border bg-white px-4 py-3 text-sm"
                >
                  <option value="">Select branch</option>
                  {(teamOptions?.branches ?? []).map((branchItem: AdminOptionItemData) => (
                    <option key={branchItem.id} value={branchItem.id}>
                      {branchItem.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-n-700 text-xs font-semibold uppercase tracking-wide">
                  Role
                </label>
                <select
                  value={editFields.roleId ?? ""}
                  onChange={(e) =>
                    setEditFields((prev) => ({ ...prev, roleId: e.target.value }))
                  }
                  className="border-n-200 text-n-800 font-secondary w-full rounded-xl border bg-white px-4 py-3 text-sm"
                >
                  <option value="">Select role</option>
                  {(teamOptions?.roles ?? []).map((roleItem: AdminOptionItemData) => (
                    <option key={roleItem.id} value={roleItem.id}>
                      {roleItem.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between">
                <p className="text-n-700 text-xs font-semibold uppercase tracking-wide">
                  Active Status
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setEditFields((prev) => ({ ...prev, isActive: !prev.isActive }))
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    editFields.isActive ? "bg-blue-600" : "bg-n-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                      editFields.isActive ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
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
              className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-red-100">
                <DeleteCircle
                  primaryColor="var(--color-red-600)"
                  className="size-5"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-red-600">Remove Member</p>
                <p className="font-secondary text-n-500 text-xs">
                  Permanently remove from team
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Remove confirmation sheet */}
      {isRemoveSheetOpen ? (
        <div className="fixed inset-0 z-50 flex items-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsRemoveSheetOpen(false)}
            aria-label="Close"
          />
          <div className="relative z-10 w-full rounded-t-3xl bg-white px-6 pb-8 pt-6">
            <p className="text-n-900 text-base font-bold">Remove Member?</p>
            <p className="font-secondary text-n-600 mt-1 text-sm">
              This will permanently remove{" "}
              <span className="font-semibold">{salesperson.fullName}</span> and
              leave their leads unassigned.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                disabled={isRemoving}
                onClick={() => void handleRemove()}
                className="w-full bg-red-600 text-white hover:bg-red-700"
              >
                {isRemoving ? "Removing..." : "Yes, Remove"}
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
    <div className="flex items-center justify-between gap-4">
      <p className="font-secondary text-n-500 text-xs">{label}</p>
      <p className="text-n-800 text-sm font-medium">{value}</p>
    </div>
  );
}

interface EditFieldPropsData {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}

function EditField({
  label,
  onChange,
  placeholder = "",
  type = "text",
  value,
}: EditFieldPropsData) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-n-700 text-xs font-semibold uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border-n-200 text-n-800 font-secondary w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
}
