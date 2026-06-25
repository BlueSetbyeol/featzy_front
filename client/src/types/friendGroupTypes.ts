import type { FriendMember } from "./reservationTypes";

export type FriendGroup = {
  id: number;
  owner_id: number;
  name: string;
  /** Présent via withCount('members') sur l'index/show */
  members_count?: number;
  /** Présent via whenLoaded('members') sur show/syncMembers */
  members?: FriendMember[];
  created_at: string;
  updated_at: string;
};

export type StoreFriendGroupPayload = {
  name: string;
};

export type UpdateFriendGroupPayload = {
  name?: string;
};
