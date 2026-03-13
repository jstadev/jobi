"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { notifySuccess, notifyError } from "@/utils/toast";

const ChangePasswordArea = () => {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      notifyError("Passwords do not match");
      return;
    }
    if (form.newPassword.length < 6) {
      notifyError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: form.newPassword });
    setLoading(false);
    if (error) {
      notifyError(error.message);
    } else {
      notifySuccess("Password updated successfully!");
      setForm({ newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <div className="mt-45">
      <div className="position-relative">
        <h2 className="main-title">Change Password</h2>
        <div className="bg-white card-box border-20">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label>New Password*</label>
                  <input type="password" name="newPassword" value={form.newPassword}
                    onChange={handleChange} required minLength={6} />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label>Confirm Password*</label>
                  <input type="password" name="confirmPassword" value={form.confirmPassword}
                    onChange={handleChange} required />
                </div>
              </div>
            </div>
            <div className="button-group d-inline-flex align-items-center">
              <button type="submit" className="dash-btn-two tran3s rounded-3" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordArea;
