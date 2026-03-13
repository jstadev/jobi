"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import shape_1 from '@/assets/images/shape/shape_01.svg';
import shape_2 from '@/assets/images/shape/shape_02.svg';
import main_img from '@/assets/images/assets/img_01.jpg';
import SearchForm from '../forms/search-form';

const HeroBanner = () => {
  const [jobCount, setJobCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/jobs?limit=1')
      .then(r => r.json())
      .then(d => setJobCount(d.total ?? 0))
      .catch(() => {});
  }, []);

  return (
    <div className="hero-banner-one position-relative">
      <div className="container">
        <div className="position-relative pt-200 md-pt-150 pb-150 xl-pb-120 md-pb-80">
          <div className="row">
            <div className="col-lg-6">
              <h1 className="wow fadeInUp" data-wow-delay="0.3s">
                Find & Hire <span>Top Talent on Jobi.</span>
              </h1>
              <p className="text-lg mt-40 md-mt-30 mb-50 md-mb-30 wow fadeInUp" data-wow-delay="0.4s"
                style={{ color: 'rgba(226,232,240,0.7)' }}>
                {jobCount !== null
                  ? `${jobCount.toLocaleString()} jobs available right now across all categories`
                  : 'Thousands of jobs available right now across all categories'}
              </p>
            </div>
          </div>

          <div className="position-relative">
            <div className="row">
              <div className="col-xl-9 col-lg-8">
                <div className="job-search-one position-relative me-xl-5 wow fadeInUp" data-wow-delay="0.5s">
                  <SearchForm />
                  <div className="mt-20 d-flex align-items-center gap-3 flex-wrap">
                    <span className="fw-500" style={{ color: 'rgba(226,232,240,0.5)' }}>Popular:</span>
                    {['Design', 'Developer', 'Marketing', 'Finance', 'Writing'].map(tag => (
                      <Link key={tag} href={`/job-grid-v3?search=${tag}`}
                        style={{ color: 'rgba(96,165,250,0.8)', fontSize: 14 }}
                        className="tran3s">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-50 d-flex gap-3 flex-wrap wow fadeInUp" data-wow-delay="0.6s">
            <Link href="/job-grid-v3" className="btn-one" style={{ padding: '14px 32px', fontSize: 16 }}>
              Browse All Jobs
            </Link>
            <Link href="/register" className="btn-two" style={{ padding: '14px 32px', fontSize: 16 }}>
              Post a Job
            </Link>
          </div>

          <div className="img-box">
            <Image src={shape_1} alt="shape" className="lazy-img shapes" />
            <Image src={main_img} alt="main-img" className="lazy-img main-img w-100" />
          </div>
        </div>
      </div>
      <Image src={shape_2} alt="shape" className="lazy-img shapes shape_01" />
    </div>
  );
};

export default HeroBanner;
