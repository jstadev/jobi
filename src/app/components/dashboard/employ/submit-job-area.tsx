"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardHeader from "../candidate/dashboard-header";
import StateSelect from "../candidate/state-select";
import CitySelect from "../candidate/city-select";
import CountrySelect from "../candidate/country-select";
import icon from "@/assets/dashboard/images/icon/icon_16.svg";
import NiceSelect from "@/ui/nice-select";
import { notifySuccess, notifyError } from "@/utils/toast";

type IProps = { setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>> }

const SubmitJobArea = ({ setIsOpenSidebar }: IProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", job_type: "Fulltime", salary_duration: "Monthly",
    salary_min: "", salary_max: "", experience: "Fresher", english_fluency: "Fluent",
    location: "", country: "", city: "", state: "",
    categories: [] as string[], tags: [] as string[], tagInput: "",
  });

  const set = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const addTag = (tag: string) => {
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag], tagInput: "" }));
    }
  };

  const removeTag = (tag: string) =>
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      notifyError("Title and description are required");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        job_type: form.job_type,
        salary_min: Number(form.salary_min) || 0,
        salary_max: Number(form.salary_max) || 0,
        salary_duration: form.salary_duration,
        experience: form.experience,
        english_fluency: form.english_fluency,
        location: form.location,
        country: form.country,
        city: form.city,
        state: form.state,
        categories: form.categories,
        tags: form.tags,
      }),
    });
    setLoading(false);
    if (res.ok) {
      notifySuccess("Job posted successfully!");
      router.push("/dashboard/employ-dashboard/jobs");
    } else {
      const data = await res.json();
      notifyError(data.error || "Failed to post job");
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <h2 className="main-title">Post a New Job</h2>

        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Job Details</h4>
          <div className="dash-input-wrapper mb-30">
            <label>Job Title*</label>
            <input type="text" placeholder="Ex: Product Designer" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="dash-input-wrapper mb-30">
            <label>Job Description*</label>
            <textarea className="size-lg" placeholder="Write about the job in details..." value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div className="row align-items-end">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label>Job Type</label>
                <NiceSelect
                  options={[
                    { value: "Fulltime", label: "Full time" },
                    { value: "Part time", label: "Part time" },
                    { value: "Freelance", label: "Freelance" },
                    { value: "Fixed-Price", label: "Fixed-Price" },
                    { value: "Internship", label: "Internship" },
                  ]}
                  defaultCurrent={0}
                  onChange={(item) => set("job_type", item.value)}
                  name="Job Type"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label>Experience Level</label>
                <NiceSelect
                  options={[
                    { value: "Fresher", label: "Fresher" },
                    { value: "Intermediate", label: "Intermediate" },
                    { value: "Expert", label: "Expert" },
                    { value: "Internship", label: "Internship" },
                    { value: "No-Experience", label: "No Experience" },
                  ]}
                  defaultCurrent={0}
                  onChange={(item) => set("experience", item.value)}
                  name="Experience"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="dash-input-wrapper mb-30">
                <label>Salary Duration</label>
                <NiceSelect
                  options={[
                    { value: "Monthly", label: "Monthly" },
                    { value: "Weekly", label: "Weekly" },
                    { value: "Hourly", label: "Hourly" },
                    { value: "Yearly", label: "Yearly" },
                  ]}
                  defaultCurrent={0}
                  onChange={(item) => set("salary_duration", item.value)}
                  name="Salary"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="dash-input-wrapper mb-30">
                <label>Min Salary</label>
                <input type="number" placeholder="Min" value={form.salary_min} onChange={(e) => set("salary_min", e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <div className="dash-input-wrapper mb-30">
                <label>Max Salary</label>
                <input type="number" placeholder="Max" value={form.salary_max} onChange={(e) => set("salary_max", e.target.value)} />
              </div>
            </div>
          </div>

          <h4 className="dash-title-three pt-50 lg-pt-30">Skills & Tags</h4>
          <div className="dash-input-wrapper mb-30">
            <label>Tags / Skills</label>
            <div className="d-flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Type a skill and press Enter"
                value={form.tagInput}
                onChange={(e) => set("tagInput", e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(form.tagInput.trim()); } }}
              />
              <button type="button" className="dash-btn-one" onClick={() => addTag(form.tagInput.trim())}>Add</button>
            </div>
            <div className="skill-input-data d-flex align-items-center flex-wrap">
              {form.tags.map((tag) => (
                <button key={tag} type="button" onClick={() => removeTag(tag)} className="me-2 mb-2">
                  {tag} <i className="bi bi-x ms-1"></i>
                </button>
              ))}
            </div>
          </div>

          <h4 className="dash-title-three pt-50 lg-pt-30">Address & Location</h4>
          <div className="row">
            <div className="col-12">
              <div className="dash-input-wrapper mb-25">
                <label>Location / Address*</label>
                <input type="text" placeholder="City, Country" value={form.location} onChange={(e) => set("location", e.target.value)} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="dash-input-wrapper mb-25">
                <label>Country*</label>
                <CountrySelect />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="dash-input-wrapper mb-25">
                <label>City*</label>
                <CitySelect />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="dash-input-wrapper mb-25">
                <label>State*</label>
                <StateSelect />
              </div>
            </div>
          </div>
        </div>

        <div className="button-group d-inline-flex align-items-center mt-30">
          <button onClick={handleSubmit} disabled={loading} className="dash-btn-two tran3s me-3">
            {loading ? "Posting..." : "Post Job"}
          </button>
          <button onClick={() => router.back()} className="dash-cancel-btn tran3s" type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitJobArea;
