import { redirect } from "next/navigation";

// Static job-details-v1 page redirects to the job listing
const JobDetailsV1Page = () => {
  redirect("/job-grid-v3");
};

export default JobDetailsV1Page;
