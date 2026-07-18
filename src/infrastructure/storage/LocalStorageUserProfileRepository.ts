import type { UserProfile } from "@/domain/entities/UserProfile";
import type { UserProfileRepository } from "@/domain/ports/UserProfileRepository";

const STORAGE_KEY = "companion:profile:v1";

export class LocalStorageUserProfileRepository implements UserProfileRepository {
  async load(): Promise<UserProfile | null> {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  async save(profile: UserProfile): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
