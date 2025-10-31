"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        //distructure values from form
        const { name, email, password } = values;

        //create user with email and password - registers a new user in firebase auth system. it is concerned with authentication only.
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        //call signUp action to create user in firestore database. it is concerned with storing user data.
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message || "Failed to create an account");
          return;
        }

        toast.success("Accout created successfully, Please sign in");
        router.push("/sign-in");
        console.log("SIGN-UP:", values);
      } else {
        const { email, password } = values;

        // Sign in user with email and password using firebase auth.
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Get the ID token of the signed-in user.
        const idToken = await userCredential.user.getIdToken();

        if (!idToken) {
          toast.error("Failed to sign in");
          return;
        }

        await signIn({ email, idToken });

        toast.success("Sign in");
        router.push("/");
        console.log("SIGN-IN", values);
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";
  return (
    <div className="card-border lg:minw-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src={"/logo.svg"} alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Interview Prep</h2>
        </div>
        <h3>Practice job interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name={"name"}
                label="Name"
                type="text"
                placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name={"email"}
              label="Email"
              type="email"
              placeholder="Enter Your Email"
            />
            <FormField
              control={form.control}
              name={"password"}
              label="Password"
              type="password"
              placeholder="Enter Your Password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
