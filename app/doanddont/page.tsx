"use client"

import Head from "next/head";
import Header from "@/components/Header";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import DoAndDont from "@/components/DoAndDont";
import FooterNavigation from "@/components/FooterNavigation";
import Image from "next/image";

export default function DoAndDontPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Do's and Don'ts | VitalBite</title>
        <meta name="description" content="A guide of do's and don'ts based on users diet needs." />
      </Head>
      <Header />
      <main className="flex-grow flex flex-col items-center">
        <img
          src="/images/avocado.png"
          alt="avocado image"
          className="w-60 h-60 mb-0"
        />
        <DoAndDont />
      </main>
      {/* <DisclaimerFooter /> */}
      <FooterNavigation />
    </div>
  );
}
