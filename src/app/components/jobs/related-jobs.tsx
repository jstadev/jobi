"use client";
import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import JobGridItemDB from "./grid/job-grid-item-db";
import { IJobDB } from "@/types/job-db-type";

const slider_setting = {
  dots: false,
  arrows: false,
  centerPadding: "0px",
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    { breakpoint: 992, settings: { slidesToShow: 2 } },
    { breakpoint: 768, settings: { slidesToShow: 1 } },
  ],
};

const RelatedJobs = ({ categories, excludeId }: { categories: string[]; excludeId?: string }) => {
  const [jobs, setJobs] = useState<IJobDB[]>([]);
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    fetch(`/api/jobs?category=${encodeURIComponent(categories[0])}&limit=6`)
      .then((r) => r.json())
      .then((d) => {
        const filtered = (d.jobs || []).filter((j: IJobDB) => j.id !== excludeId);
        setJobs(filtered.slice(0, 5));
      })
      .catch(() => {});
  }, [categories, excludeId]);

  if (jobs.length === 0) return null;

  return (
    <section className="related-job-section pt-90 lg-pt-70 pb-120 lg-pb-70">
      <div className="container">
        <div className="position-relative">
          <div className="title-three text-center text-md-start mb-55 lg-mb-40">
            <h2 className="main-font">Related Jobs</h2>
          </div>
          <Slider {...slider_setting} ref={sliderRef} className="related-job-slider">
            {jobs.map((j) => (
              <div key={j.id} className="item">
                <JobGridItemDB item={j} />
              </div>
            ))}
          </Slider>
          <ul className="slider-arrows slick-arrow-one color-two d-flex justify-content-center style-none sm-mt-20">
            <li onClick={() => sliderRef.current?.slickPrev()} className="prev_e slick-arrow">
              <i className="bi bi-arrow-left"></i>
            </li>
            <li onClick={() => sliderRef.current?.slickNext()} className="next_e slick-arrow">
              <i className="bi bi-arrow-right"></i>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RelatedJobs;
