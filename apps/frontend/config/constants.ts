export const COOKIE_ACCESS = "accessToken";
export const COOKIE_REFRESH = "refreshToken";
export const isProd = process.env.NODE_ENV === "production";

// Cookie lifetimes (in seconds)
export const ACCESS_TOKEN_MAX_AGE_S = 60 * 15; // 15 minutes
export const REFRESH_TOKEN_MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days


