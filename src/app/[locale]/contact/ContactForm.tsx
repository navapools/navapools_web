"use client";
import { useState } from "react";

interface ContactFormProps {
	locale: string;
	copy: {
		name_placeholder: string;
		email_placeholder: string;
		message_placeholder: string;
		submit_label: string;
		success_title: string;
		success_message: string;
		error_message: string;
	};
}

export default function ContactForm({ locale, copy }: ContactFormProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setStatus(null);
		setIsSubmitting(true);
		
		// Basic validation
		if (!name.trim() || !email.trim() || !message.trim()) {
			setStatus("ERROR");
			setIsSubmitting(false);
			return;
		}
		
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, message, locale }),
			});
			if (res.ok) {
				setStatus("SUCCESS");
				setName("");
				setEmail("");
				setMessage("");
				// Auto-hide success message after 5 seconds
				setTimeout(() => setStatus(null), 5000);
			} else {
				setStatus("ERROR");
			}
		} catch (error) {
			console.error('Error sending message:', error);
			setStatus("ERROR");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<form className="space-y-4" onSubmit={onSubmit}>
				<input 
					className="w-full border p-2 rounded" 
					placeholder={copy.name_placeholder} 
					value={name} 
					onChange={(e) => setName(e.target.value)} 
					required 
					disabled={isSubmitting}
				/>
				<input 
					className="w-full border p-2 rounded" 
					placeholder={copy.email_placeholder} 
					type="email" 
					value={email} 
					onChange={(e) => setEmail(e.target.value)} 
					required 
					disabled={isSubmitting}
				/>
				<textarea 
					className="w-full border p-2 rounded" 
					placeholder={copy.message_placeholder} 
					rows={6} 
					value={message} 
					onChange={(e) => setMessage(e.target.value)} 
					required 
					disabled={isSubmitting}
				/>
				<button 
					className="px-4 py-2 rounded bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed" 
					type="submit" 
					disabled={isSubmitting}
				>
					{isSubmitting ? (locale === 'es' ? 'Enviando...' : 'Sending...') : copy.submit_label}
				</button>
			</form>
			
			{/* Success Message */}
			{status === "SUCCESS" && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
						<div className="text-center">
							<div className="text-green-500 text-4xl mb-4">✓</div>
							<h3 className="text-lg font-semibold mb-2">
								{copy.success_title}
							</h3>
							<p className="text-gray-600 mb-4">
								{copy.success_message}
							</p>
							<button 
								onClick={() => setStatus(null)}
								className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
							>
								{locale === "es" ? "Cerrar" : "Close"}
							</button>
						</div>
					</div>
				</div>
			)}
			
			{/* Error Message */}
			{status === "ERROR" && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
					{copy.error_message}
				</div>
			)}
		</>
	);
}
