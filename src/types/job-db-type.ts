export interface IJobDB {
  id: string;
  title: string;
  job_type: string;
  created_at: string;
  experience: string;
  salary_min: number;
  salary_max: number;
  salary_duration: string;
  location: string;
  country?: string;
  city?: string;
  state?: string;
  categories: string[];
  tags: string[];
  english_fluency: string;
  description: string;
  is_active: boolean;
  deadline?: string;
  posted_by: string;
  company_id: string;
  companies?: {
    id: string;
    name: string;
    logo_url?: string;
    location?: string;
    description?: string;
    website?: string;
  };
}
