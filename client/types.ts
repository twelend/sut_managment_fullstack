export type DecodedToken = {
  subject: string;
};

export interface LoginResponse {
  data: {
    data: {
      token: string;
    };
  };
}

export interface ApplicationItem {
  id: number;
  contest: number;
  child_name: string;
  parent_name: string;
  email: string;
  phone: string;
  age: number;
  message: string;
  status: "new" | "accepted" | "rejected";
  appliedAt: string;
}

export interface ContestApiResponse {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
  newApplications: number;
  totalApplications: number;
}
export interface SubjectApiResponse {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
  newApplications: number;
  totalApplications: number;
  enrolled: number;
  capacity: number;
  status: "open" | "closed";
}

// для обратной совместимости (можно удалить если не нужно)
export type ApplicationsContestApiResponse = ApplicationItem;

// счетчики для вкладок
export interface ApplicationsCounts {
  all: number;
  new: number;
  accepted: number;
  rejected: number;
}

export interface ApplicationsApiResponse {
  counts: ApplicationsCounts;
  items: ApplicationItem[];
}

export interface RefbookTemplate {
  id: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface ITemplates {
  title: string;
  template: string;
}
