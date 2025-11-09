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
			<form className="space-y-6" onSubmit={onSubmit}>
				<input 
					className="w-full border p-3 rounded-lg text-lg text-gray-900 placeholder-gray-500 placeholder-opacity-100" 
					placeholder={copy.name_placeholder} 
					value={name} 
					onChange={(e) => setName(e.target.value)} 
					required 
					disabled={isSubmitting}
				/>
				<input 
					className="w-full border p-3 rounded-lg text-lg text-gray-900 placeholder-gray-500 placeholder-opacity-100" 
					placeholder={copy.email_placeholder} 
					type="email" 
					value={email} 
					onChange={(e) => setEmail(e.target.value)} 
					required 
					disabled={isSubmitting}
				/>
				<textarea 
					className="w-full border p-3 rounded-lg text-lg text-gray-900 placeholder-gray-500 placeholder-opacity-100" 
					placeholder={copy.message_placeholder} 
					rows={8} 
					value={message} 
					onChange={(e) => setMessage(e.target.value)} 
					required 
					disabled={isSubmitting}
				/>
				<button 
					className="w-full px-6 py-3 rounded-lg bg-black text-white text-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
					type="submit" 
					disabled={isSubmitting}
				>
					{isSubmitting ? (locale === 'es' ? 'Enviando...' : 'Sending...') : copy.submit_label}
				</button>
			</form>
			
			{/* Success Message */}
			{status === "SUCCESS" && (
				<div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50">
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
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
