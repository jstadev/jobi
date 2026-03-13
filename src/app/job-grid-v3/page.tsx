import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Wrapper from '@/layouts/wrapper';
import Header from '@/layouts/headers/header';
import FooterOne from '@/layouts/footers/footer-one';
import JobBreadcrumb from '../components/jobs/breadcrumb/job-breadcrumb';
import JobGridV3Area from '../components/jobs/grid/job-grid-v3-area';
import JobPortalIntro from '../components/job-portal-intro/job-portal-intro';
import URLFilterSync from '../components/jobs/url-filter-sync';

export const metadata: Metadata = {
  title: "Browse Jobs",
};

const JobGridThreePage = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <Header />
        <Suspense fallback={null}>
          <URLFilterSync />
        </Suspense>
        <JobBreadcrumb />
        <JobGridV3Area itemsPerPage={9} />
        <JobPortalIntro top_border={true} />
        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default JobGridThreePage;
