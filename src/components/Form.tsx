import React, { useState } from "react";

export default function ProjectContactForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = message.trim();
    if (!text) return;

    window.open(
      `https://wa.me/994504588072?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div id="contact" className="w-full flex items-center justify-center p-4 pb-12 bg-[#f7f4ef]">
      <div className="w-full max-w-xl bg-[#f7f4ef] border border-[#e6dec9] rounded-2xl p-8 md:p-12 shadow-sm">
        
        {/* Başlıq */}
        <h2 className="text-2xl md:text-3xl font-serif tracking-wider text-[#3d332a] mb-8">
          SORĞU GÖNDƏRMƏK
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Mesaj Sahəsi */}
          <div className="relative">
            <textarea
              required
              rows={5}
              placeholder="Mesaj"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent border-b border-[#d4cbc0] py-3 text-[#3d332a] placeholder-[#8c7d70] focus:outline-none focus:border-[#3d332a] transition-colors text-sm resize-y"
            />
          </div>

          {/* Göndər Düyməsi */}
          <button
            type="submit"
            className="w-full mt-4 bg-[#6b7585] hover:bg-[#586170] text-white font-medium tracking-widest py-4 rounded-xl transition-all shadow-md text-sm cursor-pointer"
          >
            GÖNDƏR
          </button>

        </form>
      </div>
    </div>
  );
}