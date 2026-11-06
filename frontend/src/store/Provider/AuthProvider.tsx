"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUser, logout, setIsEmailVerified } from "@/store/slice/userSlice";
import { useVerifyAuthMutation } from "../api/userApi";
import Spinner from "@/lib/Spinner";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [verifyAuth, { isLoading }] = useVerifyAuthMutation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // A saved session exists but the user details haven't been loaded yet
  const needsCheck = isLoggedIn && !user;

  useEffect(() => {
    if (!needsCheck) return;

    const checkAuth = async () => {
      try {
        const response = await verifyAuth({}).unwrap();
        if (response.success) {
          dispatch(setUser(response.data));
          dispatch(setIsEmailVerified(response.data.isVerified));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        dispatch(logout());
      }
    };

    checkAuth();
  }, [needsCheck, verifyAuth, dispatch]);

  if (needsCheck || isLoading) {
    return <Spinner />;
  }

  return <>{children}</>;
}
