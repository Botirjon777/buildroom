import { create } from "zustand";
import API from "@/lib/api";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthState {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : null,

  setUserInfo: (userInfo) => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("userInfo");
    }
    set({ userInfo });
  },

  logout: () => {
    localStorage.removeItem("userInfo");
    set({ userInfo: null });
  },
}));
