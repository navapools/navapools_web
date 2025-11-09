export default function Head() {
    return (
        <>
            {/* Preload LCP logo to make it discoverable and high-priority for PageSpeed. */}
            {/* If you generate AVIF/WebP versions, change href to point at the modern format (e.g. /NavaPools_logo.avif). */}
            <link rel="preload" href="/NavaPools_logo.png" as="image" fetchPriority="high" />
        </>
    );
}
