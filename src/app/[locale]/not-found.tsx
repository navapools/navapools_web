import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            <div className="text-center px-4">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
                <p className="text-gray-300 mb-8">The page you are looking for does not exist.</p>
                <Link 
                    href="/en" 
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}

