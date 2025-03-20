import TranslationProvider from "../translations/i18nProvider";
import "../globals.css";
import { cookies } from "next/headers";

export const metadata = {
  title: "AI Groupchat",
  description: "This is an AI groupchat application.",
};

export default async function RootLayout({ children }) {
  const locale = (await cookies()).get("NEXT_LOCALE")?.value;
  // const locale = pathname?.split('/')[3];
  console.log("locale: ", locale)
  return (
    <html lang="en" className="font-cairo" dir={locale === "ar" ? "rtl": "ltr"}>
      <body style={{ overflowX: "hidden" }}>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
