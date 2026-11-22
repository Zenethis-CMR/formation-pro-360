# ARCHIVE — ancienne configuration d'e-mails Supabase Auth

> Cette procédure n'est plus utilisée. La production envoie les e-mails transactionnels depuis le backend Node.js avec sa configuration SMTP privée. Voir [`proxmox-deployment.md`](./proxmox-deployment.md).

# Transactional sign-in e-mails: Resend SMTP for Formation Pro 360

## Why this is required

The default Supabase Auth SMTP service is a development-only sender: it allows only team-member recipients and currently permits two e-mails per hour per project. This is unsuitable for real learners.

Supabase documentation: https://supabase.com/docs/guides/auth/auth-smtp
Resend SMTP documentation: https://resend.com/docs/send-with-smtp

**The platform is not considered SMTP-ready until an actual e-mail arrives in an external learner inbox.**

## Sender and domain

Sending domain verified by the project owner: `zenithis.tech`.

Configured sender: `Formation Pro 360 <formation@zenithis.tech>`.

The only supported application URL is `https://formation-pro-360.vercel.app`.

## One-time operator setup

1. Open https://resend.com and create/choose the account that will own the production mail delivery. Review the provider's current free-plan limits and billing settings.
2. In Resend, use the verified domain `zenithis.tech` under **Domains**.
3. In the DNS dashboard for `zenithis.tech`, add the **exact DNS records displayed by Resend** (normally DKIM and SPF, plus DMARC as recommended). Do not invent or reuse values from another domain. Wait until Resend reports **Verified**.
4. In Resend, create a scoped API key for **sending only**. Store it in a secrets manager. Do not share it in screenshots, chat, GitHub, or Vercel public variables.
5. Open https://supabase.com/dashboard/project/llwuukoqwlwpefgipvgc/auth/providers and find the current **SMTP Settings** under Supabase Auth (menu wording may vary). Enable **Custom SMTP**.
6. Fill in the following provider settings:
   - SMTP host: `smtp.resend.com`
   - Port: `465` (TLS) or `587` (STARTTLS)
   - Username: `resend`
   - Password: the Resend API key from step 4 (enter directly in Supabase).
   - Sender e-mail: `formation@zenithis.tech`
   - Sender name: `Formation Pro 360`
7. Save. In **Authentication > Rate Limits**, check the configured hourly e-mail cap. Supabase initially sets 30 per hour after enabling a custom SMTP. Increase it gradually only if your Resend plan and traffic justify it.
8. Test a single magic link from an independent learner e-mail address. Check receipt, correct callback host, successful login, and delivery logs in Resend. Test again on a phone.
9. Avoid disabling e-mail verification to bypass the limit. Keep the role protection, RLS, and one-time login flow enabled. Consider CAPTCHA before opening unrestricted sign-ups to the public.

## Troubleshooting

The login page now distinguishes:
- `quota`: the provider returned a rate limit, so wait rather than repeatedly retrying.
- `unauthorized`: default Supabase sender refused the recipient; finish SMTP setup.
- `send`: another delivery failure, to investigate with Supabase Auth logs and Resend delivery insights.

Never paste the SMTP password or API key into the application's browser interface. SMTP belongs in Supabase's private dashboard, not Next.js public environment variables.

## Acceptance checklist

- [ ] Sending domain verified in Resend
- [ ] Custom SMTP enabled in Supabase
- [ ] Supabase hourly limit reviewed
- [ ] Magic-link e-mail delivered to an external learner inbox
- [ ] Auth callback works on `https://formation-pro-360.vercel.app/auth/callback`
- [ ] Sign-in retested without unnecessary duplicate requests

## Later, when the app is ready

Keep the official application domain unchanged and remove obsolete preview callback URLs from Supabase after production verification.
