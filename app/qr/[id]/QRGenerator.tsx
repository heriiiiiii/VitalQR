"use client";

import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";

interface QRGeneratorProps {
    url: string;
    patientName: string;
    patientId: string;
}

export default function QRGenerator({ url, patientName, patientId }: QRGeneratorProps) {
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const svg = qrRef.current?.querySelector("svg");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const size = 400;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url_obj = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            URL.revokeObjectURL(url_obj);

            const pngUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `QR_${patientName.replace(/\s+/g, "_")}.png`;
            link.href = pngUrl;
            link.click();
        };
        img.src = url_obj;
    };

    const handleCopyURL = () => {
        navigator.clipboard.writeText(url).then(() => {
            alert("¡URL copiada al portapapeles!");
        });
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* QR Code Display */}
            <div
                ref={qrRef}
                className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-indigo-100"
                style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f6ff 100%)",
                }}
            >
                <QRCodeSVG
                    value={url}
                    size={220}
                    bgColor="#ffffff"
                    fgColor="#312e81"
                    level="H"
                    includeMargin={true}
                />
            </div>

            {/* URL Preview */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-lg border border-indigo-100">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                    🔗 URL embebida en el QR
                </p>
                <p className="text-sm text-indigo-700 font-mono break-all bg-indigo-50 rounded-xl px-3 py-2">
                    {url}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                    id={`btn-download-qr-${patientId}`}
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15M7 10L12 15L17 10M12 15V3" />
                    </svg>
                    Descargar QR (PNG)
                </button>

                <button
                    id={`btn-copy-url-${patientId}`}
                    onClick={handleCopyURL}
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-indigo-600 font-semibold py-3 px-6 rounded-2xl shadow-lg border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17M8 5C8 5 8 3 10 3H16C17.1046 3 18 3.89543 18 5V13C18 14.1046 17.1046 15 16 15H10C8.89543 15 8 14.1046 8 13V5Z" />
                    </svg>
                    Copiar URL
                </button>
            </div>
        </div>
    );
}
