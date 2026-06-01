const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeAuthEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidAuthEmail(value: string): boolean {
  const email = normalizeAuthEmail(value);
  return email.length > 0 && EMAIL_PATTERN.test(email);
}

/** Map Supabase Auth errors to clearer, actionable messages. */
export function getAuthErrorMessage(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("email rate limit")) {
    return (
      "Supabase’s built-in email limit was reached (about 2 emails per hour on the free default mailer). " +
      "Wait an hour, use an email that’s on your Supabase organization team, or turn off “Confirm email” in the dashboard for local testing."
    );
  }

  if (
    lower.includes("not authorized") ||
    lower.includes("invalid") && lower.includes("email")
  ) {
    return (
      "This email can’t receive auth mail from Supabase’s default sender. " +
      "For development: in Supabase → Authentication → Providers → Email, turn off “Confirm email”, " +
      "or add custom SMTP, or sign up with an email listed on your Supabase organization team."
    );
  }

  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (lower.includes("invalid login credentials")) {
    return "Incorrect email or password. If you just signed up, confirm your email first (unless confirmation is disabled).";
  }

  return message;
}
