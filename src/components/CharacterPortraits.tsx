import React from 'react';

interface PortraitProps {
  type: 'ale_hombre' | 'ale_mujer' | 'vale' | 'diego' | 'rosa' | 'eco';
  mood?: 'neutral' | 'concerned' | 'firm' | 'critical' | 'calm';
  size?: number;
}

export const CharacterPortrait: React.FC<PortraitProps> = ({ type, mood = 'neutral', size = 80 }) => {
  return (
    <div 
      className="relative shrink-0 overflow-hidden rounded-md border-2 bg-[#0E0E24] shadow-md flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderColor: 
          type === 'vale' ? '#4FD1C5' :
          type === 'diego' ? '#F2B544' :
          type === 'rosa' ? '#E86AA8' :
          type === 'eco' ? '#D7263D' : '#EDEBFA'
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        className="w-full h-full shape-rendering-crisp"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {type === 'ale_hombre' && (
          // Ale (Hombre): Pelo oscuro corto, comunicador cian en la oreja, uniforme violeta
          <g>
            <rect x="0" y="0" width="32" height="32" fill="#15152E" />
            <rect x="8" y="5" width="16" height="5" fill="#1C1829" />
            <rect x="6" y="9" width="4" height="6" fill="#1C1829" />
            <rect x="22" y="9" width="4" height="6" fill="#1C1829" />
            {/* Rostro */}
            <rect x="10" y="11" width="12" height="11" fill="#F0D3B7" />
            {/* Ojos */}
            <rect x="12" y="15" width="2" height="2" fill="#2C243B" />
            <rect x="18" y="15" width="2" height="2" fill="#2C243B" />
            {/* Expresión */}
            <rect x="14" y="19" width="4" height="1" fill="#A8735C" />
            {/* Comunicador de oreja cian */}
            <rect x="7" y="14" width="2" height="4" fill="#4FD1C5" />
            {/* Uniforme */}
            <rect x="6" y="23" width="20" height="9" fill="#5E4FA2" />
            <rect x="13" y="23" width="6" height="9" fill="#EDEBFA" />
          </g>
        )}

        {type === 'ale_mujer' && (
          // Ale (Mujer): Pelo oscuro con coleta/mechón, comunicador cian, uniforme violeta
          <g>
            <rect x="0" y="0" width="32" height="32" fill="#15152E" />
            {/* Cabello */}
            <rect x="8" y="4" width="16" height="7" fill="#1F1B2C" />
            <rect x="6" y="8" width="4" height="13" fill="#1F1B2C" />
            <rect x="22" y="8" width="4" height="13" fill="#1F1B2C" />
            <rect x="10" y="3" width="12" height="3" fill="#5E4FA2" /> {/* cinta */}
            {/* Rostro */}
            <rect x="10" y="11" width="12" height="10" fill="#F0D3B7" />
            {/* Ojos expresivos */}
            <rect x="12" y="14" width="2" height="2" fill="#2C243B" />
            <rect x="18" y="14" width="2" height="2" fill="#2C243B" />
            <rect x="11" y="13" width="3" height="1" fill="#1F1B2C" />
            <rect x="18" y="13" width="3" height="1" fill="#1F1B2C" />
            {/* Boca */}
            <rect x="14" y="19" width="4" height="1" fill="#A8735C" />
            {/* Comunicador cian */}
            <rect x="7" y="14" width="2" height="4" fill="#4FD1C5" />
            {/* Uniforme */}
            <rect x="6" y="22" width="20" height="10" fill="#5E4FA2" />
            <rect x="13" y="22" width="6" height="10" fill="#E86AA8" />
          </g>
        )}

        {type === 'vale' && (
          // Vale: Ingeniera jefe, moño de trabajo, overol azul y visor cian
          <g>
            <rect x="0" y="0" width="32" height="32" fill="#10192A" />
            <rect x="12" y="3" width="8" height="4" fill="#40241A" />
            <rect x="8" y="7" width="16" height="6" fill="#4A2A1E" />
            <rect x="7" y="11" width="3" height="8" fill="#4A2A1E" />
            <rect x="22" y="11" width="3" height="8" fill="#4A2A1E" />
            <rect x="10" y="12" width="12" height="10" fill="#E8BFA0" />
            <rect x="11" y="13" width="10" height="2" fill="#4FD1C5" />
            <rect x="12" y="16" width="2" height="2" fill="#241B18" />
            <rect x="18" y="16" width="2" height="2" fill="#241B18" />
            <rect x="14" y="20" width="4" height="1" fill="#8C5243" />
            <rect x="6" y="23" width="20" height="9" fill="#1D2A44" />
            <rect x="14" y="23" width="4" height="9" fill="#4FD1C5" />
          </g>
        )}

        {type === 'diego' && (
          // Diego: Compañero con datapad
          <g>
            <rect x="0" y="0" width="32" height="32" fill="#1E1920" />
            <rect x="9" y="5" width="14" height="6" fill="#A87A38" />
            <rect x="7" y="10" width="4" height="5" fill="#A87A38" />
            <rect x="21" y="9" width="3" height="6" fill="#A87A38" />
            <rect x="10" y="11" width="12" height="11" fill="#F2CDB0" />
            <rect x="12" y="15" width="2" height="2" fill="#3D3025" />
            <rect x="18" y="15" width="2" height="2" fill="#3D3025" />
            <rect x="13" y="19" width="5" height="1" fill="#A86C56" />
            <rect x="6" y="24" width="20" height="8" fill="#2E2838" />
            <rect x="13" y="24" width="6" height="8" fill="#F2B544" />
          </g>
        )}

        {type === 'rosa' && (
          // Comandante Rosa: Directora de la base, pelo plateado
          <g>
            <rect x="0" y="0" width="32" height="32" fill="#1A1226" />
            <rect x="8" y="4" width="16" height="8" fill="#585466" />
            <rect x="10" y="5" width="4" height="3" fill="#A39FB3" />
            <rect x="18" y="6" width="3" height="2" fill="#A39FB3" />
            <rect x="7" y="11" width="4" height="9" fill="#585466" />
            <rect x="21" y="11" width="4" height="9" fill="#585466" />
            <rect x="11" y="12" width="10" height="10" fill="#E6BEA1" />
            <rect x="12" y="16" width="2" height="2" fill="#2E2A38" />
            <rect x="18" y="16" width="2" height="2" fill="#2E2A38" />
            <rect x="13" y="20" width="6" height="1" fill="#915C4D" />
            <rect x="6" y="23" width="20" height="9" fill="#2F1C3F" />
            <rect x="13" y="23" width="6" height="9" fill="#E86AA8" />
          </g>
        )}

        {type === 'eco' && (
          // El Eco: Glitch rojo
          <g>
            <rect x="0" y="0" width="32" height="32" fill="#1C090D" />
            <rect x="6" y="6" width="20" height="20" fill="#380F17" />
            <rect x="10" y="11" width="12" height="2" fill="#D7263D" />
            <rect x="8" y="15" width="16" height="2" fill="#F2B544" />
            <rect x="12" y="19" width="8" height="2" fill="#D7263D" />
          </g>
        )}
      </svg>
    </div>
  );
};
