import TranslationProvider from "../translations/i18nProvider";
import "../globals.css";

export const metadata = {
  title: "AI Groupchat",
  description: "This is an AI groupchat application.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-cairo">
      <body>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
