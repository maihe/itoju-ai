import type { UserProfile } from "../entities/UserProfile";

export interface UserProfileRepository {
  load(): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<void>;
  clear(): Promise<void>;
}
