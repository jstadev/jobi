"use client";
import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import icon_1 from "@/assets/dashboard/images/icon/icon_12.svg";
import icon_2 from "@/assets/dashboard/images/icon/icon_13.svg";
import icon_3 from "@/assets/dashboard/images/icon/icon_14.svg";
import icon_4 from "@/assets/dashboard/images/icon/icon_15.svg";
import main_graph from "@/assets/dashboard/images/main-graph.png";
import DashboardHeader from "./dashboard-header";

export function CardItem({ img, value, title }: { img: StaticImageData; value: string; title: string }) {
  return (
    <div className="col-lg-3 col-6">
      <div className="dash-card-one bg-white border-30 position-relative mb-15">
        <div className="d-sm-flex align-items-center justify-content-between">
          <div className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
            <Image src={img} alt="icon" className="lazy-img" />
          </div>
          <div className="order-sm-0">
            <div className="value fw-500">{value}</div>
            <span>{title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type IProps = { setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>> }

const DashboardArea = ({ setIsOpenSidebar }: IProps) => {
  const [stats, setStats] = useState({ applied: 0, shortlisted: 0, saved: 0 });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((data) => {
        const apps = data.applications || [];
        setStats({
          applied: apps.length,
          shortlisted: apps.filter((a: any) => a.status === "shortlisted").length,
          saved: 0,
        });
        setRecentApplications(apps.slice(0, 5));
      })
      .catch(() => {});

    fetch("/api/saved-jobs")
      .then((r) => r.json())
      .then((data) => {
        setStats((prev) => ({ ...prev, saved: (data.saved_jobs || []).length }));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        <h2 className="main-title">Dashboard</h2>
        <div className="row">
          <CardItem img={icon_1} title="Applied Jobs" value={String(stats.applied)} />
          <CardItem img={icon_2} title="Shortlisted" value={String(stats.shortlisted)} />
          <CardItem img={icon_3} title="Saved Jobs" value={String(stats.saved)} />
          <CardItem img={icon_4} title="Profile Views" value="—" />
        </div>

        <div className="row d-flex pt-50 lg-pt-10">
          <div className="col-xl-7 col-lg-6 d-flex flex-column">
            <div className="user-activity-chart bg-white border-20 mt-30 h-100">
              <h4 className="dash-title-two">Profile Views</h4>
              <div className="ps-5 pe-5 mt-50">
                <Image src={main_graph} alt="main-graph" className="lazy-img m-auto" />
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-6 d-flex">
            <div className="recent-job-tab bg-white border-20 mt-30 w-100">
              <h4 className="dash-title-two">Recent Applied Jobs</h4>
              <div className="wrapper">
                {recentApplications.length === 0 ? (
                  <p className="text-center py-3 text-muted">No applications yet.</p>
                ) : (
                  recentApplications.map((a: any) => (
                    <div key={a.id} className="job-item-list d-flex align-items-center">
                      <div className="job-title">
                        <h6 className="mb-5">{a.jobs?.title || "Job"}</h6>
                        <div className="meta">
                          <span>{a.jobs?.job_type}</span> . <span>{a.jobs?.location}</span>
                        </div>
                      </div>
                      <div className="ms-auto">
                        <span className={`badge ${a.status === "shortlisted" ? "bg-success" : a.status === "rejected" ? "bg-danger" : "bg-secondary"}`}>
                          {a.status}
                        </span>
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

export default DashboardArea;
