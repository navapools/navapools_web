import { getAllBlogs } from '@/prismic/queries';
import Link from 'next/link';

export const revalidate = 60; // cache for 60s

export default async function BlogListPage(props: unknown) {
    const { params } = props as { params: Promise<{ locale: string }> };
    const { locale } = await params;
    const blogsRaw = await getAllBlogs(locale) as unknown[];
    const blogs = blogsRaw || [];

    return (
        <main className="max-w-4xl mx-auto p-6 pt-28 md:pt-32">
            <h1 className="text-3xl font-bold mb-4">Blog</h1>
            <ul className="space-y-4">
                {blogs.map((b: unknown) => {
                    const blog = b as Record<string, unknown> & { id?: string; uid?: string; title?: string; subtitle?: string; excerpt?: string };
                    return (
                        <li key={blog.id} className="border p-4 rounded">
                            <Link href={`/${locale}/blog/${blog.uid}`} className="no-underline">
                                <h2 className="text-xl font-semibold">{blog.title}</h2>
                                {blog.subtitle && <p className="text-sm text-neutral-600">{blog.subtitle}</p>}
                                {blog.excerpt && <p className="mt-2">{blog.excerpt}</p>}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}
