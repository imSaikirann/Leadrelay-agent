"use client";

import { useEffect, useState } from "react";

type Plan = {
  id: string;
  name: string;
  dodoPlanId: string | null;
  priceMonthly: number;
  trialDays: number;
  maxLeads: number | null;
  maxMembers: number | null;
  isActive: boolean;
  features: string[];
};

type PlanForm = {
  name: string;
  dodoPlanId: string;
  priceMonthly: string;
  trialDays: string;
  maxLeads: string;
  maxMembers: string;
  features: string;
};

const emptyForm: PlanForm = {
  name: "",
  dodoPlanId: "",
  priceMonthly: "12000",
  trialDays: "7",
  maxLeads: "",
  maxMembers: "",
  features: "",
};

function toForm(plan: Plan): PlanForm {
  return {
    name: plan.name,
    dodoPlanId: plan.dodoPlanId ?? "",
    priceMonthly: String(plan.priceMonthly),
    trialDays: String(plan.trialDays),
    maxLeads: plan.maxLeads == null ? "" : String(plan.maxLeads),
    maxMembers: plan.maxMembers == null ? "" : String(plan.maxMembers),
    features: Array.isArray(plan.features) ? plan.features.join(", ") : "",
  };
}

export default function AdminPlansClient() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [createForm, setCreateForm] = useState<PlanForm>(emptyForm);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<PlanForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadPlans() {
    const res = await fetch("/api/admin/plans");
    const data = await res.json();
    setPlans(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadPlans();
  }, []);

  async function createPlan() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          dodoPlanId: createForm.dodoPlanId,
          priceMonthly: Number(createForm.priceMonthly),
          trialDays: Number(createForm.trialDays),
          maxLeads: createForm.maxLeads ? Number(createForm.maxLeads) : null,
          maxMembers: createForm.maxMembers ? Number(createForm.maxMembers) : null,
          features: createForm.features
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to create plan");

      setCreateForm(emptyForm);
      await loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create plan");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(plan: Plan) {
    setEditingPlanId(plan.id);
    setEditForm(toForm(plan));
    setError("");
  }

  function cancelEdit() {
    setEditingPlanId(null);
    setEditForm(emptyForm);
  }

  async function saveEdit(planId: string) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          dodoPlanId: editForm.dodoPlanId,
          priceMonthly: Number(editForm.priceMonthly),
          trialDays: Number(editForm.trialDays),
          maxLeads: editForm.maxLeads ? Number(editForm.maxLeads) : null,
          maxMembers: editForm.maxMembers ? Number(editForm.maxMembers) : null,
          features: editForm.features
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to update plan");

      cancelEdit();
      await loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update plan");
    } finally {
      setSaving(false);
    }
  }

  async function togglePlan(plan: Plan) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !plan.isActive }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to update plan");

      await loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update plan");
    } finally {
      setSaving(false);
    }
  }

  async function deletePlan(planId: string) {
    const confirmed = confirm("Deactivate this plan?");
    if (!confirmed) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/plans/${planId}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to delete plan");

      if (editingPlanId === planId) cancelEdit();
      await loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete plan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-8">
        <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] leading-tight">Plans</h1>
        <p className="mt-1 text-sm text-[#666]">
          Create, update, deactivate, and manage Dodo-linked plans from one admin screen.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-[#1e1e1e] bg-[#111] p-5">
          <p className="mb-4 text-xs font-mono uppercase tracking-widest text-[#555]">Create plan</p>
          <div className="grid gap-3">
            {[
              { key: "name", label: "Plan name", type: "text", placeholder: "Growth" },
              { key: "dodoPlanId", label: "Dodo product id", type: "text", placeholder: "pdt_xxxxx" },
              { key: "priceMonthly", label: "Monthly price", type: "number", placeholder: "12000" },
              { key: "trialDays", label: "Trial days", type: "number", placeholder: "7" },
              { key: "maxLeads", label: "Lead limit", type: "number", placeholder: "1500" },
              { key: "maxMembers", label: "Member limit", type: "number", placeholder: "10" },
              { key: "features", label: "Features", type: "text", placeholder: "ai_scoring, team_management" },
            ].map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-[10px] font-mono text-[#666]">{field.label}</label>
                <input
                  type={field.type}
                  value={createForm[field.key as keyof PlanForm]}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-[#262626] bg-[#0d0d0d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#555]"
                />
              </div>
            ))}
            <button
              onClick={createPlan}
              disabled={saving || !createForm.name.trim()}
              className="rounded-xl bg-[#D4622A] px-4 py-3 text-sm text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create plan"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1e1e1e] bg-[#111] p-5">
          <p className="mb-4 text-xs font-mono uppercase tracking-widest text-[#555]">Existing plans</p>
          <div className="grid gap-3">
            {plans.map((plan) => {
              const isEditing = editingPlanId === plan.id;
              const currentForm = isEditing ? editForm : toForm(plan);

              return (
                <div key={plan.id} className="rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d] p-4">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-white">{plan.name}</p>
                      <p className="mt-1 text-[10px] font-mono text-[#777]">
                        Rs {plan.priceMonthly} / month • {plan.trialDays} day trial
                      </p>
                    </div>
                    <button
                      onClick={() => togglePlan(plan)}
                      disabled={saving}
                      className={`rounded-full px-3 py-1 text-[10px] font-mono ${
                        plan.isActive ? "bg-emerald-500/10 text-emerald-300" : "bg-[#1e1e1e] text-[#888]"
                      } disabled:opacity-50`}
                    >
                      {plan.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { key: "name", label: "Plan name", type: "text" },
                      { key: "dodoPlanId", label: "Dodo product id", type: "text" },
                      { key: "priceMonthly", label: "Price", type: "number" },
                      { key: "trialDays", label: "Trial days", type: "number" },
                      { key: "maxLeads", label: "Lead limit", type: "number" },
                      { key: "maxMembers", label: "Member limit", type: "number" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="mb-1 block text-[10px] font-mono text-[#666]">{field.label}</label>
                        <input
                          type={field.type}
                          value={currentForm[field.key as keyof PlanForm]}
                          onChange={(e) =>
                            isEditing &&
                            setEditForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          readOnly={!isEditing}
                          className={`w-full rounded-xl border px-3 py-2 text-xs outline-none ${
                            isEditing
                              ? "border-[#262626] bg-[#111] text-white"
                              : "border-[#1e1e1e] bg-[#101010] text-[#999]"
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-3">
                    <label className="mb-1 block text-[10px] font-mono text-[#666]">Features</label>
                    <textarea
                      rows={3}
                      value={currentForm.features}
                      onChange={(e) => isEditing && setEditForm((prev) => ({ ...prev, features: e.target.value }))}
                      readOnly={!isEditing}
                      className={`w-full rounded-xl border px-3 py-2 text-xs outline-none ${
                        isEditing
                          ? "border-[#262626] bg-[#111] text-white"
                          : "border-[#1e1e1e] bg-[#101010] text-[#999]"
                      }`}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(plan.id)}
                          disabled={saving}
                          className="rounded-xl bg-[#D4622A] px-3 py-2 text-[10px] font-mono text-white disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          className="rounded-xl border border-[#2a2a2a] px-3 py-2 text-[10px] font-mono text-white disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(plan)}
                        className="rounded-xl border border-[#2a2a2a] px-3 py-2 text-[10px] font-mono text-white"
                      >
                        Update
                      </button>
                    )}

                    <button
                      onClick={() => deletePlan(plan.id)}
                      disabled={saving}
                      className="rounded-xl border border-red-900/60 px-3 py-2 text-[10px] font-mono text-red-300 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
