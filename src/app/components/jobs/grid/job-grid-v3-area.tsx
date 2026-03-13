"use client";
import React, { useState, useEffect, useCallback } from "react";
import { IJobDB } from "@/types/job-db-type";
import Pagination from "@/ui/pagination";
import JobGridItemDB from "./job-grid-item-db";
import ListItemDB from "../list/list-item-db";
import { useAppSelector } from "@/redux/hook";
import NiceSelect from "@/ui/nice-select";
import JobFilterModal from "../../common/popup/job-filter-modal";

const JobGridV3Area = ({ itemsPerPage }: { itemsPerPage: number }) => {
  const { category, experience, job_type, location, search_key } = useAppSelector(
    (state) => state.filter
  );

  const [jobs, setJobs] = useState<IJobDB[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [jobType, setJobType] = useState("grid");
  const [sortValue, setSortValue] = useState("");
  const [priceValue, setPriceValue] = useState([0, 300000]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("limit", String(itemsPerPage));
    params.set("page", String(page + 1));
    if (search_key) params.set("search", search_key);
    if (category.length > 0) params.set("category", category[0]);
    if (experience.length > 0) params.set("experience", experience[0]);
    if (job_type) params.set("job_type", job_type);
    if (location) params.set("location", location);
    if (sortValue === "price-low-to-high") params.set("sort", "salary_asc");
    if (sortValue === "price-high-to-low") params.set("sort", "salary_desc");
    params.set("salary_min", String(priceValue[0]));
    params.set("salary_max", String(priceValue[1]));

    try {
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage, search_key, category, experience, job_type, location, sortValue, priceValue]);

  useEffect(() => {
    setPage(0);
  }, [search_key, category, experience, job_type, location, sortValue, priceValue]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const pageCount = Math.ceil(total / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected);
  };

  const handleSort = (item: { value: string; label: string }) => {
    setSortValue(item.value);
  };

  return (
    <>
      <section className="job-listing-three bg-color pt-90 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="job-post-item-wrapper">
                <div className="upper-filter d-flex justify-content-between align-items-start align-items-md-center mb-25">
                  <div className="d-md-flex justify-content-between align-items-center">
                    <button
                      type="button"
                      className="filter-btn fw-500 tran3s me-3"
                      data-bs-toggle="modal"
                      data-bs-target="#filterPopUp"
                    >
                      <i className="bi bi-funnel"></i> Filter
                    </button>
                    <div className="total-job-found xs-mt-10">
                      All <span className="text-dark fw-500">{total}</span> jobs found
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="short-filter d-flex align-items-center">
                      <div className="text-dark fw-500 me-2">Sort:</div>
                      <NiceSelect
                        options={[
                          { value: "", label: "Default" },
                          { value: "price-low-to-high", label: "Salary: Low to High" },
                          { value: "price-high-to-low", label: "Salary: High to Low" },
                        ]}
                        defaultCurrent={0}
                        onChange={handleSort}
                        name="Sort"
                      />
                    </div>
                    <button
                      onClick={() => setJobType("list")}
                      className={`style-changer-btn text-center rounded-circle tran3s ms-2 list-btn ${jobType === "list" ? "active" : ""}`}
                      title="List View"
                    >
                      <i className="bi bi-list"></i>
                    </button>
                    <button
                      onClick={() => setJobType("grid")}
                      className={`style-changer-btn text-center rounded-circle tran3s ms-2 grid-btn ${jobType === "grid" ? "active" : ""}`}
                      title="Grid View"
                    >
                      <i className="bi bi-grid"></i>
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: "var(--blue, #2563EB)" }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-5" style={{ color: "rgba(226,232,240,0.5)" }}>
                    No jobs found matching your criteria.
                  </div>
                ) : (
                  <>
                    <div className={`accordion-box list-style ${jobType === "list" ? "show" : ""}`}>
                      {jobs.map((job) => (
                        <ListItemDB key={job.id} item={job} />
                      ))}
                    </div>

                    <div className={`accordion-box grid-style ${jobType === "grid" ? "show" : ""}`}>
                      <div className="row">
                        {jobs.map((job) => (
                          <div key={job.id} className="col-lg-4 col-md-6 mb-30">
                            <JobGridItemDB item={job} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {!loading && total > 0 && (
                  <div className="pt-30 lg-pt-20 d-sm-flex align-items-center justify-content-between">
                    <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                      Showing{" "}
                      <span className="text-dark fw-500">{page * itemsPerPage + 1}</span>{" "}
                      to{" "}
                      <span className="text-dark fw-500">
                        {Math.min((page + 1) * itemsPerPage, total)}
                      </span>{" "}
                      of{" "}
                      <span className="text-dark fw-500">{total}</span>
                    </p>
                    {pageCount > 1 && (
                      <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <JobFilterModal maxPrice={300000} priceValue={priceValue} setPriceValue={setPriceValue} />
    </>
  );
};

export default JobGridV3Area;
