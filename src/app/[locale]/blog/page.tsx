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
        <main className="relative min-h-screen">
            {/* Background del HERO */}
            <PageBackground 
                background_image={heroBackground.background_image}
                video_url={heroBackground.video_url}
                mobile_video_url={heroBackground.mobile_video_url}
            />
            
            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto p-6 pt-28 md:pt-32">
                <h1 className="text-3xl font-bold mb-4 text-white">Blog</h1>
                <ul className="space-y-4">
                    {blogs.map((b: unknown) => {
                        const blog = b as Record<string, unknown> & { id?: string; uid?: string; title?: string; subtitle?: string; excerpt?: string };
                        return (
                            <li key={blog.id} className="border border-white/20 p-4 rounded bg-white/10 backdrop-blur-sm">
                                <Link href={`/${locale}/blog/${blog.uid}`} className="no-underline">
                                    <h2 className="text-xl font-semibold text-white">{blog.title}</h2>
                                    {blog.subtitle && <p className="text-sm text-gray-200">{blog.subtitle}</p>}
                                    {blog.excerpt && <p className="mt-2 text-gray-100">{blog.excerpt}</p>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </main>
    );
}
