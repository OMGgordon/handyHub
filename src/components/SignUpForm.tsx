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
  const router = useRouter();

  const handleNavigateToSignIn = () => {
    router.push("/auth");
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
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { userType, firstLogin: true },
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) {
      toast.error(error.message);
      setMessage(error.message);
      setShowDialog(true);

      console.log(error.message);
    } else {
      toast.success("Check your email to confirm your account.");
      setMessage("Check your email to confirm your account.");
      setShowDialog(true);
    }

    setEmail("");
    setPassword("");

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
          <CardDescription className="text-black">Create your account</CardDescription>
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
            </div>
            <RadioGroup
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
            </RadioGroup>
            <Button
              variant="default"
              className="w-full font-bold"
              onClick={handleSignUp}
              disabled={loading}
            >
              Continue
            </Button>
          </div>

          <div>
            <p className="text-sm">
              Already have an account?.
              <span
                className=" text-primary font-bold cursor-pointer hover:underline"
                onClick={handleNavigateToSignIn}
              >
                Sign In
              </span>
            </p>
          </div>
          <Separator />

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
            <AlertDialogDescription className="text-black">{message}</AlertDialogDescription>
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
