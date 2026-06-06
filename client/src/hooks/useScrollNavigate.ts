import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

const pageOrder = ["/", "/portfolio", "/about", "/contact"];

function getScrollableParent(): HTMLElement {
  return document.documentElement;
}

function isAtBottom(): boolean {
  const el = getScrollableParent();
  const scrollBottom = el.scrollTop + el.clientHeight;
  return scrollBottom >= el.scrollHeight - 20;
}

function isAtTop(): boolean {
  const el = getScrollableParent();
  return el.scrollTop <= 20;
}

export function useScrollNavigate() {
  const [location, navigate] = useLocation();
  const isTransitioning = useRef(false);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!pageOrder.includes(location)) return;

      const currentIndex = pageOrder.indexOf(location);
      if (currentIndex === -1) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 800) return;
      if (isTransitioning.current) return;

      const deltaY = e.deltaY;
      const threshold = 30;
      if (Math.abs(deltaY) < threshold) return;

      if (deltaY > 0) {
        // Scrolling down — go to next page only if at bottom
        if (currentIndex < pageOrder.length - 1 && isAtBottom()) {
          e.preventDefault();
          isTransitioning.current = true;
          lastScrollTime.current = now;
          navigate(pageOrder[currentIndex + 1]);
          window.scrollTo({ top: 0, behavior: "instant" });
          setTimeout(() => {
            isTransitioning.current = false;
          }, 800);
        }
      } else if (deltaY < 0) {
        // Scrolling up — go to previous page only if at top
        if (currentIndex > 0 && isAtTop()) {
          e.preventDefault();
          isTransitioning.current = true;
          lastScrollTime.current = now;
          navigate(pageOrder[currentIndex - 1]);
          window.scrollTo({ top: 0, behavior: "instant" });
          setTimeout(() => {
            isTransitioning.current = false;
          }, 800);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [location, navigate]);

  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!pageOrder.includes(location)) return;
      const currentIndex = pageOrder.indexOf(location);
      if (currentIndex === -1) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 800) return;
      if (isTransitioning.current) return;

      touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      const threshold = 50;
      if (Math.abs(diff) < threshold) return;

      if (diff > 0) {
        // Swiping up — next page only if at bottom
        if (currentIndex < pageOrder.length - 1 && isAtBottom()) {
          isTransitioning.current = true;
          lastScrollTime.current = now;
          navigate(pageOrder[currentIndex + 1]);
          window.scrollTo({ top: 0, behavior: "instant" });
          setTimeout(() => {
            isTransitioning.current = false;
          }, 800);
        }
      } else {
        // Swiping down — previous page only if at top
        if (currentIndex > 0 && isAtTop()) {
          isTransitioning.current = true;
          lastScrollTime.current = now;
          navigate(pageOrder[currentIndex - 1]);
          window.scrollTo({ top: 0, behavior: "instant" });
          setTimeout(() => {
            isTransitioning.current = false;
          }, 800);
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [location, navigate]);
}
