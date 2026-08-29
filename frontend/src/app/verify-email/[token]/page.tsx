"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

import {
    authStatus,
    setIsEmailVerified,
} from "@/store/slice/userSlice";

import { useVerifyEmailMutation } from "@/store/api/userApi";

type VerificationStatus = "loading" | "success" | "error";

const EmailVerification: React.FC = () => {
    const { token } = useParams<{ token: string }>();

    const dispatch = useDispatch();

    const [verifyEmail] = useVerifyEmailMutation();

    // Prevent React StrictMode from making the verification request twice
    const hasVerified = useRef(false);

    const [verificationStatus, setVerificationStatus] =
        useState<VerificationStatus>("loading");

    useEffect(() => {
        if (!token || hasVerified.current) {
            return;
        }

        hasVerified.current = true;

        const verify = async () => {
            try {
                console.log("Verifying token:", token);

                const result = await verifyEmail(token).unwrap();

                console.log("Verification response:", result);

                if (result.success) {
                    // Update Redux
                    dispatch(setIsEmailVerified(true));
                    dispatch(authStatus());

                    // Update UI
                    setVerificationStatus("success");

                    toast.success("Email verified successfully!");

                    // Redirect after 3 seconds
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 3000);
                } else {
                    setVerificationStatus("error");

                    toast.error(
                        result.message || "Email verification failed"
                    );
                }
            } catch (error: unknown) {
                console.log(
                    "========== EMAIL VERIFICATION ERROR =========="
                );

                /*
                 * RTK Query error normally looks like:
                 *
                 * {
                 *   status: 400,
                 *   data: {
                 *     success: false,
                 *     message: "...",
                 *     data: null
                 *   }
                 * }
                 */

                let errorMessage =
                    "Unable to verify your email. Please try again.";

                if (typeof error === "object" && error !== null) {
                    const err = error as {
                        status?: unknown;
                        data?: unknown;
                        error?: unknown;
                    };

                    console.log("STATUS:", err.status);
                    console.log("DATA:", err.data);
                    console.log("ERROR:", err.error);

                    if (
                        typeof err.data === "object" &&
                        err.data !== null
                    ) {
                        const data = err.data as {
                            message?: string;
                            success?: boolean;
                        };

                        console.log("MESSAGE:", data.message);

                        if (data.message) {
                            errorMessage = data.message;
                        }
                    }
                }

                console.log(
                    "=============================================="
                );

                setVerificationStatus("error");

                toast.error(errorMessage);
            }
        };

        verify();
    }, [token, verifyEmail, dispatch]);

    const handleGoHome = () => {
        window.location.href = "/";
    };

    return (
        <div className="p-20 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
            >
                {/* ========================= */}
                {/* LOADING */}
                {/* ========================= */}

                {verificationStatus === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />

                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                            Verifying Your Email
                        </h2>

                        <p className="text-gray-500">
                            Please wait while we confirm your email address...
                        </p>
                    </div>
                )}

                {/* ========================= */}
                {/* SUCCESS */}
                {/* ========================= */}

                {verificationStatus === "success" && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 10,
                        }}
                    >
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />

                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                            Email Verified!
                        </h2>

                        <p className="text-gray-500 mb-6">
                            Your email has been successfully verified.
                            You&apos;ll be redirected to the homepage shortly.
                        </p>

                        <Button
                            onClick={handleGoHome}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Go to Homepage
                        </Button>
                    </motion.div>
                )}

                {/* ========================= */}
                {/* ERROR */}
                {/* ========================= */}

                {verificationStatus === "error" && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 10,
                        }}
                    >
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />

                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                            Verification Failed
                        </h2>

                        <p className="text-gray-500 mb-6">
                            The verification link is invalid or has expired.
                            Please request a new verification email.
                        </p>

                        <Button
                            onClick={handleGoHome}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Go to Homepage
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default EmailVerification;