const isProduction = process.env.NODE_ENV === 'production';

const normalizeSameSite = (value) => {
    if (!value) return 'lax';
    const normalized = value.toLowerCase();
    if (normalized === 'none') return 'none';
    if (normalized === 'strict') return 'strict';
    return 'lax';
};

const getBaseCookieOptions = () => {
    const sameSite = normalizeSameSite(process.env.COOKIE_SAMESITE);
    const options = {
        httpOnly: true,
        secure: isProduction || sameSite === 'none',
        sameSite,
        path: '/'
    };

    if (process.env.COOKIE_DOMAIN) {
        options.domain = process.env.COOKIE_DOMAIN;
    }

    return options;
};

export const getAuthCookieOptions = () => ({
    ...getBaseCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000
});

export const getClearCookieOptions = () => ({
    ...getBaseCookieOptions()
});
