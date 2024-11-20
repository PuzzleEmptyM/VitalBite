import Head from "next/head";
import InputField from "../../components/InputField";
import GetStartedButton from "../../components/GetStartedButton";
import ConditionSelector from "../../components/ConditionSelector";
import LogoHeader from "@/components/LogoHeader";
import DisclaimerFooter from "@/components/DisclaimerFooter";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <LogoHeader logoSrc="/images/vb_logo.png" altText="VB Logo" />

      <div className="w-11/12 max-w-md p-8 bg-white">
        <div className="flex flex-col items-center">
          

          {/* Welcome Text */}
          <h1 className="mt-4 text-4xl font-bold text-teal font-playfair text-justify pt-14">
            Welcome to <br /> <span className="text-justify pt-6 pl-6"> VitalBite </span>
          </h1>

          {/* Icon */}
          <img
            src="/images/salad.png"
            alt="VitalBite Logo"
            className="w-48 h-48 mt-4"
          />
        </div>

        {/* Form */}
        <form className="mt-6">
          <InputField type="text" placeholder="Full Name" />
          <InputField type="email" placeholder="Email" className="mt-4" />
          <InputField type="password" placeholder="Password" className="mt-4" />

          {/* Condition Selector */}
          <div className="flex items-center justify-center">
            <h2 className="relative w-52 h-16 text-center text-white bg-teal font-playfair py-2 px-4 rounded-full shadow-md">
              Please select your <br /> medical condition(s)
            </h2>
          </div>
          <ConditionSelector />

          {/* Get Started Button */}
          <GetStartedButton text="Get Started" />
        </form>

        {/* Footer */}
      <DisclaimerFooter />
      </div>
    </div>
  );
}
