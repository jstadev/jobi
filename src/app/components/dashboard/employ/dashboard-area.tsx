"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import icon_1 from "@/assets/dashboard/images/icon/icon_12.svg";
import icon_2 from "@/assets/dashboard/images/icon/icon_13.svg";
import icon_3 from "@/assets/dashboard/images/icon/icon_14.svg";
import icon_4 from "@/assets/dashboard/images/icon/icon_15.svg";
import main_graph from "@/assets/dashboard/images/main-graph.png";
import DashboardHeader from "../candidate/dashboard-header";
import { CardItem } from "../candidate/dashboard-area";
import NiceSelect from "@/ui/nice-select";
import Link from "next/link";

type IProps = { setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>> }

const EmployDashboardArea = ({ setIsOpenSidebar }: IProps) => {
  const [stats, setStats] = useState({ jobs: 0, applications: 0, shortlisted: 0 });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/jobs?limit=6")
      .then((r) => r.json())
      .then((data) => {
        setRecentJobs(data.jobs || []);
        setStats((prev) => ({ ...prev, jobs: data.total || 0 }));
      })
      .catch(() => {});

    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => {
        const apps = data.applications || [];
        setStats((prev) => ({
          ...prev,
          applications: apps.length,
          shortlisted: apps.filter((a: any) => a.status === "shortlisted").length,
        }));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        <h2 className="main-title">Dashboard</h2>
        <div className="row">
          <CardItem img={icon_1} title="Posted Jobs" value={String(stats.jobs)} />
          <CardItem img={icon_2} title="Applications" value={String(stats.applications)} />
          <CardItem img={icon_3} title="Shortlisted" value={String(stats.shortlisted)} />
          <CardItem img={icon_4} title="Profile Views" value="—" />
        </div>

        <div className="row d-flex pt-50 lg-pt-10">
          <div className="col-xl-7 col-lg-6 d-flex flex-column">
            <div className="user-activity-chart bg-white border-20 mt-30 h-100">
              <h4 className="dash-title-two">Job Views</h4>
              <div className="ps-5 pe-5 mt-50">
                <Image src={main_graph} alt="main-graph" className="lazy-img m-auto" />
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-6 d-flex">
            <div className="recent-job-tab bg-white border-20 mt-30 w-100">
              <h4 className="dash-title-two">Posted Jobs</h4>
              <div className="wrapper">
                {recentJobs.length === 0 ? (
                  <div className="text-center py-3">
                    <p className="text-muted mb-2">No jobs posted yet.</p>
                    <Link href="/dashboard/employ-dashboard/submit-job" className="btn-one">Post a Job</Link>
                  </div>
                ) : (
                  recentJobs.map((j: any) => (
                    <div key={j.id} className="job-item-list d-flex align-items-center">
                      <div className="job-title">
                        <h6 className="mb-5">{j.title}</h6>
                        <div className="meta">
                          <span>{j.job_type}</span> . <span>{j.location}</span>
                        </div>
                      </div>
                      <div className="job-action ms-auto">
                        <Link href="/dashboard/employ-dashboard/jobs" className="btn btn-sm btn-outline-secondary">
                          Manage
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployDashboardArea;
