"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/content/site.config";
import { useAppStore } from "@/lib/store";
import { TransitionLink } from "@/components/layout/page-transition";
import { MenuOverlay } from "@/components/layout/menu-overlay";

/**
 * Fixed navbar: wordmark left, menu trigger right.
 * The real navigation lives in the fullscreen `<MenuOverlay>`.
 */
export function Navbar() {
  const { menuOpen, toggleMenu, setMenuOpen } = useAppStore();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] pt-[env(safe-area-inset-top)]">
        <div className="container-x flex h-16 items-center justify-between sm:h-20">
          <TransitionLink
            href="/"
            onClick={() => setMenuOpen(false)}
            data-cursor="hover"
            className="font-display text-xl italic tracking-wide text-foreground"
            aria-label={`${siteConfig.name} — home`}
          >
            {siteConfig.name}
          </TransitionLink>

          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="fullscreen-menu"
            data-cursor="hover"
            className="group flex items-center gap-3"
          >
            <span className="text-label text-foreground transition-colors group-hover:text-accent">
              {menuOpen ? "Close" : "Menu"}
            </span>
            <span className="relative flex h-4 w-7 flex-col justify-between">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="block h-px w-full bg-foreground"
              />
              <motion.span
                animate={{ opacity: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="block h-px w-full bg-foreground"
              />
              <motion.span
                animate={
                  menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="block h-px w-full bg-foreground"
              />
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay />
    </>
  );
}
