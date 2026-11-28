import { useEffect } from "react";
import { externalUrlToOpen } from "@/lib/external-url";

type CapacitorBridge = {
  isNativePlatform?: () => boolean;
};

/**
 * On the Capacitor shell, http(s) links that leave the app open in the system
 * browser (SFSafariViewController / Custom Tabs) instead of the webview.
 * The hosted site has no Capacitor bridge, so this does nothing there and the
 * existing new-tab anchors keep working.
 */
export function NativeExternalLinks() {
  useEffect(() => {
    const bridge = (window as Window & { Capacitor?: CapacitorBridge }).Capacitor;
    if (!bridge?.isNativePlatform?.()) return;

    let remove = () => {};
    let cancelled = false;

    void import("@capacitor/browser").then(({ Browser }) => {
      if (cancelled) return;

      function onClick(event: MouseEvent) {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        const anchor = target.closest("a[href]");
        if (!(anchor instanceof HTMLAnchorElement)) return;
        const url = externalUrlToOpen(anchor.getAttribute("href") ?? "", window.location.href);
        if (!url) return;
        event.preventDefault();
        event.stopPropagation();
        void Browser.open({ url });
      }

      document.addEventListener("click", onClick, true);
      remove = () => document.removeEventListener("click", onClick, true);
    });

    return () => {
      cancelled = true;
      remove();
    };
  }, []);

  return null;
}
