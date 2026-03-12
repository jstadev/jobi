"use client";
import React from "react";
import Link from "next/link";
import { IJobDB } from "@/types/job-db-type";
import { useAppDispatch } from "@/redux/hook";
import { add_to_wishlist } from "@/redux/features/wishlist";

const DEFAULT_LOGO = "/assets/images/logo/media_22.png";

const ListItemDB = ({ item }: { item: IJobDB }) => {
  const dispatch = useAppDispatch();
  const logoSrc = item.companies?.logo_url || DEFAULT_LOGO;

  return (
    <div className="job-list-one position-relative mb-20">
      <div className="row justify-content-between align-items-center">
        <div className="col-xxl-3 col-lg-4">
          <div className="job-title d-flex align-items-center">
            <Link href={`/job-details-v1/${item.id}`} className="logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="logo" style={{ width: 50, height: 50, objectFit: "contain" }} />
            </Link>
            <div>
              <Link href={`/job-details-v1/${item.id}`} className="title fw-500 tran3s">
                {item.title}
              </Link>
              <div className="company-name">{item.companies?.name}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6 ms-auto">
          <span className={`job-duration fw-500 ${item.job_type === "Part time" ? "part-time" : ""}`}>
            {item.job_type}
          </span>
          <div className="job-salary">
            <span className="fw-500 text-dark">${item.salary_min}</span>
            {item.salary_max > 0 && <span>–${item.salary_max}</span>} / {item.salary_duration}
          </div>
        </div>
        <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6 ms-auto xs-mt-10">
          <div className="job-location">
            <a href="#">{item.location}</a>
          </div>
          <div className="job-category">
            {item.categories?.slice(0, 2).map((c, i) => (
              <a key={i} href="#">{c}{i < Math.min(item.categories.length, 2) - 1 && ", "}</a>
            ))}
          </div>
        </div>
        <div className="col-lg-2 col-md-4">
          <div className="action-dots float-end">
            <button
              className="save-btn tran3s"
              onClick={() => dispatch(add_to_wishlist({ id: parseInt(item.id), title: item.title } as any))}
              title="Save Job"
            >
              <i className="bi bi-bookmark"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItemDB;
