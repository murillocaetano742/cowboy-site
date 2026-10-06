import type { MouseEvent } from "react";
import type { KitQuantity } from "@/components/sites/bluue/data";
import { trackBeginCheckout } from "@/lib/quiz-tracking";

const pendingLinks = new WeakSet<HTMLAnchorElement>();

/** Keep native link semantics while allowing GA to flush before same-tab exit. */
export function handleCheckoutClick(event: MouseEvent<HTMLAnchorElement>, quantity: KitQuantity) {
  if (event.defaultPrevented) return;
  const anchor = event.currentTarget;
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey
    || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) {
    trackBeginCheckout(quantity);
    return;
  }

  event.preventDefault();
  if (pendingLinks.has(anchor)) return;
  pendingLinks.add(anchor);
  let destination: string | undefined;
  let ready = false;
  let navigated = false;
  const navigate = () => {
    if (!ready || destination === undefined || navigated) return;
    navigated = true;
    pendingLinks.delete(anchor);
    window.location.assign(destination);
  };

  // Let document-level Google/UTMify click listeners decorate the link first.
  // Capture this click's kit + fresh linker once, before any later kit changes.
  window.setTimeout(() => {
    destination = anchor.href;
    navigate();
  }, 0);
  trackBeginCheckout(quantity, () => {
    ready = true;
    navigate();
  });
}
