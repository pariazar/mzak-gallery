"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { siteConfig } from "@/content/site.config";
import { getLenis } from "@/lib/hooks/use-lenis";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const WIPE_EASE = [0.83, 0, 0.17, 1] as const;

interface TransitionContextValue {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
});

/**
 * Cinematic page transitions: a dark panel wipes up to cover the page,
 * the route changes underneath, then the panel wipes away.
 * Use `<TransitionLink>` for internal links to trigger it.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [covering, setCovering] = useState(false);
  const targetRef = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || reducedMotion) {
        router.push(href);
        return;
      }
      targetRef.current = href;
      setCovering(true);
    },
    [pathname, reducedMotion, router],
  );

  // Route changed while covered → jump to top and reveal the new page
  useEffect(() => {
    if (!targetRef.current) return;
    targetRef.current = null;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    setCovering(false);
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <TransitionContext.Provider value={{ navigate }}>
        {children}
        <AnimatePresence>
          {covering && (
            <motion.div
              key="page-wipe"
              className="fixed inset-0 z-[120] flex items-center justify-center bg-surface"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.55, ease: [...WIPE_EASE] }}
              onAnimationComplete={(definition) => {
                // Fires for both animate & exit — only push once covered
                if (
                  typeof definition === "object" &&
                  definition !== null &&
                  "y" in definition &&
                  definition.y === "0%" &&
                  targetRef.current
                ) {
                  router.push(targetRef.current);
                }
              }}
            >
              <motion.span
                className="font-display text-2xl italic tracking-wide text-foreground/80"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
              >
                {siteConfig.name}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </TransitionContext.Provider>
    </MotionConfig>
  );
}

type TransitionLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

/**
 * Drop-in replacement for next/link that plays the page wipe.
 * Keeps prefetching, middle-click, cmd-click and external URLs intact.
 */
export function TransitionLink({
  href,
  onClick,
  children,
  ...props
}: TransitionLinkProps) {
  const { navigate } = useContext(TransitionContext);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    const url = typeof href === "string" ? href : (href.pathname ?? "");
    const isInternal = url.startsWith("/") && !url.startsWith("//");
    const isPlainClick =
      e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
    if (!isInternal || !isPlainClick || e.defaultPrevented) return;
    e.preventDefault();
    navigate(url);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
