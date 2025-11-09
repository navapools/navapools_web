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
        const { name, email, message } = body || {};

        const trimmedEmail = typeof email === "string" ? email.trim() : "";
        const trimmedMessage = typeof message === "string" ? message.trim() : "";
        const trimmedName = typeof name === "string" ? name.trim() : "";

        if (!trimmedName || !trimmedEmail || !trimmedMessage) {
            return NextResponse.json({ error: "Name, email and message are required", received: body }, { status: 400 });
        }


        const adminFrom = process.env.SENDGRID_FROM as string;
        if (!process.env.MAILERSEND_TOKEN) {
            return NextResponse.json({ error: "MAILERSEND_TOKEN is missing" }, { status: 500 });
        }
        if (!process.env.MAILERSEND_FROM) {
            return NextResponse.json({ error: "MAILERSEND_FROM is missing. Set it to a verified domain email in MailerSend (e.g., no-reply@yourdomain.com)." }, { status: 500 });
        }

        const subjectAdmin = `Website contact from ${trimmedName}`;
        const htmlAdmin = `
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
                        <strong style="color: #0066cc;">NavaPools Website</strong><br>
                        <em>Your Florida Oasis, Always Perfect</em>
                    </p>
                </div>
            </div>
        `;

        const resolvedFrom = process.env.MAILERSEND_FROM as string; // must be verified in MailerSend
        console.log('MailerSend config:', {
            hasToken: !!process.env.MAILERSEND_TOKEN,
            mailersendFrom: process.env.MAILERSEND_FROM,
            mailersendAdminTo: process.env.MAILERSEND_ADMIN_TO,
            sendgridFrom: process.env.SENDGRID_FROM ? true : false,
        });
        const sender = new Sender(resolvedFrom, "NavaPools");

        // 1) Send to admin inbox
        const adminEmailParams = new EmailParams()
            .setFrom(sender)
            .setTo([new Recipient(process.env.MAILERSEND_ADMIN_TO || adminFrom || resolvedFrom)])
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

        // 2) Confirmation to user (localized) - DISABLED
        // const isSpanish = (locale || "en").startsWith("es");
        // const subjectUser = isSpanish ? "Hemos recibido tu mensaje" : "We received your message";
        // const bodyUser = isSpanish
        //     ? `Hola ${trimmedName},<br/><br/>Gracias por contactarnos. Tu mensaje fue recibido y nuestro equipo te contactará pronto.<br/><br/>Saludos,<br/>NavaPools`
        //     : `Hi ${trimmedName},<br/><br/>Thanks for reaching out. We received your message and our team will contact you shortly.<br/><br/>Best regards,<br/>NavaPools`;

        // User confirmation email disabled as requested
        // const userEmailParams = new EmailParams()
        //     .setFrom(sender)
        //     .setTo([new Recipient(trimmedEmail, trimmedName || undefined)])
        //     .setSubject(subjectUser)
        //     .setHtml(bodyUser);
        // try {
        //     await mailerSend.email.send(userEmailParams);
        // } catch (err: any) {
        //     console.error('MailerSend user email error:', err?.response || err);
        //     return NextResponse.json({ error: "MailerSend user email failed", details: err?.response || String(err) }, { status: 500 });
        // }

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Error sending email:', error);
		return NextResponse.json({ error: "Failed to send" }, { status: 500 });
	}
}
