import React from "react";
import { IJobDB } from "@/types/job-db-type";
import ApplyButton from "./apply-button";

const DEFAULT_LOGO = "/assets/images/logo/media_22.png";

const JobDetailsV1Area = ({ job }: { job: IJobDB }) => {
  const logoSrc = job.companies?.logo_url || DEFAULT_LOGO;
  const postedDate = new Date(job.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <section className="job-details pt-100 lg-pt-80 pb-130 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-xxl-9 col-xl-8">
            <div className="details-post-data me-xxl-5 pe-xxl-4">
              <div className="post-date">
                {postedDate} by{" "}
                <span className="fw-500" style={{ color: "#60A5FA" }}>
                  {job.companies?.name}
                </span>
              </div>
              <h3 className="post-title">{job.title}</h3>

              <div className="post-block border-style mt-50 lg-mt-30">
                <div className="d-flex align-items-center">
                  <div className="block-numb text-center fw-500 text-white rounded-circle me-2">1</div>
                  <h4 className="block-title">Job Description</h4>
                </div>
                <div style={{ whiteSpace: "pre-wrap" }}>{job.description}</div>
              </div>

              {job.tags && job.tags.length > 0 && (
                <div className="post-block border-style mt-40 lg-mt-30">
                  <div className="d-flex align-items-center">
                    <div className="block-numb text-center fw-500 text-white rounded-circle me-2">2</div>
                    <h4 className="block-title">Skills & Tags</h4>
                  </div>
                  <div className="job-tags d-flex flex-wrap pt-15">
                    {job.tags.map((t, i) => (
                      <span key={i} className="me-2 mb-2" style={{
                        background: "rgba(37,99,235,0.15)",
                        border: "1px solid rgba(37,99,235,0.3)",
                        borderRadius: 6,
                        padding: "4px 12px",
                        fontSize: 13,
                        color: "#93C5FD",
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.companies?.description && (
                <div className="post-block border-style mt-40 lg-mt-30">
                  <div className="d-flex align-items-center">
                    <div className="block-numb text-center fw-500 text-white rounded-circle me-2">3</div>
                    <h4 className="block-title">About {job.companies.name}</h4>
                  </div>
                  <p>{job.companies.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-xxl-3 col-xl-4">
            <div className="job-company-info ms-xl-5 ms-xxl-0 lg-mt-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="logo" className="lazy-img m-auto logo d-block"
                style={{ width: 60, height: 60, objectFit: "contain" }} />
              <div className="text-md text-center mt-15 mb-20 text-capitalize"
                style={{ color: "rgba(226,232,240,0.9)" }}>
                {job.companies?.name}
              </div>
              {job.companies?.website && (
                <a href={job.companies.website} target="_blank" rel="noreferrer"
                  className="website-btn tran3s d-block text-center">
                  Visit website
                </a>
              )}

              <div className="border-top mt-40 pt-40">
                <ul className="job-meta-data row style-none">
                  <li className="col-xl-7 col-md-4 col-sm-6">
                    <span>Salary</span>
                    <div>
                      ${job.salary_min.toLocaleString()}
                      {job.salary_max > 0 && `–$${job.salary_max.toLocaleString()}`}
                      {job.salary_duration && ` / ${job.salary_duration}`}
                    </div>
                  </li>
                  <li className="col-xl-5 col-md-4 col-sm-6">
                    <span>Job Type</span>
                    <div>{job.job_type}</div>
                  </li>
                  <li className="col-xl-7 col-md-4 col-sm-6">
                    <span>Location</span>
                    <div>{job.location}</div>
                  </li>
                  <li className="col-xl-5 col-md-4 col-sm-6">
                    <span>Experience</span>
                    <div>{job.experience}</div>
                  </li>
                  {job.deadline && (
                    <li className="col-xl-7 col-md-4 col-sm-6">
                      <span>Deadline</span>
                      <div>{new Date(job.deadline).toLocaleDateString()}</div>
                    </li>
                  )}
                  {job.categories && job.categories.length > 0 && (
                    <li className="col-12">
                      <span>Category</span>
                      <div>{job.categories.join(", ")}</div>
                    </li>
                  )}
                </ul>
                <ApplyButton jobId={job.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDetailsV1Area;
