import { NextResponse } from "next/server";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({ apiKey: process.env.MAILERSEND_TOKEN || "" });

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Contact API payload:', body);
        console.log('MailerSend Environment:', {
            hasToken: !!process.env.MAILERSEND_TOKEN,
            hasFrom: !!process.env.MAILERSEND_FROM,
            hasAdminTo: !!process.env.MAILERSEND_ADMIN_TO,
        });
        const { name, email, message, type } = body || {};

        const trimmedEmail = typeof email === "string" ? email.trim() : "";
        const trimmedMessage = typeof message === "string" ? message.trim() : "";
        const trimmedName = typeof name === "string" ? name.trim() : "";

        if (!trimmedName || !trimmedEmail || !trimmedMessage) {
            return NextResponse.json({ error: "Name, email and message are required", received: body }, { status: 400 });
        }


        if (!process.env.MAILERSEND_TOKEN) {
            return NextResponse.json({ error: "MAILERSEND_TOKEN is missing" }, { status: 500 });
        }
        if (!process.env.MAILERSEND_FROM) {
            return NextResponse.json({ error: "MAILERSEND_FROM is missing. Set it to a verified domain email in MailerSend (e.g., no-reply@yourdomain.com)." }, { status: 500 });
        }

        // If payload is a subscribe-type (from ContactAlternate) we send a minimal admin notification
        const isSubscribe = String(type || "").toLowerCase() === "subscribe";
        if (isSubscribe) console.log('Request marked as subscribe -> admin only, skipping user confirmation.');
        const subjectAdmin = isSubscribe ? `New subscription: ${trimmedEmail}` : `Website contact from ${trimmedName}`;
        const htmlAdmin = isSubscribe
            ? `
                <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
                  <div style="padding:20px; background:#fff; border-radius:8px;">
                    <h2 style="color:#0b3a66; margin-bottom:12px;">New subscription received</h2>
                    <p style="font-size:15px; color:#333; margin-bottom:12px;">An email has been registered via the site subscription:</p>
                    <p style="font-size:18px; font-weight:700; color:#0b3a66; margin:0 0 12px;">${trimmedEmail}</p>
                    <p style="font-size:13px; color:#666; margin-top:8px;">Source: website subscription form</p>
                                        <div style="margin-top:20px; color:#666; font-size:14px;">
                                            <p>This message was automatically sent from the website contact form.</p>
                                            <p style="margin-top:8px;">
                                                <strong style="color:#0b3a66;">NavaPools Website</strong><br/>
                                                <em>Your Florida Oasis, Always Perfect</em>
                                            </p>
                                        </div>
                                    </div>
                                </div>
              `
            : `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #0066cc; margin-bottom: 20px;">New Contact Request Received</h1>
                    <p style="color: #444; font-size: 16px; margin-bottom: 30px;">
                        A new contact request has been submitted through the website. Below you will find the details provided by the potential client:
                    </p>

                    <table style="border-collapse: collapse; width: 100%; margin: 20px 0; border: 1px solid #ddd;">
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; color: #0066cc;">Name</th>
                            <td style="padding: 12px; border: 1px solid #ddd;">${trimmedName}</td>
                        </tr>
                        <tr>
                            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; color: #0066cc;">Email</th>
                            <td style="padding: 12px; border: 1px solid #ddd;">${trimmedEmail}</td>
                        </tr>
                        <tr style="background-color: #f8f9fa;">
                            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; color: #0066cc;">Message</th>
                            <td style="padding: 12px; border: 1px solid #ddd;">${String(trimmedMessage).replace(/\n/g, '<br/>')}</td>
                        </tr>
                    </table>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; color: #666; font-size: 14px;">
                        <p>This message was automatically sent from the website contact form.</p>
                        <p style="margin-top: 20px;">
                            <strong style="color: #0b3a66;">NavaPools Website</strong><br>
                            <em>Your Florida Oasis, Always Perfect</em>
                        </p>
                    </div>
                </div>
            `;

        const resolvedFrom = process.env.MAILERSEND_FROM as string; // must be verified in MailerSend
        if (!process.env.MAILERSEND_ADMIN_TO) {
            return NextResponse.json({ error: "MAILERSEND_ADMIN_TO is missing. Set it to the admin inbox that should receive contact notifications." }, { status: 500 });
        }
        console.log('MailerSend config:', {
            hasToken: !!process.env.MAILERSEND_TOKEN,
            mailersendFrom: process.env.MAILERSEND_FROM,
            mailersendAdminTo: process.env.MAILERSEND_ADMIN_TO,
            sendgridFrom: process.env.SENDGRID_FROM ? true : false,
        });
        const sender = new Sender(resolvedFrom, "NavaPools");

        // 1) Send to admin inbox (explicit MAILERSEND_ADMIN_TO required)
        const adminTo = process.env.MAILERSEND_ADMIN_TO as string;
        const adminEmailParams = new EmailParams()
            .setFrom(sender)
            .setTo([new Recipient(adminTo)])
            .setSubject(subjectAdmin)
            .setHtml(htmlAdmin)
            .setReplyTo(new Sender(trimmedEmail, trimmedName));

        try {
            await mailerSend.email.send(adminEmailParams);
        } catch (err: unknown) {
            // Log as much useful info as possible without printing secrets
            console.error('MailerSend admin email error (raw):', err);
            // Try to extract common axios-like response body/message
            let details: string;
            try {
                // @ts-expect-error - MailerSend error type includes response.body
                details = err?.response?.body || err?.response || (err instanceof Error ? err.message : String(err));
            } catch {
                details = String(err);
            }
            console.error('MailerSend admin email details:', details);
            return NextResponse.json({ error: "MailerSend admin email failed", details }, { status: 500 });
        }

        // 2) Confirmation to user (localized) - ENABLED, but skip for subscribe-type
        if (!isSubscribe) {

            // const locale = (body && body.locale) || "en";
            // user confirmation email content is intentionally disabled (not sent)
            // If you enable sending to users later, you can reintroduce subjectUser and htmlUser here.

            // User confirmation emails are disabled by default to avoid trial-account delivery errors.
            // Admin notification was already sent above. If you need user confirmations enabled,
            // set an environment flag or upgrade the MailerSend account and we can re-enable this.
            console.log('User confirmation is disabled; admin notification was sent to', adminTo);

        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }
}
