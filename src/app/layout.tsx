import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: '3lismaeel - مصمم جرافيك',
  description: "مصمم جرافيك محترف متخصص في تصميم المطبوعات وتصاميم السوشيال ميديا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // التحقق مما إذا كان المسار الحالي هو صفحة إدارة
  const isAdminPage = children.props?.childProp?.segment === 'admin';

  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        {!isAdminPage && <Header />}
        <main>{children}</main>
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}
