const requiredAlways = ['DATABASE_URL', 'ADMIN_SESSION_SECRET']
const requiredContact = [
  'RECAPTCHA_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'CONTACT_TO_EMAIL',
  'CONTACT_FROM_EMAIL',
]

const missing = []
const invalid = []

for (const key of requiredAlways) {
  if (!process.env[key]?.trim()) {
    missing.push(key)
  }
}

if (process.env.NODE_ENV === 'production') {
  for (const key of requiredContact) {
    if (!process.env[key]?.trim()) {
      missing.push(key)
    }
  }
}

if ((process.env.ADMIN_SESSION_SECRET?.length ?? 0) < 32) {
  invalid.push('ADMIN_SESSION_SECRET must be at least 32 characters long.')
}

if (process.env.RUN_ADMIN_SEED === 'true') {
  if (!process.env.ADMIN_EMAIL?.trim()) {
    missing.push('ADMIN_EMAIL')
  }

  const adminPassword = process.env.ADMIN_PASSWORD ?? ''
  if (!adminPassword) {
    missing.push('ADMIN_PASSWORD')
  } else if (adminPassword.length < 12) {
    invalid.push('ADMIN_PASSWORD must be at least 12 characters long when RUN_ADMIN_SEED=true.')
  }
}

const smtpPort = Number(process.env.SMTP_PORT ?? '465')
if (!Number.isInteger(smtpPort) || smtpPort <= 0) {
  invalid.push('SMTP_PORT must be a positive integer.')
}

const recaptchaMinScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5')
if (!Number.isFinite(recaptchaMinScore) || recaptchaMinScore < 0 || recaptchaMinScore > 1) {
  invalid.push('RECAPTCHA_MIN_SCORE must be a number between 0 and 1.')
}

if (missing.length === 0 && invalid.length === 0) {
  console.log('[env] Environment validation passed.')
  process.exit(0)
}

console.error('[env] Environment validation failed.')
if (missing.length > 0) {
  console.error(`[env] Missing: ${Array.from(new Set(missing)).join(', ')}`)
}
for (const error of invalid) {
  console.error(`[env] ${error}`)
}
process.exit(1)
