"use client";
import React from "react";
import Link from "next/link";
import { IJobDB } from "@/types/job-db-type";

const DEFAULT_LOGO = "/assets/images/logo/media_22.png";

const JobGridItemDB = ({ item }: { item: IJobDB }) => {
  const logoSrc = item.companies?.logo_url || DEFAULT_LOGO;

  return (
    <div className="job-list-one position-relative">
      <div className="d-flex">
        <Link href={`/job-details-v1/${item.id}`} className="logo me-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="logo" style={{ width: 50, height: 50, objectFit: "contain" }} />
        </Link>
        <div>
          <Link href={`/job-details-v1/${item.id}`} className="title fw-500 tran3s d-block">
            {item.title}
          </Link>
          <div className="company-name">{item.companies?.name}</div>
        </div>
      </div>
      <div className="mt-15">
        <span className={`job-duration fw-500 me-2 ${item.job_type === "Part time" ? "part-time" : ""}`}>
          {item.job_type}
        </span>
        <span className="job-salary fw-500 text-dark">
          ${item.salary_min}{item.salary_max > 0 && `–$${item.salary_max}`} / {item.salary_duration}
        </span>
      </div>
      <div className="mt-5">
        <span className="job-location me-2"><i className="bi bi-geo-alt me-1"></i>{item.location}</span>
        {item.categories?.slice(0, 2).map((c, i) => (
          <span key={i} className="job-category me-1">{c}</span>
        ))}
      </div>
      <Link href={`/job-details-v1/${item.id}`} className="btn-one mt-15 d-block text-center">
        Apply Now
      </Link>
    </div>
  );
};

export default JobGridItemDB;
