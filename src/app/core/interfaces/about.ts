export interface SavePortfolioAboutPayload {
  name: string;
  title: string;
  bio: string;
  bio2?: string;
  profileImage?: string;
  resumeUrl?: string;
  stats: {
    experience: number;
    clients: number;
    recruiters: number;
  };
}
