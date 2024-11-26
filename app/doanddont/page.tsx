"use client"

import Head from "next/head";
import Header from "@/components/Header";
import DoAndDont from "@/components/DoAndDont";
import FooterNavigation from "@/components/FooterNavigation";
import Image from "next/image";

export default function DoAndDontPage() {
  return (
    <div className="flex flex-col min-h-screen px-6 bg-white p-4 font-sans">
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
          style={{ marginTop: '-15px' }} 
        />
        <DoAndDont />
      </main>
      <FooterNavigation />
    </div>
  );
}
