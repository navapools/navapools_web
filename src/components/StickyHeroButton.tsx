'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface StickyHeroButtonProps {
    text: string;
    href: string;
    className?: string;
}

export default function StickyHeroButton({ text, href, className = '' }: StickyHeroButtonProps) {
    const [isSticky, setIsSticky] = useState(false);
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const observer = new IntersectionObserver(
            ([entry]) => {
                // When the sentinel is NOT intersecting (scrolled past), we show sticky
                // We want sticky when the original button is out of view, or maybe when Hero is out of view.
                // Let's try: when the button itself scrolls out of view.
                setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
            },
            {
                threshold: 0,
                rootMargin: "100px 0px 0px 0px" // Adjust to trigger slightly after
            }
        );

        if (buttonRef.current) {
            observer.observe(buttonRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Base styles for the button
    // const baseStyles = "inline-block text-white font-semibold transition-all duration-300 text-center";

    // Original button styles: Use provided className or default to glassmorphism if none provided (backward compatibility)
    // But since we are passing the full className from the parent, we should rely on it.
    const finalOriginalStyles = className || `block w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-3 lg:py-4 rounded-lg text-base sm:text-lg border border-white/30`;

    // Sticky button styles (more prominent, solid background, shadow)
    // Position: Right side, 75% down (top-[75%] right-6 -translate-y-1/2)
    // Shadow: Stronger white shadow (shadow-[0_0_25px_rgba(255,255,255,0.6)])
    // Mobile: Icon only (min-w-0, padding adjusted)
    const stickyStyles = "fixed top-[75%] -translate-y-1/2 right-6 z-[9999] bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white p-4 sm:px-8 sm:py-4 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.6)] text-lg flex items-center gap-2 justify-center transition-all duration-300";

    return (
        <>
            {/* Sentinel / Original Position Placeholder */}
            <div ref={buttonRef} className="w-full sm:w-auto">
                <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    href={href as any}
                    className={`${finalOriginalStyles} ${isSticky ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    {text}
                </Link>
            </div>

            {/* Sticky Button Portal/Overlay */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isSticky && (
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className={stickyStyles}
                        >
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <Link href={href as any} className="flex items-center gap-2 w-full h-full justify-center">
                                {/* Icon on the Left */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 sm:w-5 sm:h-5 animate-pulse">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <span className="hidden sm:inline">{text}</span>
                            </Link>

                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20 pointer-events-none"></div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
