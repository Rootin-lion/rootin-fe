export interface AuthMember {
  id: number;
  email: string;
  imgUrl: string | null;
  nickname: string | null;
  ageGroup: string | null;
  interestFields: string[];
}

export interface AuthSession {
  newMember: boolean;
  member: AuthMember;
}

export interface AuthStore {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}
