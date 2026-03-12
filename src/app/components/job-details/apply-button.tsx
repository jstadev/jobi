"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { notifySuccess, notifyError } from "@/utils/toast";
import { useRouter } from "next/navigation";

const ApplyButton = ({ jobId }: { jobId: string }) => {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    if (!user) { router.push("/register"); return; }
    if (profile?.role !== "candidate") {
      notifyError("Only candidates can apply for jobs");
      return;
    }
    setShowModal(true);
  };

  const submitApplication = async () => {
    setLoading(true);
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: jobId, cover_letter: coverLetter }),
    });
    setLoading(false);
    if (res.ok) {
      notifySuccess("Application submitted successfully!");
      setApplied(true);
      setShowModal(false);
    } else {
      const data = await res.json();
      notifyError(data.error || "Failed to apply");
    }
  };

  if (applied) {
    return <button className="btn-one w-100 mt-25" disabled>Applied ✓</button>;
  }

  return (
    <>
      <button className="btn-one w-100 mt-25" onClick={handleApply}>
        {!user ? "Login to Apply" : "Apply Now"}
      </button>

      {showModal && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h5 className="mb-3">Submit Application</h5>
              <div className="mb-3">
                <label className="form-label">Cover Letter (optional)</label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Tell the employer why you're a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2">
                <button className="btn-one flex-fill" onClick={submitApplication} disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
                <button className="btn btn-outline-secondary flex-fill" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplyButton;
