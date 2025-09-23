import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
	sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, email, message } = body || {};

		if (!name || !email || !message) {
			return NextResponse.json({ error: "Missing fields" }, { status: 400 });
		}

		await sendgrid.send({
			from: process.env.SENDGRID_FROM as string,
			to: process.env.SENDGRID_TO as string,
			subject: `Website contact from ${name}`,
			replyTo: email,
			html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
		});

		return NextResponse.json({ ok: true });
	} catch (error) {
		return NextResponse.json({ error: "Failed to send" }, { status: 500 });
	}
}
