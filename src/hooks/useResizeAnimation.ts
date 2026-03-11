import { useRef, useState, useEffect, useLayoutEffect } from 'react';

const DESKTOP_MQ = '(min-width: 640px)';

/**
 * Manages animated height transitions for a container that wraps dynamic content.
 * On desktop, the container's height is explicitly set and transitions smoothly
 * when the content resizes. On mobile, height is left to natural flow.
 *
 * @returns Refs to attach to the outer container and inner content div,
 *          plus an `isAnimating` flag to disable interactions during transitions.
 */
export function useResizeAnimation(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousHeight = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Set initial height synchronously on desktop
  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;
    if (!window.matchMedia(DESKTOP_MQ).matches) return;
    const contentHeight = content.offsetHeight;
    container.style.height = `${contentHeight}px`;
    previousHeight.current = contentHeight;
  }, [enabled]);

  // Animate height changes on desktop via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    if (!window.matchMedia(DESKTOP_MQ).matches) {
      container.style.height = '';
      previousHeight.current = 0;
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      const contentHeight = content.offsetHeight;
      if (previousHeight.current > 0 && Math.abs(contentHeight - previousHeight.current) > 1) {
        setIsAnimating(true);
      }
      container.style.height = `${contentHeight}px`;
      previousHeight.current = contentHeight;
    });
    resizeObserver.observe(content);
    return () => resizeObserver.disconnect();
  }, [enabled]);

  function handleTransitionEnd(event: React.TransitionEvent) {
    if (event.target === containerRef.current) {
      setIsAnimating(false);
    }
  }

  return { containerRef, contentRef, isAnimating, handleTransitionEnd };
}
