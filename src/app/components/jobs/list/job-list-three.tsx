"use client";
import React, { useState, useEffect } from "react";
import FilterArea from "../filter/filter-area";
import Pagination from "@/ui/pagination";
import NiceSelect from "@/ui/nice-select";
import { useAppSelector } from "@/redux/hook";
import { IJobDB } from "@/types/job-db-type";
import JobGridItemDB from "../grid/job-grid-item-db";
import ListItemDB from "./list-item-db";

const JobListThree = ({ itemsPerPage, grid_style = false }: { itemsPerPage: number; grid_style?: boolean }) => {
  const { category, experience, job_type, location, tags } = useAppSelector((state) => state.filter);
  const [allJobs, setAllJobs] = useState<IJobDB[]>([]);
  const [filterItems, setFilterItems] = useState<IJobDB[]>([]);
  const [currentItems, setCurrentItems] = useState<IJobDB[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [jobViewType, setJobViewType] = useState(grid_style ? "grid" : "list");
  const [priceValue, setPriceValue] = useState([0, 10000]);
  const [sortValue, setSortValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs?limit=100")
      .then((r) => r.json())
      .then((data) => {
        setAllJobs(data.jobs || []);
        const maxSalary = (data.jobs || []).reduce((max: number, j: IJobDB) => Math.max(max, j.salary_max || 0), 0);
        setPriceValue([0, maxSalary || 10000]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = allJobs
      .filter((j) => (category.length ? category.some((c) => j.categories?.includes(c)) : true))
      .filter((j) => (experience.length ? experience.some((e) => j.experience?.toLowerCase() === e.toLowerCase()) : true))
      .filter((j) => (job_type ? j.job_type === job_type : true))
      .filter((j) => (location ? j.location?.toLowerCase().includes(location.toLowerCase()) : true))
      .filter((j) => (tags.length ? tags.some((t) => j.tags?.includes(t)) : true))
      .filter((j) => (j.salary_min ?? 0) >= priceValue[0] && (j.salary_max ?? 0) <= priceValue[1]);

    if (sortValue === "price-low-to-high") filtered = [...filtered].sort((a, b) => a.salary_min - b.salary_min);
    if (sortValue === "price-high-to-low") filtered = [...filtered].sort((a, b) => b.salary_min - a.salary_min);

    const endOffset = itemOffset + itemsPerPage;
    setFilterItems(filtered);
    setCurrentItems(filtered.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filtered.length / itemsPerPage));
  }, [allJobs, category, experience, job_type, location, tags, priceValue, sortValue, itemOffset, itemsPerPage]);

  const handlePageClick = (event: { selected: number }) => {
    setItemOffset((event.selected * itemsPerPage) % Math.max(filterItems.length, 1));
  };

  const maxPrice = allJobs.reduce((max, j) => Math.max(max, j.salary_max || 0), 0) || 10000;

  return (
    <section className="job-listing-three pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <button
              type="button"
              className="filter-btn w-100 pt-2 pb-2 h-auto fw-500 tran3s d-lg-none mb-40"
              data-bs-toggle="offcanvas"
              data-bs-target="#filteroffcanvas"
            >
              <i className="bi bi-funnel"></i> Filter
            </button>
            <FilterArea priceValue={priceValue} setPriceValue={setPriceValue} maxPrice={maxPrice} />
          </div>

          <div className="col-xl-9 col-lg-8">
            <div className="job-post-item-wrapper ms-xxl-5 ms-xl-3">
              <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
                <div className="total-job-found">
                  All <span className="text-dark">{filterItems.length}</span> jobs found
                </div>
                <div className="d-flex align-items-center">
                  <div className="short-filter d-flex align-items-center">
                    <div className="text-dark fw-500 me-2">Sort:</div>
                    <NiceSelect
                      options={[
                        { value: "", label: "Default" },
                        { value: "price-low-to-high", label: "Salary Low to High" },
                        { value: "price-high-to-low", label: "Salary High to Low" },
                      ]}
                      defaultCurrent={0}
                      onChange={(item) => setSortValue(item.value)}
                      name="Sort"
                    />
                  </div>
                  <button onClick={() => setJobViewType("list")} className={`style-changer-btn text-center rounded-circle tran3s ms-2 list-btn ${jobViewType === "grid" ? "active" : ""}`}>
                    <i className="bi bi-list"></i>
                  </button>
                  <button onClick={() => setJobViewType("grid")} className={`style-changer-btn text-center rounded-circle tran3s ms-2 grid-btn ${jobViewType === "list" ? "active" : ""}`}>
                    <i className="bi bi-grid"></i>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">Loading jobs...</div>
              ) : currentItems.length === 0 ? (
                <div className="text-center py-5">No jobs found.</div>
              ) : (
                <>
                  <div className={`accordion-box list-style ${jobViewType === "list" ? "show" : ""}`}>
                    {currentItems.map((job) => <ListItemDB key={job.id} item={job} />)}
                  </div>
                  <div className={`accordion-box grid-style ${jobViewType === "grid" ? "show" : ""}`}>
                    <div className="row">
                      {currentItems.map((job) => (
                        <div key={job.id} className="col-sm-6 mb-30">
                          <JobGridItemDB item={job} />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {currentItems.length > 0 && (
                <div className="pt-30 lg-pt-20 d-sm-flex align-items-center justify-content-between">
                  <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                    Showing <span className="text-dark fw-500">{itemOffset + 1}</span> to{" "}
                    <span className="text-dark fw-500">{Math.min(itemOffset + itemsPerPage, filterItems.length)}</span> of{" "}
                    <span className="text-dark fw-500">{filterItems.length}</span>
                  </p>
                  {filterItems.length > itemsPerPage && (
                    <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobListThree;
