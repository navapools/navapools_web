import { createClient as createBaseClient } from "@/prismicio";
import type { ClientConfig } from "@prismicio/client";

export function createPrismicClient(config?: ClientConfig) {
	return createBaseClient({ ...(config || {}) });
}
