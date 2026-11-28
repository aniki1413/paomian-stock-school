import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { xGameBannerMeta } from "@/lib/og/share-host";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { NativeExternalLinks } from "@/lib/native-external-links";
import appCss from "../styles.css?url";

const APP_NAME = "泡麵家族股市小學堂";

export const Route = createRootRoute({
  head: () => {
    const xBanner = xGameBannerMeta();
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: APP_NAME },
        {
          name: "description",
          content: "給初學者與兒童的股市闖關：認識 K 棒、判斷成交量，再用假錢模擬交易。",
        },
        { name: "theme-color", content: "#F6D2AE" },
        ...(xBanner ? [xBanner] : []),
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "stylesheet", href: appCss },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap",
        },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      ],
    };
  },
  component: () => (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <NativeExternalLinks />
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
