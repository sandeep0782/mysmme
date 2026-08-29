"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUser, logout, setIsEmailVerified } from "@/store/slice/userSlice";
import { useVerifyAuthMutation } from "../api/userApi";
import Spinner from "@/lib/Spinner";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
    const [verifyAuth, { isLoading }] = useVerifyAuthMutation();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    useEffect(() => {
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
            } finally {
                setIsCheckingAuth(false);
            }
        };

        if (!user && isLoggedIn) {
            checkAuth();
        } else {
            setIsCheckingAuth(false);
        }
    }, [verifyAuth, dispatch, user]);

    if (isLoading || isCheckingAuth) {
        return <Spinner />;
    }

    return <>{children}</>;
}