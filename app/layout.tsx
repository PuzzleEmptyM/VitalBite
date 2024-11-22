import "@/app/global.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vital Bite | Simple Food for Complex Needs",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={`antialiased  bg-[#ffff] text-black`}>{children}</body>
    </html>
  );
}
