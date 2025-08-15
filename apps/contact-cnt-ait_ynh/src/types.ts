export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  username: string;
}

export interface ShareResponse {
  shareCode: string;
  expiresAt: string;
  shareUrl: string;
}