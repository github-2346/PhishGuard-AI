
import React, { ReactNode } from 'react';

interface Props { text: string; children: ReactNode; }
export default function Tooltip({ text, children }: Props) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }} className="tooltip-wrap">
      {children}
      <span className="tip" style={{ position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: 'var(--card2)', border: '1px solid var(--border2)', borderRadius: 6, padding: '4px 9px', fontSize: 11, whiteSpace: 'nowrap', pointerEvents: 'none', opacity: 0, transition: 'opacity .15s', zIndex: 60, color: 'var(--text)' }}>{text}</span>
    </div>
  );
}
