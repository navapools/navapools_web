import { getAllBlogs } from '@/prismic/queries';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import { getHeroBackgroundData } from '@/prismic/heroBackground';

export const revalidate = 60; // cache for 60s

export default async function BlogListPage(props: unknown) {
    const { params } = props as { params: Promise<{ locale: string }> };
    const { locale } = await params;
    const blogsRaw = await getAllBlogs(locale) as unknown[];
    const blogs = blogsRaw || [];
    
    // Obtener el background del HERO
    const heroBackground = await getHeroBackgroundData(locale);

    return (
                <main className="relative h-[calc(100vh-64px)]">
            {/* Background del HERO */}
            <PageBackground 
                background_image={heroBackground.background_image}
                video_url={heroBackground.video_url}
                mobile_video_url={heroBackground.mobile_video_url}
            />
            
            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 h-full flex flex-col justify-center">
                <div className="py-8">
                    <h1 className="text-4xl font-bold mb-8 text-white">Blog</h1>
                    <ul className="space-y-6">
                        {blogs.map((b: unknown) => {
                            const blog = b as Record<string, unknown> & { id?: string; uid?: string; title?: string; subtitle?: string; excerpt?: string };
                            return (
                                <li key={blog.id} className="border border-white/20 p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors">
                                    <Link href={`/${locale}/blog/${blog.uid}`} className="no-underline block">
                                        <h2 className="text-2xl font-semibold text-white mb-2">{blog.title}</h2>
                                        {blog.subtitle && <p className="text-base text-gray-200 mb-2">{blog.subtitle}</p>}
                                        {blog.excerpt && <p className="text-gray-100">{blog.excerpt}</p>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </main>
    );
}
