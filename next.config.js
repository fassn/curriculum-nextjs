/** @type {import('next').NextConfig} */
const serverActionsAllowedOrigins = (process.env.SERVER_ACTIONS_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

const nextConfig = {
    output: 'standalone', // needed for Docker deployment
    ...(serverActionsAllowedOrigins.length > 0
        ? {
              experimental: {
                  serverActions: {
                      allowedOrigins: serverActionsAllowedOrigins,
                  },
              },
          }
        : {}),
}

module.exports = nextConfig
