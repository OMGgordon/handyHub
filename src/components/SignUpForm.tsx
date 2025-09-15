"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { supabase } from "@/lib/supabase";
import { Toaster } from "./ui/sonner";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"client" | "provider">("client");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleNavigateToSignIn = () => {
    router.push("/auth");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/landing-page",
      },
    });

    console.log(data);

    if (error) {
      console.error("Google Sign-in Error:", error.message);
    }
    setLoading(false);
  };

  //   const [session, setSession] = useState<any>(null);

  //   const fetchSession = async () => {
  //     const currentSession = await supabase.auth.getSession();
  //     setSession(currentSession.data.session);
  //   };

  //   useEffect(() => {
  //     fetchSession();
  //     const {
  //       data: { subscription },
  //     } = supabase.auth.onAuthStateChange((event, session) => {
  //       if (session) {
  //         router.push("/landing-page");
  //       }
  //     });

  //     return () => subscription.unsubscribe();
  //   }, []);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setMessage("Passwords do not match");
      setShowDialog(true);
      return;
    }

    // Optionally enforce password rules (length, characters, etc.)
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setMessage("Password must be at least 8 characters long");
      setShowDialog(true);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { userType: "client" },
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    console.log(data.user, "data.user");

    if (error) {
      toast.error(error.message);
      setMessage(error.message);
      setShowDialog(true);

      console.log(error.message);
    } else if (!data.user) {
      // This happens if email already exists or signup didn't succeed
      console.log("user already exists");
      toast.error("This email is already registered. Please sign in instead.");
      setMessage("This email is already registered. Please sign in instead.");
      setShowDialog(true);
    } else {
      toast.success("Check your email to confirm your account.");
      setMessage("Check your email to confirm your account.");
      setShowDialog(true);
    }

    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setLoading(false);

    // {
    //   session && router.push("/dashboard");
    // }
  };

  const [message, setMessage] = useState("");

  return (
    <>
      <Card className="w-full max-w-sm p-3 flex-shrink-0">
        <Toaster />
        <CardHeader>
          <CardTitle>
            <Image
              aria-hidden
              src="/Logo.png"
              alt="man smiling"
              width={150}
              height={500}
            />
          </CardTitle>
          <CardDescription className="text-black">
            Create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="space-y-1">
              <Input
                type="email"
                placeholder="Email Adress*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm Password*"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {/* <RadioGroup
              defaultValue="client"
              className="space-y-3"
              value={userType}
              onValueChange={(value) =>
                setUserType(value as "client" | "provider")
              }
            >
              <Label
                htmlFor="client"
                className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 data-[state=checked]:border-[var(--primary)] data-[state=checked]:bg-[color-mix(in oklch, var(--primary) 10%, white)] dark:data-[state=checked]:border-[var(--primary)] dark:data-[state=checked]:bg-[color-mix(in oklch, var(--primary) 10%, black)]"
              >
                <RadioGroupItem
                  value="client"
                  id="client"
                  className="mt-1 border-muted data-[state=checked]:border-[var(--primary)] data-[state=checked]:bg-[var(--primary)] data-[state=checked]:text-white dark:data-[state=checked]:border-[var(--primary)] dark:data-[state=checked]:bg-[var(--primary)]"
                />
                <div className="grid gap-1.5 font-normal">
                  <p className="text-sm leading-none font-medium">
                    Sign up as client
                  </p>
                  <p className="text-muted-foreground text-sm">
                    I need a service and trusted professionals to help with a
                    task.
                  </p>
                </div>
              </Label>

              <Label
                htmlFor="provider"
                className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 data-[state=checked]:border-[var(--primary)] data-[state=checked]:bg-[color-mix(in oklch, var(--primary) 10%, white)] dark:data-[state=checked]:border-[var(--primary)] dark:data-[state=checked]:bg-[color-mix(in oklch, var(--primary) 10%, black)]"
              >
                <RadioGroupItem
                  value="provider"
                  id="provider"
                  className="mt-1 border-muted data-[state=checked]:border-[var(--primary)] data-[state=checked]:bg-[var(--primary)] data-[state=checked]:text-white dark:data-[state=checked]:border-[var(--primary)] dark:data-[state=checked]:bg-[var(--primary)]"
                />
                <div className="grid gap-1.5 font-normal">
                  <p className="text-sm leading-none font-medium">
                    Sign up as Service provider
                  </p>
                  <p className="text-muted-foreground text-sm">
                    I’m a skilled professional looking to find jobs and grow my
                    client base.
                  </p>
                </div>
              </Label>
            </RadioGroup> */}
            <Button
              variant="default"
              className="w-full font-bold"
              onClick={handleSignUp}
              disabled={loading}
            >
              Continue
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              Have a HandyHive Account?.
              <span
                className=" text-primary font-bold cursor-pointer hover:underline"
                onClick={handleNavigateToSignIn}
              >
                Sign In
              </span>
            </p>
            <p
              className=" text-primary text-sm font-bold cursor-pointer hover:underline"
              onClick={()=>router.push("/signup-sp")}
            >
              Sign up as a handyman
            </p>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-white relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <Button
            variant={"outline"}
            className="bg-white w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 mr-2"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Continue with Google
          </Button>

          <div className=" space-y-6">
            <p className="text-xs">
              By submitting, I accept HandyHive&apos;s{" "}
              <span className="text-primary font-bold"> terms of use</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Almost there!</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowDialog(false)}>
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default SignUpForm;
