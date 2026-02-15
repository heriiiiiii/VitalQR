'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function GeneratorPage() {
  const [patientId, setPatientId] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      {/* Title - Hidden when printing */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800 print:hidden">
        VitalQR Generator
      </h1>

      {/* Input Section - Hidden when printing */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md print:hidden mb-8">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Patient ID (From Database)
        </label>
        <input
          type="text"
          value={patientId}
          onChange={(e) => {
            setPatientId(e.target.value);
            setShowQR(false); // Hide QR if user types new ID
          }}
          placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        
        <button
          onClick={() => setShowQR(true)}
          disabled={!patientId}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          Generate QR Code
        </button>
      </div>

      {/* QR Display Section - The only thing visible when printing */}
      {showQR && (
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg print:shadow-none print:p-0">
          <div className="border-4 border-black p-4">
            <QRCodeSVG 
              value={patientId} 
              size={256} // Big size for good quality
              level={"H"} // High error correction
            />
          </div>
          <p className="mt-4 text-xl font-mono font-bold text-gray-800">
            ID: {patientId}
          </p>
          <p className="text-sm text-gray-500 mt-2 print:hidden">
            Scan this code with the TPS App
          </p>

          {/* Print Button - Hidden when printing */}
          <button
            onClick={handlePrint}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full print:hidden flex items-center gap-2"
          >
            🖨️ Print PDF
          </button>
        </div>
      )}
    </div>
  );
}