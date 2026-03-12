"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import DashboardHeader from "./dashboard-header";
import { notifySuccess, notifyError } from "@/utils/toast";

type IProps = { setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>> }

const SavedJobArea = ({ setIsOpenSidebar }: IProps) => {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = () => {
    fetch("/api/saved-jobs")
      .then((r) => r.json())
      .then((data) => { setSavedJobs(data.saved_jobs || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchSaved(); }, []);

  const handleUnsave = async (jobId: string) => {
    const res = await fetch("/api/saved-jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: jobId }),
    });
    if (res.ok) { notifySuccess("Job removed from saved"); fetchSaved(); }
    else notifyError("Failed to remove job");
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        <div className="d-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">Saved Jobs</h2>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white card-box border-20 text-center py-5">
            <p className="text-muted mb-3">No saved jobs yet.</p>
            <Link href="/job-list-v1" className="btn-one">Browse Jobs</Link>
          </div>
        ) : (
          <div className="wrapper">
            {savedJobs.map((s: any) => {
              const j = s.jobs;
              if (!j) return null;
              return (
                <div key={s.id} className="job-list-one style-two position-relative mb-20">
                  <div className="row justify-content-between align-items-center">
                    <div className="col-xxl-3 col-lg-4">
                      <div className="job-title d-flex align-items-center">
                        <Link href={`/job-details-v1/${j.id}`} className="logo me-3">
                          {j.companies?.logo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={j.companies.logo_url} alt="logo" style={{ width: 45, height: 45, objectFit: "contain" }} />
                          ) : (
                            <div style={{ width: 45, height: 45, background: "#f0f0f0", borderRadius: 8 }} />
                          )}
                        </Link>
                        <Link href={`/job-details-v1/${j.id}`} className="title fw-500 tran3s">
                          {j.title}
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 ms-auto">
                      <span className={`job-duration fw-500 ${j.job_type === "Part time" ? "part-time" : ""}`}>
                        {j.job_type}
                      </span>
                      <div className="job-salary">
                        <span className="fw-500 text-dark">${j.salary_min}</span>
                        {j.salary_max > 0 && <span>–${j.salary_max}</span>} / {j.salary_duration}
                      </div>
                    </div>
                    <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6 ms-auto xs-mt-10">
                      <div className="job-location">{j.location}</div>
                      <div className="job-category">
                        {j.categories?.slice(0, 2).join(", ")}
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4">
                      <div className="d-flex gap-2 float-end">
                        <Link href={`/job-details-v1/${j.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleUnsave(j.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobArea;
