import { Endpoints } from "@/lib/fetch";
import { useStorage } from "./storage-provider";
import { useEffect, useState } from "react";

export const useIsAuthenticated = () => {
  const $save = useStorage();

  const checkAuthentication = async () => {
    if ($save.token && $save.token.length > 0) {
      const isAuthenticated = await Endpoints.isAuthenticated($save.token);
      return isAuthenticated;
    }

    return false;
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    checkAuthentication().then(setIsAuthenticated);
  }, [$save.token]);

  return isAuthenticated;
};
