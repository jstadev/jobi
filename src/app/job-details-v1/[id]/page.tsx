import React from "react";
import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/headers/header";
import JobDetailsV1Area from "@/app/components/job-details/job-details-v1-area";
import JobPortalIntro from "@/app/components/job-portal-intro/job-portal-intro";
import JobDetailsBreadcrumb from "@/app/components/jobs/breadcrumb/job-details-breadcrumb";
import RelatedJobs from "@/app/components/jobs/related-jobs";
import FooterOne from "@/layouts/footers/footer-one";
import { createClient } from "@/utils/supabase/server";

const JobDetailsDynamicPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { data: job } = await supabase
    .from("jobs")
    .select(`*, companies (id, name, logo_url, location, website, description)`)
    .eq("id", params.id)
    .single();

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <Header />
        <JobDetailsBreadcrumb />
        {job ? (
          <JobDetailsV1Area job={job} />
        ) : (
          <div className="container py-5 text-center" style={{ color: "rgba(226,232,240,0.5)" }}>
            Job not found.
          </div>
        )}
        {job && <RelatedJobs categories={job.categories || []} excludeId={job.id} />}
        <JobPortalIntro />
        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default JobDetailsDynamicPage;
