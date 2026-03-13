"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "../candidate/dashboard-header";
import { useAuth } from "@/context/AuthContext";
import { notifySuccess, notifyError } from "@/utils/toast";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmployProfileArea = ({ setIsOpenSidebar }: IProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    phone: "",
    company_name: "",
    company_description: "",
    company_website: "",
    company_location: "",
    company_size: "",
    company_industry: "",
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setForm({
          name: d.profile?.name || "",
          bio: d.profile?.bio || "",
          phone: d.profile?.phone || "",
          company_name: d.company?.name || "",
          company_description: d.company?.description || "",
          company_website: d.company?.website || "",
          company_location: d.company?.location || "",
          company_size: d.company?.size || "",
          company_industry: d.company?.industry || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      bio: form.bio,
      phone: form.phone,
      location: form.company_location,
      // These map to roleData for employer:
      company_name: form.company_name,
      description: form.company_description,
      website: form.company_website,
      company_size: form.company_size,
      industry: form.company_industry,
    };
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      notifySuccess("Profile updated successfully!");
    } else {
      const data = await res.json();
      notifyError(data.error || "Failed to update profile");
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <h2 className="main-title">Company Profile</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "var(--blue, #2563EB)" }} role="status" />
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="bg-white card-box border-20">
              <h4 className="dash-title-three mb-25">Personal Info</h4>
              <div className="dash-input-wrapper mb-20">
                <label>Your Name*</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="dash-input-wrapper mb-20">
                <label>Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" />
              </div>
            </div>

            <div className="bg-white card-box border-20 mt-30">
              <h4 className="dash-title-three mb-25">Company Details</h4>
              <div className="dash-input-wrapper mb-20">
                <label>Company Name*</label>
                <input type="text" name="company_name" value={form.company_name} onChange={handleChange} required />
              </div>
              <div className="dash-input-wrapper mb-20">
                <label>About Company</label>
                <textarea className="size-lg" name="company_description" value={form.company_description}
                  onChange={handleChange} placeholder="Describe your company..." />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-20">
                    <label>Website</label>
                    <input type="url" name="company_website" value={form.company_website}
                      onChange={handleChange} placeholder="https://company.com" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-20">
                    <label>Location</label>
                    <input type="text" name="company_location" value={form.company_location}
                      onChange={handleChange} placeholder="City, Country" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-20">
                    <label>Company Size</label>
                    <input type="text" name="company_size" value={form.company_size}
                      onChange={handleChange} placeholder="e.g. 50-200" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-20">
                    <label>Industry</label>
                    <input type="text" name="company_industry" value={form.company_industry}
                      onChange={handleChange} placeholder="e.g. Technology" />
                  </div>
                </div>
              </div>
            </div>

            <div className="button-group d-inline-flex align-items-center mt-30">
              <button type="submit" className="dash-btn-two tran3s me-3" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmployProfileArea;
