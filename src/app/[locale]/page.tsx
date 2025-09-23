import { getPageByUID } from "@/prismic/queries";
import SliceZone from "@/components/SliceZone";
import Image from "next/image";

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    try {
        const page = await getPageByUID(locale, "home");
        return (
            <div>
                {page.data.title && <h1 className="text-2xl font-semibold p-4">{page.data.title}</h1>}
                <SliceZone slices={page.data.slices || []} />
            </div>
        );
    } catch (e) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-8">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Logo */}
                    <div className="mb-8">
                        <Image 
                            src="/NavaPools_logo.png" 
                            alt="NavaPools" 
                            width={300} 
                            height={120}
                            className="mx-auto h-24 w-auto"
                        />
                    </div>
                    
                    {/* Under Construction Content */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-white mb-4">
                                {locale === 'es' ? 'Sitio en Construcción' : 'Under Construction'}
                            </h1>
                            <div className="w-24 h-1 bg-blue-400 mx-auto rounded-full"></div>
                        </div>
                        
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            {locale === 'es' 
                                ? 'Estamos trabajando duro para traerte algo increíble. Pronto estaremos listos para mostrarte nuestros servicios de piscinas.'
                                : 'We are working hard to bring you something amazing. Soon we will be ready to show you our pool services.'
                            }
                        </p>
                        
                        {/* Construction Icon */}
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full border-2 border-blue-400/30">
                                <svg className="w-10 h-10 text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="text-gray-400">
                            <p className="mb-2">
                                {locale === 'es' ? 'Mientras tanto, puedes contactarnos:' : 'In the meantime, you can contact us:'}
                            </p>
                            <div className="flex justify-center space-x-6 text-sm">
                                <a href={`/${locale}/contact`} className="text-blue-400 hover:text-blue-300 transition-colors">
                                    {locale === 'es' ? 'Contacto' : 'Contact'}
                                </a>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-500">
                                    {locale === 'es' ? 'Próximamente' : 'Coming Soon'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-8 text-gray-500 text-sm">
                        <p>© 2025 NavaPools. {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
                    </div>
                </div>
            </div>
        );
    }
}
