import React from 'react';

interface BarcodeStubProps {
  label?: string;
  code?: string;
  time?: string;
  className?: string;
}

export const BarcodeStub: React.FC<BarcodeStubProps> = ({
  label = 'SYSTEM-REF',
  code = 'PC-2026',
  time,
  className = ''
}) => {
  return (
    <div className={`p-3 bg-paper-muted border border-ink/30 rounded-2xl flex items-center justify-between font-mono text-xs text-graphite ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="font-extrabold text-ink">{label}: {code}</span>
        {time && <span>• {time}</span>}
      </div>
      <div className="flex items-center space-x-1 tracking-widest text-ink font-bold opacity-60">
        |||| | ||| || |||
      </div>
    </div>
  );
};
