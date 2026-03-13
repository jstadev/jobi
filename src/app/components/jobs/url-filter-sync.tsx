"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { setFilter } from "@/redux/features/filterSlice";

// Reads URL query params on mount and syncs them into Redux filter state.
// Allows the hero search form (which navigates with ?search=...&category=...) to pre-fill filters.
const URLFilterSync = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const location = searchParams.get("location") || "";
    const job_type = searchParams.get("job_type") || "";
    const experience = searchParams.get("experience") || "";

    dispatch(setFilter({
      search_key: search,
      category: category ? [category] : [],
      location,
      job_type,
      experience: experience ? [experience] : [],
    }));
  }, [searchParams, dispatch]);

  return null;
};

export default URLFilterSync;
