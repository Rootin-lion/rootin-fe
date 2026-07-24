"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: string;
  duration?: number;
}

function parseValue(value: string) {
  const match = value.match(/^(.*?)(-?[\d,]+(?:\.\d+)?)(.*?)$/);

  if (!match) {
    return null;
  }

  const [, prefix, number, suffix] = match;
  const decimalPlaces = number.includes(".") ? number.split(".")[1].length : 0;

  return {
    prefix,
    target: Number(number.replaceAll(",", "")),
    suffix,
    decimalPlaces,
  };
}

export function AnimatedNumber({
  value,
  duration = 1400,
}: AnimatedNumberProps) {
  const parsedValue = useMemo(() => parseValue(value), [value]);
  const target = parsedValue?.target ?? 0;
  const [displayValue, setDisplayValue] = useState(0);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = numberRef.current;

    if (!element || !parsedValue) {
      return;
    }

    let animationFrameId: number | undefined;
    let observer: IntersectionObserver | undefined;

    const showFinalValue = () => {
      animationFrameId = window.requestAnimationFrame(() => {
        setDisplayValue(target);
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showFinalValue();
    } else {
      const startAnimation = () => {
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          setDisplayValue(target * easedProgress);

          if (progress < 1) {
            animationFrameId = window.requestAnimationFrame(animate);
          }
        };

        animationFrameId = window.requestAnimationFrame(animate);
      };

      let canStart = true;

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio >= 0.4 && canStart) {
            canStart = false;
            startAnimation();
          }

          if (!entry.isIntersecting) {
            canStart = true;

            if (animationFrameId !== undefined) {
              window.cancelAnimationFrame(animationFrameId);
            }

            setDisplayValue(0);
          }
        },
        { threshold: [0, 0.4] },
      );

      observer.observe(element);
    }

    return () => {
      observer?.disconnect();

      if (animationFrameId !== undefined) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [duration, parsedValue, target]);

  if (!parsedValue) {
    return value;
  }

  const formattedValue = displayValue.toLocaleString("ko-KR", {
    minimumFractionDigits: parsedValue.decimalPlaces,
    maximumFractionDigits: parsedValue.decimalPlaces,
  });

  return (
    <>
      <span ref={numberRef} aria-hidden="true">
        {parsedValue.prefix}
        {formattedValue}
        {parsedValue.suffix}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
