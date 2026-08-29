"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import {
    CheckCircle, Eye, EyeOff, Loader2, Lock, Mail, User,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useForgotPasswordMutation, useLoginMutation, useRegisterMutation } from "@/store/api/userApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authStatus, toggleLoginDialog } from "@/store/slice/userSlice";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/store/api";

interface LoginProps {
    isLoginOpen: boolean;
    setIsLoginOpen: (open: boolean) => void;
}

interface LoginFormData {
    email: string;
    password: string;
}

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    agreeTerms: boolean;
}

interface ForgotPasswordFormData {
    email: string;
}

type AuthTab = "login" | "signup" | "forgot";

const AuthPage: React.FC<LoginProps> = ({ isLoginOpen, setIsLoginOpen }) => {
    const [currentTab, setCurrentTab] = useState<AuthTab>("login");
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [signupLoading, setSignupLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

    const [register] = useRegisterMutation()
    const [login] = useLoginMutation()
    const [forgotPassword] = useForgotPasswordMutation()
    const dispatch = useDispatch()
    const router = useRouter()

    /* =========================
         LOGIN FORM
      ========================= */

    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginError },
    } = useForm<LoginFormData>();

    /* =========================
         SIGNUP FORM
      ========================= */

    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        formState: { errors: signUpError },
    } = useForm<SignUpFormData>();

    /* =========================
         FORGOT PASSWORD FORM
      ========================= */

    const {
        register: registerForgotPassword,
        handleSubmit: handleForgotPasswordSubmit,
        formState: { errors: forgotPasswordError },
    } = useForm<ForgotPasswordFormData>();

    /* =========================
         LOGIN SUBMIT
      ========================= */

    const onLogin = async (data: LoginFormData) => {
        setLoginLoading(true);
        try {
            const result = await login(data).unwrap()
            if (result.success) {
                toast.success('User Login Successfull')
                dispatch(toggleLoginDialog())
                dispatch(authStatus())
                router.push('/')
                window.location.reload()
            }
        } catch (error: any) {
            // toast.error('email or password incorrect')
            console.log("LOGIN ERROR:", error);
            toast.error(
                error?.data?.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoginLoading(false);
        }
    };

    /* =========================
         SIGNUP SUBMIT
      ========================= */

    const onSignup = async (data: SignUpFormData) => {
        setSignupLoading(true);
        try {
            const { email, password, name } = data
            const result = await register(data).unwrap()
            if (result.success) {
                toast.success('Verification link sent to your register id successfully, please verify')
                dispatch(toggleLoginDialog())
                router.push('/')
            }
        }
        catch (error) {
            toast.error('Email already registered.')
        } finally {
            setSignupLoading(false);
        };
    }
    /* =========================
         FORGOT PASSWORD
      ========================= */

    const onForgotPassword = async (data: ForgotPasswordFormData) => {
        setForgotPasswordLoading(true);
        try {
            // API call here
            const result = await forgotPassword(data.email).unwrap()
            if (result.success) {
                toast.success('Password resent link sent successfully')
                setForgotPasswordSuccess(true);
            }
        } catch (error: any) {
            console.log("FORGOT PASSWORD ERROR:", error);
            if (error?.status === 429) {
                toast.error(
                    error?.data?.message ||
                    "Too many requests. Please wait a few minutes and try again."
                );
                return;
            }
            if (error?.status === 404) {
                toast.error(
                    error?.data?.message ||
                    "No account found with this email address."
                );
                return;
            }

            toast.error(
                error?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    /* =========================
         GOOGLE LOGIN
      ========================= */

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        dispatch(toggleLoginDialog())
        try {
            router.push(`${BASE_URL}/auth/google`)
            dispatch(authStatus())
            setTimeout(() => {
                toast.success('Google Login Success')
                setIsLoginOpen(false)
                router.push('/')
            }, 300)
        } finally {
            setGoogleLoading(false);
        }
    };

    /* =========================
         TAB CHANGE
      ========================= */

    const handleTabChange = (value: string) => {
        setCurrentTab(value as AuthTab);

        if (value !== "forgot") {
            setForgotPasswordSuccess(false);
        }
    };

    return (
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogContent className="p-6 sm:max-w-[425px] rounded-xs">
                {/* =========================
                    HEADER
                ========================= */}

                <DialogHeader>
                    <DialogTitle className="mb-6 flex flex-col items-center justify-center text-center">
                        <Image
                            src="/images/logo.webp"
                            alt="MYSMME Logo"
                            width={60}
                            height={60}
                            className="mb-3 object-contain"
                        />

                        <span className="text-2xl font-bold text-gray-900">
                            Welcome to <span className="text-red-600">MYSMME</span>
                        </span>
                    </DialogTitle>
                </DialogHeader>

                {/* =========================
                    TABS
                ========================= */}

                <Tabs value={currentTab} onValueChange={handleTabChange}>
                    <TabsList className="mb-6 grid w-full grid-cols-3 rounded-xs">
                        <TabsTrigger value="login" className="rounded-xs">Login</TabsTrigger>
                        <TabsTrigger value="signup" className="rounded-xs">Sign Up</TabsTrigger>
                        <TabsTrigger value="forgot" className="rounded-xs">Forgot Password</TabsTrigger>
                    </TabsList>

                    {/* =========================
                        LOGIN
                    ========================= */}

                    {currentTab === "login" && (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, y: 10, }}
                            animate={{ opacity: 1, y: 0, }}
                            transition={{ duration: 0.25, }}
                        >
                            <TabsContent value="login" forceMount className="mt-0 space-y-4">
                                <form
                                    onSubmit={handleLoginSubmit(onLogin)}
                                    className="space-y-4"
                                >
                                    {/* Email */}

                                    <div className="relative">
                                        <Input
                                            {...registerLogin("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^\S+@\S+\.\S+$/,
                                                    message: "Please enter a valid email",
                                                },
                                            })}
                                            placeholder="Email"
                                            type="email"
                                            className="h-11 border-gray-300 pl-10 focus:border-red-500 focus-visible:border-red-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xs"
                                        />

                                        <Mail
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            size={20}
                                        />
                                    </div>

                                    {loginError.email && (
                                        <p className="text-sm text-red-500">
                                            {loginError.email.message}
                                        </p>
                                    )}

                                    {/* Password */}

                                    <div className="relative">
                                        <Input
                                            {...registerLogin("password", {
                                                required: "Password is required",
                                            })}
                                            placeholder="Password"
                                            type={showLoginPassword ? "text" : "password"}
                                            className="h-11 border-gray-300 pl-10 pr-10 focus:border-red-500 focus-visible:border-red-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xs"
                                        />

                                        <Lock
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            size={20}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowLoginPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                                        >
                                            {showLoginPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>

                                    {loginError.password && (
                                        <p className="text-sm text-red-500">
                                            {loginError.password.message}
                                        </p>
                                    )}

                                    {/* Login Button */}

                                    <Button
                                        type="submit"
                                        disabled={loginLoading}
                                        className="h-11 w-full cursor-pointer font-bold rounded-xs bg-red-600 hover:bg-red-700"
                                    >
                                        {loginLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Logging in...
                                            </>
                                        ) : (
                                            "Login"
                                        )}
                                    </Button>
                                </form>

                                {/* OR */}

                                <div className="my-4 flex items-center">
                                    <div className="h-px flex-1 bg-gray-300" />

                                    <p className="mx-2 text-sm text-gray-500">Or</p>

                                    <div className="h-px flex-1 bg-gray-300" />
                                </div>

                                {/* Google */}

                                <Button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={googleLoading}
                                    className="h-11 flex w-full items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 rounded-xs"
                                >
                                    {googleLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Login with Google...
                                        </>
                                    ) : (
                                        <>
                                            <Image
                                                src="/icons/google.svg"
                                                alt="Google"
                                                width={20}
                                                height={20}
                                            />
                                            Login with Google
                                        </>
                                    )}
                                </Button>
                            </TabsContent>
                        </motion.div>
                    )}

                    {/* =========================
                        SIGN UP
                    ========================= */}

                    {currentTab === "signup" && (
                        <motion.div
                            key="signup" initial={{ opacity: 0, y: 10, }}
                            animate={{ opacity: 1, y: 0, }}
                            transition={{ duration: 0.25, }}
                        >
                            <TabsContent value="signup" forceMount className="mt-0 space-y-4">
                                <form
                                    onSubmit={handleSignupSubmit(onSignup)}
                                    className="space-y-4"
                                >
                                    {/* Name */}

                                    <div className="relative">
                                        <Input
                                            {...registerSignup("name", {
                                                required: "Name is required",
                                            })}
                                            placeholder="Name"
                                            type="text"
                                            className="h-11 border-gray-300 pl-10 focus:border-red-500 focus-visible:border-red-500 focus-visible:ring-0 rounded-xs "
                                        />
                                        <User
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            size={20}
                                        />
                                    </div>

                                    {signUpError.name && (
                                        <p className="text-sm text-red-500">
                                            {signUpError.name.message}
                                        </p>
                                    )}

                                    {/* Email */}

                                    <div className="relative">
                                        <Input
                                            {...registerSignup("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^\S+@\S+\.\S+$/,
                                                    message: "Please enter a valid email",
                                                },
                                            })}
                                            placeholder="Email"
                                            type="email"
                                            className="h-11 border-gray-300 pl-10 focus:border-red-500 focus-visible:border-red-500 focus-visible:ring-0 rounded-xs"
                                        />

                                        <Mail
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            size={20}
                                        />
                                    </div>

                                    {signUpError.email && (
                                        <p className="text-sm text-red-500">
                                            {signUpError.email.message}
                                        </p>
                                    )}

                                    {/* Password */}

                                    <div className="relative">
                                        <Input
                                            {...registerSignup("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters",
                                                },
                                            })}
                                            placeholder="Password"
                                            type={showSignupPassword ? "text" : "password"}
                                            className="h-11 border-gray-300 pl-10 pr-10 focus:border-red-500 focus-visible:border-red-500 focus-visible:ring-0 rounded-xs"
                                        />

                                        <Lock
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            size={20}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowSignupPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                                        >
                                            {showSignupPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>

                                    {signUpError.password && (
                                        <p className="text-sm text-red-500">
                                            {signUpError.password.message}
                                        </p>
                                    )}

                                    {/* Terms */}

                                    <div>
                                        <label className="flex cursor-pointer items-center text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                {...registerSignup("agreeTerms", {
                                                    required: "You must agree to terms and conditions",
                                                })}
                                                className="mr-2 h-4 w-4 cursor-pointer accent-red-500 "
                                            />

                                            <span>
                                                I agree to the{" "}
                                                <span className="font-medium text-red-600">
                                                    Terms & Conditions
                                                </span>
                                            </span>
                                        </label>

                                        {signUpError.agreeTerms && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {signUpError.agreeTerms.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Signup */}

                                    <Button
                                        type="submit"
                                        disabled={signupLoading}
                                        className="h-11 w-full cursor-pointer font-bold rounded-xs bg-red-600 hover:bg-red-700"
                                    >
                                        {signupLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            "Sign Up"
                                        )}
                                    </Button>
                                </form>

                                <div className="my-4 flex items-center">
                                    <div className="h-px flex-1 bg-gray-300" />

                                    <p className="mx-2 text-sm text-gray-500">Or</p>

                                    <div className="h-px flex-1 bg-gray-300" />
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={googleLoading}
                                    className="h-11 flex w-full items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 rounded-xs"
                                >
                                    <Image
                                        src="/icons/google.svg"
                                        alt="Google"
                                        width={20}
                                        height={20}
                                    />
                                    Sign Up with Google
                                </Button>
                            </TabsContent>
                        </motion.div>
                    )}

                    {/* =========================
                        FORGOT PASSWORD
                    ========================= */}

                    {currentTab === "forgot" && (
                        <motion.div
                            key="forgot"
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                        >
                            <TabsContent value="forgot" forceMount className="mt-0 space-y-4">
                                {!forgotPasswordSuccess ? (
                                    <form
                                        onSubmit={handleForgotPasswordSubmit(onForgotPassword)}
                                        className="space-y-4"
                                    >
                                        <div className="relative">
                                            <Input
                                                {...registerForgotPassword("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^\S+@\S+\.\S+$/,
                                                        message: "Please enter a valid email",
                                                    },
                                                })}
                                                placeholder="Email"
                                                type="email"
                                                className="h-11 border-gray-300 pl-10 focus:border-red-500 focus-visible:border-red-500 focus-visible:ring-0 rounded-xs"
                                            />

                                            <Mail
                                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                                size={20}
                                            />
                                        </div>

                                        {forgotPasswordError.email && (
                                            <p className="text-sm text-red-500">
                                                {forgotPasswordError.email.message}
                                            </p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={forgotPasswordLoading}
                                            className="h-11 w-full cursor-pointer font-bold rounded-xs bg-red-600 hover:bg-red-700"
                                        >
                                            {forgotPasswordLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send Reset Link"
                                            )}
                                        </Button>
                                    </form>
                                ) : (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            duration: 0.3,
                                        }}
                                        className="space-y-4 text-center"
                                    >
                                        <CheckCircle className="mx-auto h-16 w-16 text-green-600" />

                                        <h3 className="text-xl font-semibold text-gray-700">
                                            Reset Link Sent
                                        </h3>

                                        <p className="text-sm leading-6 text-gray-500">
                                            We have sent a password reset link to your registered
                                            email address. Please check your inbox and follow the
                                            instructions to reset your password.
                                        </p>

                                        <Button
                                            type="button"
                                            onClick={() => setForgotPasswordSuccess(false)}
                                            className="h-11 w-full bg-red-600 hover:bg-red-700 rounded-xs cursor-pointer"
                                        >
                                            Send Another Link
                                        </Button>
                                    </motion.div>
                                )}
                            </TabsContent>
                        </motion.div>
                    )}
                </Tabs>
                <p className="text-sm text-center mt-2 text-gray-600">
                    By Clicking "agree", you agree to our {" "}
                    <Link href='/terms' className="text-blue-500 hover:underline">Terms of Use</Link>
                    , and {" "}
                    <Link href='' className="text-blue-500 hover:underline">Privacy Policy</Link>
                </p>
            </DialogContent>
        </Dialog>
    );
};

export default AuthPage;
