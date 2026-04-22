interface SessionUser {
    sub: string;
    email: string;
    name: string;
    access: Record<string, string[]>;
    groups: string[];
    expiresAt: number;
}
interface SsoConfig {
    /** Broker origin, e.g., https://kannegiesser.ai */
    brokerOrigin: string;
    /** Slug that matches this app's registration in the broker. */
    appSlug: string;
}

export type { SessionUser as S, SsoConfig as a };
