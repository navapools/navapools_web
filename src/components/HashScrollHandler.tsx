"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HashScrollHandler() {
    const pathname = usePathname();

    useEffect(() => {
        // Esperar un poco para que el contenido se renderice
        const timer = setTimeout(() => {
            const hash = window.location.hash;
            if (hash) {
                const id = hash.substring(1); // Remover el #
                const element = document.getElementById(id);
                if (element) {
                    // Scroll suave a la sección
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}

