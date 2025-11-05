"use client";

import { useState } from 'react';
import Link from 'next/link';

// Función para scroll suave
const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

interface MenuItem {
    link?: { url: string };
    label?: string;
}

// Convert string URL to route
const asRoute = (url: string) => ({
    pathname: url
});

interface HamburgerMenuProps {
    items: MenuItem[];
    locale: string;
}

export default function HamburgerMenu({ items, locale }: HamburgerMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const other = locale === "en" ? "es" : "en";

    return (
        <div className="relative">
            {/* Menú horizontal para desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
                <Link 
                    href={`/${locale}`} 
                    className="text-white text-lg font-bold hover:text-gray-300 transition-all px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                    {locale === 'es' ? 'Inicio' : 'Home'}
                </Link>
                <button 
                    onClick={() => scrollToSection('plans')}
                    className="text-white text-lg font-bold hover:text-gray-300 transition-all px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 cursor-pointer"
                >
                    {locale === 'es' ? 'Servicios + Planes' : 'Services + Plans'}
                </button>
                <button 
                    onClick={() => scrollToSection('testimonials')}
                    className="text-white text-lg font-bold hover:text-gray-300 transition-all px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 cursor-pointer"
                >
                    {locale === 'es' ? 'Testimonios' : 'Testimonials'}
                </button>
                <Link 
                    href={`/${locale}/contact`} 
                    className="text-white text-lg font-bold hover:text-gray-300 transition-all px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                    {locale === 'es' ? 'Contacto' : 'Contact'}
                </Link>
                <Link 
                    href={`/${locale}/blog`} 
                    className="text-white text-lg font-bold hover:text-gray-300 transition-all px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                    {locale === 'es' ? 'Blog' : 'Blog'}
                </Link>
                <Link 
                    href={`/${locale}/faq`} 
                    className="text-white text-lg font-bold hover:text-gray-300 transition-all px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                    {locale === 'es' ? 'Preguntas frecuentes' : 'FAQ'}
                </Link>
                {items.map((item, i) => (
                    item.link?.url && (
                        <Link 
                            key={i} 
                            href={asRoute(item.link.url)}
                            className="text-white text-lg font-bold hover:text-gray-300 transition-all px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20"
                        >
                            {item.label}
                        </Link>
                    )
                ))}
                <Link 
                    href={`/${other}`} 
                    className="text-white text-lg font-bold hover:text-gray-300 transition-all px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                    {other.toUpperCase()}
                </Link>
            </nav>

            {/* Botón hamburguesa (solo móvil/tablet) */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
                aria-label="Toggle menu"
            >
                <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>

            {/* Menú desplegable */}
            <div 
                className={`lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'} fixed top-0 right-0 h-screen w-64 bg-black/50 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-50`}
            >
                <div className="flex flex-col p-8">
                    {/* Botón de cerrar */}
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="self-end mb-8 text-white"
                        aria-label="Close menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Enlaces del menú */}
                    <nav className="flex flex-col space-y-4">
                        <Link 
                            href={`/${locale}`} 
                            className="text-white text-lg hover:text-gray-300 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {locale === 'es' ? 'Inicio' : 'Home'}
                        </Link>
                        <button 
                            onClick={() => {
                                scrollToSection('plans');
                                setIsOpen(false);
                            }}
                            className="text-white text-lg hover:text-gray-300 transition-colors text-left"
                        >
                            {locale === 'es' ? 'Servicios + Planes' : 'Services + Plans'}
                        </button>
                        <button 
                            onClick={() => {
                                scrollToSection('testimonials');
                                setIsOpen(false);
                            }}
                            className="text-white text-lg hover:text-gray-300 transition-colors text-left"
                        >
                            {locale === 'es' ? 'Testimonios' : 'Testimonials'}
                        </button>
                        <Link 
                            href={`/${locale}/contact`} 
                            className="text-white text-lg hover:text-gray-300 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {locale === 'es' ? 'Contacto' : 'Contact'}
                        </Link>
                        <Link 
                            href={`/${locale}/blog`} 
                            className="text-white text-lg hover:text-gray-300 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {locale === 'es' ? 'Blog' : 'Blog'}
                        </Link>
                        <Link 
                            href={`/${locale}/faq`} 
                            className="text-white text-lg hover:text-gray-300 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {locale === 'es' ? 'Preguntas frecuentes' : 'FAQ'}
                        </Link>
                        {items.map((item, i) => (
                            item.link?.url && (
                                <Link 
                                    key={i} 
                                    href={asRoute(item.link.url)}
                                    className="text-white text-lg hover:text-gray-300 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            )
                        ))}
                        <Link 
                            href={`/${other}`} 
                            className="text-white text-lg hover:text-gray-300 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {other.toUpperCase()}
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Overlay para cerrar el menú al hacer clic fuera */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}