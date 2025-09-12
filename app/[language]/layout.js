import '@ant-design/v5-patch-for-react-19';
import TranslationProvider from "../translations/i18nProvider";
import "../globals.css";
import { cookies } from "next/headers";
import AntDesignProvider from "../utilities/AntDesignProvider";
import { ReduxProvider } from "../store/ReduxProvider";

export const metadata = {
  title: "AI Groupchat",
  description: "This is an AI groupchat application.",
};

export default async function RootLayout({ children }) {
  const locale = (await cookies()).get("NEXT_LOCALE")?.value;
  // const locale = pathname?.split('/')[3];
  // console.log("locale: ", locale)
  return (
    <html lang="en" className="font-cairo" dir={locale === "ar" ? "rtl" : "ltr"}>
      <body style={{ overflowX: "hidden" }}>
        <ReduxProvider>
          <TranslationProvider>
            <AntDesignProvider>
              {children}
            </AntDesignProvider>
          </TranslationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
