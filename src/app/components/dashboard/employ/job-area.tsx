"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from "../candidate/dashboard-header";
import Link from "next/link";
import { notifySuccess, notifyError } from "@/utils/toast";

type IProps = { setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>> }

const EmployJobArea = ({ setIsOpenSidebar }: IProps) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    fetch("/api/jobs?limit=50")
      .then((r) => r.json())
      .then((data) => { setJobs(data.jobs || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (res.ok) { notifySuccess("Job deleted"); fetchJobs(); }
    else notifyError("Failed to delete job");
  };

  const handleToggle = async (id: string, current: boolean) => {
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    if (res.ok) { notifySuccess("Job updated"); fetchJobs(); }
    else notifyError("Failed to update job");
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        <div className="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">My Jobs</h2>
          <Link href="/dashboard/employ-dashboard/submit-job" className="dash-btn-one">
            + Post New Job
          </Link>
        </div>

        <div className="bg-white card-box border-20">
          <div className="table-responsive">
            <table className="table job-alert-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Created</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="border-0">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No jobs posted yet. <Link href="/dashboard/employ-dashboard/submit-job">Post one now</Link>
                    </td>
                  </tr>
                ) : (
                  jobs.map((j) => (
                    <tr key={j.id}>
                      <td>
                        <div className="fw-500">{j.title}</div>
                        <div className="text-muted small">{j.location}</div>
                      </td>
                      <td>{new Date(j.created_at).toLocaleDateString()}</td>
                      <td>{j.job_type}</td>
                      <td>
                        <span className={`badge ${j.is_active ? "bg-success" : "bg-secondary"}`}>
                          {j.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleToggle(j.id, j.is_active)}>
                            {j.is_active ? "Deactivate" : "Activate"}
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(j.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployJobArea;
