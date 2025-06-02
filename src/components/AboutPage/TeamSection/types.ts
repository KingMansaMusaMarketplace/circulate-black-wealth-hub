
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  avatarImage: string;
  extendedBio?: string;
  experience?: string[];
  education?: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
}
