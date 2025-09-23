declare module 'next-pwa' {
    import type { NextConfig } from 'next';
    
    interface PWAConfig {
        dest?: string;
        disable?: boolean;
        register?: boolean;
        skipWaiting?: boolean;
        scope?: string;
        sw?: string;
        publicExcludes?: string[];
        buildExcludes?: string[];
        cacheOnFrontEndNav?: boolean;
        reloadOnOnline?: boolean;
    }
    
    function withPWA(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig;
    export = withPWA;
}