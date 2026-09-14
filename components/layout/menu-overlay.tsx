"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/content/site.config";
import { useAppStore } from "@/lib/store";
import { getLenis } from "@/lib/hooks/use-lenis";
import { TransitionLink } from "@/components/layout/page-transition";
import { padIndex } from "@/lib/utils";

const links = [{ label: "Home", href: "/" }, ...siteConfig.nav];

const EASE_MENU = [0.76, 0, 0.24, 1] as const;

/**
 * Fullscreen menu overlay — slides down with a staggered link reveal.
 * Scroll is locked while open; ESC closes it.
 */
export function MenuOverlay() {
  const { menuOpen, setMenuOpen } = useAppStore();

  // Scroll lock + ESC to close
  useEffect(() => {
    const lenis = getLenis();
    if (menuOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.nav
          id="fullscreen-menu"
          aria-label="Main navigation"
          className="fixed inset-0 z-[90] flex flex-col justify-between overflow-y-auto overscroll-contain bg-surface pt-[max(6.5rem,calc(env(safe-area-inset-top)+5rem))] pb-[max(2.5rem,env(safe-area-inset-bottom))]"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [...EASE_MENU] }}
        >
          <motion.ul
            className="container-x flex flex-col gap-1"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: {
                transition: { staggerChildren: 0.07, delayChildren: 0.25 },
              },
              closed: {
                transition: { staggerChildren: 0.03, staggerDirection: -1 },
              },
            }}
          >
            {links.map((link, i) => (
              <li key={link.href} className="overflow-hidden">
                <motion.div
                  variants={{
                    open: {
                      y: 0,
                      transition: { duration: 0.7, ease: [...EASE_MENU] },
                    },
                    closed: {
                      y: "110%",
                      transition: { duration: 0.4, ease: [...EASE_MENU] },
                    },
                  }}
                >
                  <TransitionLink
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    data-cursor="hover"
                    className="group flex items-baseline gap-5 py-1"
                  >
                    <span className="text-label transition-colors group-hover:text-accent">
                      {padIndex(i)}
                    </span>
                    <span className="text-display font-display text-[clamp(2.2rem,10vw,6rem)] transition-all duration-300 group-hover:translate-x-3 group-hover:italic group-hover:text-accent">
                      {link.label}
                    </span>
                  </TransitionLink>
                </motion.div>
              </li>
            ))}
          </motion.ul>

          <motion.div
            className="container-x flex flex-wrap items-end justify-between gap-6 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <div>
              <p className="text-label mb-2">Get in touch</p>
              <a
                href={`mailto:${siteConfig.email}`}
                data-cursor="hover"
                className="link-underline text-foreground"
              >
                {siteConfig.email}
              </a>
            </div>
            <ul className="flex gap-6">
              {siteConfig.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="link-underline"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
