"use client";

import React, { useEffect, useRef, useState } from "react";

type RevealDirection = "left" | "right" | "up" | "down" | "fade";

interface RevealProps {
    children: React.ReactNode;
    direction?: RevealDirection;
    delayMs?: number;
    className?: string;
    once?: boolean;
    /** Percentage of element visibility to trigger (0 - 1). */
    threshold?: number;
    /** Root margin for early/late triggering */
    rootMargin?: string;
}

export default function Reveal({
    children,
    direction = "fade",
    delayMs = 0,
    className = "",
    once = true,
    threshold = 0.15,
    rootMargin = "0px 0px -10% 0px"
}: RevealProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        if (once) observer.unobserve(entry.target);
                    } else if (!once) {
                        setIsVisible(false);
                    }
                });
            },
            { threshold, rootMargin }
        );

        observer.observe(element);
        return () => {
            observer.disconnect();
        };
    }, [once, threshold, rootMargin]);

    const directionClass =
        direction === "left"
            ? "reveal-left"
            : direction === "right"
            ? "reveal-right"
            : direction === "up"
            ? "reveal-up"
            : direction === "down"
            ? "reveal-down"
            : "reveal-fade";

    return (
        <div
            ref={ref}
            className={`reveal ${directionClass} ${isVisible ? "reveal-visible" : ""} ${className}`}
            style={{ transitionDelay: `${Math.max(0, delayMs)}ms` }}
        >
            {children}
        </div>
    );
}


