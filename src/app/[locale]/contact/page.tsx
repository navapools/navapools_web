"use client";
import { useState } from "react";

export default function ContactPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus(null);
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, message }),
			});
			if (res.ok) {
				setStatus("OK");
				setName("");
				setEmail("");
				setMessage("");
			} else {
				setStatus("ERROR");
			}
		} catch {
			setStatus("ERROR");
		}
	}

	return (
		<div className="max-w-xl mx-auto p-6">
			<h1 className="text-2xl font-semibold mb-4">Contact</h1>
			<form className="space-y-4" onSubmit={onSubmit}>
				<input className="w-full border p-2 rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
				<input className="w-full border p-2 rounded" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<textarea className="w-full border p-2 rounded" placeholder="Message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
				<button className="px-4 py-2 rounded bg-black text-white" type="submit">Send</button>
			</form>
			{status === "OK" && <p className="text-green-600 mt-3">Sent!</p>}
			{status === "ERROR" && <p className="text-red-600 mt-3">Error. Try again.</p>}
		</div>
	);
}
