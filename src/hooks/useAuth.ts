import { useMutation } from "@tanstack/react-query";
import API from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export const useLogin = () => {
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  return useMutation({
    mutationFn: async ({ email, password }: any) => {
      const { data } = await API.post("/users/login", { email, password });
      return data;
    },
    onSuccess: (data) => {
      setUserInfo(data);
    },
  });
};

export const useRegister = () => {
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  return useMutation({
    mutationFn: async ({ name, email, password }: any) => {
      const { data } = await API.post("/users", { name, email, password });
      return data;
    },
    onSuccess: (data) => {
      setUserInfo(data);
    },
  });
};
