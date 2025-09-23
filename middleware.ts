import createMiddleware from "next-intl/middleware";
import intlConfig from "./next-intl.config.mjs";

export default createMiddleware(intlConfig);

export const config = {
	matcher: ["/", "/(en|es)/:path*"],
};
