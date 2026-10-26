export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserProfile {
  id: string;
  degree: string;
  branch: string;
  graduationYear: number | null;
  college: string;
  location: string;
  bio: string;
  skills: string[];
}

export interface CurrentUserResponse {
  user: CurrentUser;
  profile: UserProfile | null;
}
