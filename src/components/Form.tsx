import React, { useState } from "react";

export default function ProjectContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    subscribe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Göndərmə funksionallığı
    console.log("Form məlumatları:", formData);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-[#f7f4ef]">
      <div className="w-full max-w-xl bg-[#f7f4ef] border border-[#e6dec9] rounded-2xl p-8 md:p-12 shadow-sm">
        
        {/* Başlıq */}
        <h2 className="text-2xl md:text-3xl font-serif tracking-wider text-[#3d332a] mb-8">
          SORĞU GÖNDƏRMƏK
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Ad Sahəsi */}
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Ad *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent border-b border-[#d4cbc0] py-3 text-[#3d332a] placeholder-[#8c7d70] focus:outline-none focus:border-[#3d332a] transition-colors text-sm"
            />
          </div>

          {/* Telefon Sahəsi */}
          <div className="relative">
            <input
              type="tel"
              required
              placeholder="Telefon *"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-transparent border-b border-[#d4cbc0] py-3 text-[#3d332a] placeholder-[#8c7d70] focus:outline-none focus:border-[#3d332a] transition-colors text-sm"
            />
          </div>

          {/* Mesaj Sahəsi */}
          <div className="relative">
            <input
              type="text"
              placeholder="Mesaj"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-transparent border-b border-[#d4cbc0] py-3 text-[#3d332a] placeholder-[#8c7d70] focus:outline-none focus:border-[#3d332a] transition-colors text-sm"
            />
          </div>

          {/* Checkbox (Abunəlik) */}
          <div className="flex items-start space-x-3 pt-2">
            <input
              type="checkbox"
              id="subscribe"
              checked={formData.subscribe}
              onChange={(e) => setFormData({ ...formData, subscribe: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-[#d4cbc0] text-[#6b7280] focus:ring-0 cursor-pointer accent-[#5a6578]"
            />
            <label htmlFor="subscribe" className="text-xs md:text-sm text-[#6b5d52] cursor-pointer select-none leading-relaxed">
              Mən Sea Breeze layihəsi və onun yeni imkanları barədə əlavə məlumat almaq üçün xəbər bülleteninə abunə olmaq istəyirəm.
            </label>
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