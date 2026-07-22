import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[75vh] w-full">
      <div className="signUpBody">
        <SignUp path="/sign-up" />
      </div>
    </div>
  );
}
