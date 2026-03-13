"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard-header";
import { useAuth } from "@/context/AuthContext";
import { notifySuccess, notifyError } from "@/utils/toast";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardProfileArea = ({ setIsOpenSidebar }: IProps) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setForm({
            name: d.profile.name || "",
            bio: d.profile.bio || "",
            location: d.profile.location || "",
            phone: d.profile.phone || "",
            website: d.profile.website || "",
          });
        }
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
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
        <h2 className="main-title">My Profile</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "var(--blue, #2563EB)" }} role="status" />
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="bg-white card-box border-20">
              <div className="dash-input-wrapper mb-30">
                <label>Full Name*</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
              </div>
              <div className="dash-input-wrapper mb-30">
                <label>Bio</label>
                <textarea className="size-lg" name="bio" value={form.bio} onChange={handleChange}
                  placeholder="Write something interesting about you..." />
                <div className="alert-text">Brief description for your profile.</div>
              </div>
              <div className="dash-input-wrapper mb-30">
                <label>Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" />
              </div>
              <div className="dash-input-wrapper mb-30">
                <label>Website / Portfolio</label>
                <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://yoursite.com" />
              </div>
              <div className="dash-input-wrapper">
                <label>Location</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="City, Country" />
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

export default DashboardProfileArea;
