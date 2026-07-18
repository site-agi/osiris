'use client';

import { motion } from 'framer-motion';
import { Globe, MapPin } from 'lucide-react';

interface ViewPresetsProps {
  onNavigate: (lat: number, lng: number, zoom: number) => void;
}

const PRESETS = [
  { label: 'VISÃO GLOBAL', lat: 20, lng: 0, zoom: 2.5, icon: '🌍' },
  { label: 'BARRA CENTRO', lat: -11.0885, lng: -43.1420, zoom: 14.5, icon: '⚓' },
  { label: 'ENCONTRO DOS RIOS', lat: -11.0850, lng: -43.1435, zoom: 15.5, icon: '🌊' },
  { label: 'XIQUE-XIQUE', lat: -10.8228, lng: -42.7308, zoom: 12.5, icon: '📍' },
  { label: 'ESTADO DA BAHIA', lat: -12.5, lng: -41.7, zoom: 6.5, icon: '🇧🇷' },
];

export default function ViewPresets({ onNavigate }: ViewPresetsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="glass-panel p-2.5 pointer-events-auto"
    >
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-3.5 h-3.5 text-[var(--gold-primary)]" />
        <span className="hud-text text-[12px] text-[var(--text-primary)] tracking-widest">ATALHOS DE VISÃO</span>
      </div>
      <div className="grid grid-cols-1 gap-1">
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => onNavigate(p.lat, p.lng, p.zoom)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded text-[10px] font-mono tracking-wider border border-transparent hover:border-[var(--border-primary)] hover:text-[var(--gold-primary)] transition-all hover:scale-[1.02] active:scale-[0.98] text-[var(--text-muted)] hover:bg-[var(--hover-accent)]"
          >
            <span className="text-[11px] flex-shrink-0">{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
