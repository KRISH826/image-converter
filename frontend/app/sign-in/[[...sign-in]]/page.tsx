import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[75vh] w-full">
      <div className="signUpBody">
        <SignIn path="/sign-in" />
      </div>
    </div>
  );
}
