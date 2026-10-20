import { DialogueStep, HotspotItem, InventoryItem, LiveChatMessage } from '../types/game';

export const INITIAL_HOTSPOTS: HotspotItem[] = [
  {
    id: 'spot-1',
    xPercent: 48,
    yPercent: 22,
    isRealAnomaly: true,
    title: 'Sombra Invertida en el Rostro (Falla de Luz)',
    description: 'La luz le pega por la izquierda, pero los focos del taller están al otro lado (desfase de 38°). Prueba clarita de que le pegaron la cara de una foto estática sobre otro cuerpo.',
    examined: false
  },
  {
    id: 'spot-2',
    xPercent: 33,
    yPercent: 42,
    isRealAnomaly: false,
    title: 'Casaca de Faena Estándar',
    description: 'La tela del overol de chamba es la oficial de la base Kuntur. Esta parte del uniforme es normal, no hay nada sospechoso.',
    examined: false
  },
  {
    id: 'spot-3',
    xPercent: 55,
    yPercent: 52,
    isRealAnomaly: true,
    title: 'Bordes Borrosos y Parpadeo Chueco',
    description: 'Los contornos de la cara tiemblan como filtro fallado de TikTok. Típica pifia de interpolación de una IA que no sabe cómo cerrar los ojos al mismo tiempo.',
    examined: false
  },
  {
    id: 'spot-4',
    xPercent: 42,
    yPercent: 74,
    isRealAnomaly: false,
    title: 'Temperatura Ambiental Normal',
    description: 'El sensor de calor del cuarto marca temperatura ambiente normal. No aporta nada a la investigación.',
    examined: false
  },
  {
    id: 'spot-5',
    xPercent: 66,
    yPercent: 36,
    isRealAnomaly: true,
    title: 'Marca de Agua Oculta de IA',
    description: 'Ruido digital parásito en 14.2 kHz con la firma inconfundible del programa de IA usado para sintetizar el video. ¡La prueba reina de la truchería!',
    examined: false
  }
];

export const INITIAL_CHAT_FEED: LiveChatMessage[] = [
  {
    id: 'msg-1',
    author: 'Kevin_Cadete',
    authorRole: 'Soporte de Hangar',
    authorColor: '#8F8CA8',
    text: '¿Alguien vio a la nueva Jefa de Escuadrón? Dicen que la promoción se decidió a puerta cerrada en comandancia.',
    timestamp: '08:14'
  },
  {
    id: 'msg-2',
    author: 'Camila_Log',
    authorRole: 'Logística',
    authorColor: '#4FD1C5',
    text: 'Por favor, no repitan rumores de pasillo. Vale arregló el fallo crítico de presión del sector 3 sola el mes pasado.',
    timestamp: '08:16'
  },
  {
    id: 'msg-3',
    author: 'Diego',
    authorRole: 'Cadete de Enlace',
    authorColor: '#F2B544',
    text: 'Nadie inventa humo donde no hubo fuego... algo raro hay en los registros.',
    timestamp: '08:18'
  }
];

export const ITEMS_DATABASE: Record<string, InventoryItem> = {
  item_cryo_log: {
    id: 'item_cryo_log',
    name: 'Bitácora Criogénica de Vale (400 Horas)',
    category: 'bitacora',
    description: 'Registro criptográfico sellado con la firma técnica de Vale. Demuestra que durante la fecha del supuesto video difamatorio, Vale estaba físicamente en el núcleo criogénico.',
    loreDetail: 'Las marcas de tiempo de las válvulas son irreversibles y cuentan con firma física SHA-256 de la subestación.',
    iconType: 'waveform',
    acquiredAt: '08:22'
  },
  item_diego_draft: {
    id: 'item_diego_draft',
    name: 'Borrador Confidencial de Diego (Locker 2)',
    category: 'seguridad',
    description: 'Nota sin enviar donde Diego admite que un grupo clandestino le pidió reenviar el rumor para cuestionar el ascenso de Vale.',
    loreDetail: 'Evidencia de que la hostilidad fue coordinada y alimentada por presiones de grupo, no por dudas técnicas reales.',
    iconType: 'file',
    acquiredAt: '08:25'
  },
  item_firewall_hash: {
    id: 'item_firewall_hash',
    name: 'Firma Hash de IP Clandestina («El Eco»)',
    category: 'seguridad',
    description: 'Trazabilidad de enrutamiento capturada en el cortafuegos. Demuestra que la transmisión provino de un terminal no autorizado conectado al puerto auxiliar.',
    loreDetail: 'El paquete no se originó en el hangar ni en el personal de guardia oficial.',
    iconType: 'chip',
    acquiredAt: '08:29'
  },
  item_forensic_report: {
    id: 'item_forensic_report',
    name: 'Informe Pericial de Holofake',
    category: 'forense',
    description: 'Dictamen pericial con las 3 anomalías visuales y espectrales confirmadas: falla lumínica de 38°, desfase de vóxeles y ruido fractal de 14.2 kHz.',
    loreDetail: 'Prueba concluyente requerida por la Comandante Rosa para abrir sumario penal y sancionar el acoso.',
    iconType: 'key',
    acquiredAt: '08:31'
  },
  item_drone_disk: {
    id: 'item_drone_disk',
    name: 'Disco de Telemetría del Dron (Gravedad Cero)',
    category: 'seguridad',
    description: 'Registro de telemetría extraído del dron espía capturado en el hangar orbital. Contiene las órdenes de grabación oculta.',
    loreDetail: 'Prueba flagrante de espionaje y acoso continuado con tecnología no autorizada.',
    iconType: 'chip',
    acquiredAt: '08:34'
  },
  item_satellite_key: {
    id: 'item_satellite_key',
    name: 'Llave Criptográfica de la Antena Exterior',
    category: 'seguridad',
    description: 'Código de interrupción cuántico recuperado al derribar los repetidores piratas del Eco en el vuelo espacial.',
    loreDetail: 'Garantiza el apagado irreversible de la señal en todos los satélites de la estación.',
    iconType: 'key',
    acquiredAt: '08:38'
  }
};

export const DIALOGUE_NODES: Record<string, DialogueStep> = {
  // --- ACTO 1: EL ASCENSO Y LA BAHÍA DE MANTENIMIENTO ---
  'act1_intro': {
    id: 'act1_intro',
    speaker: 'Diego',
    speakerRole: 'Cadete de Enlace',
    speakerColor: '#F2B544',
    mood: 'neutral',
    avatarType: 'diego',
    text: 'Mira quién viene. La nueva Jefa de Escuadrón de Ingeniería. Oficial a cargo en tiempo récord, ¿no? Qué curioso cómo algunos filtros de promoción se aceleran cuando tienes amigos en el puente central.',
    autoNextId: 'act1_vale_response'
  },
  'act1_vale_response': {
    id: 'act1_vale_response',
    speaker: 'Vale',
    speakerRole: 'Líder de Escuadrón / Ingeniera',
    speakerColor: '#4FD1C5',
    mood: 'firm',
    avatarType: 'vale',
    text: 'El filtro lo pasaron mis 400 horas de código en el núcleo criogénico, Diego. Cuando el soporte vital del sector 3 falló el mes pasado, no vi a tus "contactos" ajustando las válvulas a 4 grados bajo cero.',
    autoNextId: 'act1_diego_retort'
  },
  'act1_diego_retort': {
    id: 'act1_diego_retort',
    speaker: 'Diego',
    speakerRole: 'Cadete de Enlace',
    speakerColor: '#F2B544',
    mood: 'concerned',
    avatarType: 'diego',
    text: 'Tranquila, solo era un comentario al aire. En la Red de Tropa todos comentan lo mismo. Ale, tú estuviste en la guardia esa noche, ¿a poco no es raro tanto reconocimiento?',
    choices: [
      {
        id: 'act1_choice_support',
        label: 'Respaldar el mérito de Vale: "El núcleo sigue funcionando gracias a sus cálculos técnicos, no a favores."',
        deltaSignal: 5,
        deltaRisk: 5,
        nextStepId: 'act1_vale_thanks'
      },
      {
        id: 'act1_choice_silence',
        label: 'Permanecer en silencio y fingir revisar las herramientas.',
        deltaSignal: -5,
        deltaRisk: 0,
        nextStepId: 'act1_silence_reaction'
      }
    ]
  },
  'act1_vale_thanks': {
    id: 'act1_vale_thanks',
    speaker: 'Vale',
    speakerRole: 'Líder de Escuadrón / Ingeniera',
    speakerColor: '#4FD1C5',
    mood: 'calm',
    avatarType: 'vale',
    text: 'Gracias por poner los hechos sobre la mesa, Ale. El trabajo técnico habla por sí solo. Oye, el relay de comunicación con el soporte criogénico tiene interferencia por las tormentas solares. ¿Me ayudas a calibrar la onda en el osciloscopio de la consola de Bahía 4?',
    choices: [
      {
        id: 'act1_goto_oscilloscope',
        label: 'Abrir Osciloscopio de Bahía 4 (Calibrar Onda)',
        nextStepId: 'TRIGGER_OSCILLOSCOPE'
      },
      {
        id: 'act1_end_support',
        label: 'Continuar hacia la Consola Central de Red',
        nextStepId: 'END_DIALOGUE'
      }
    ]
  },
  'act1_silence_reaction': {
    id: 'act1_silence_reaction',
    speaker: 'Vale',
    speakerRole: 'Líder de Escuadrón / Ingeniera',
    speakerColor: '#4FD1C5',
    mood: 'concerned',
    avatarType: 'vale',
    text: 'Ya veo. El silencio cómodo de siempre. Sigan con su guardia, tengo calibraciones que terminar sola.',
    choices: [
      {
        id: 'act1_end_silence',
        label: 'Dirigirte a la Consola Central de Red',
        nextStepId: 'END_DIALOGUE'
      }
    ]
  },

  // --- ACTO 2: EL ECO Y EL HOLOFAKE ---
  'act2_alert_root': {
    id: 'act2_alert_root',
    speaker: 'El Eco (Canal No Moderado)',
    speakerRole: 'Transmisión Clandestina Anónima',
    speakerColor: '#D7263D',
    mood: 'critical',
    avatarType: 'eco',
    text: 'ARCHIVO ADJUNTO // VALE_VERDAD_ASCENSO.HOLO [Render Sintético]\n\n"¿Crees que Vale ganó la jefatura por mérito técnico? Miren esta proyección del hangar de carga... juzguen ustedes mismos si merece el mando."',
    choices: [
      {
        id: 'act2_choice_forward',
        label: 'Reenviar a la sub-red de cadetes: "Miren de qué están hablando..." (-15 Señal)',
        deltaSignal: -15,
        deltaRisk: 0,
        nextStepId: 'act2_forward_result'
      },
      {
        id: 'act2_choice_firewall',
        label: 'Activar Cortafuegos de Red: Aislar el nodo de «El Eco» (Minijuego de Enrutamiento)',
        nextStepId: 'TRIGGER_FIREWALL'
      },
      {
        id: 'act2_choice_scan',
        label: 'Escanear metadatos del archivo: Iniciar análisis forense visual (+5 Señal, +10 Riesgo)',
        nextStepId: 'TRIGGER_SCANNER'
      },
      {
        id: 'act2_choice_chat_vale',
        label: 'Escribir a Vale por canal cifrado privado: Escucha y apoyo (+10 Señal, +5 Riesgo)',
        deltaSignal: 10,
        deltaRisk: 5,
        nextStepId: 'act2_dm_vale'
      }
    ]
  },
  'act2_forward_result': {
    id: 'act2_forward_result',
    speaker: 'Consola del Sistema',
    speakerRole: 'Telemetría de Red',
    speakerColor: '#D7263D',
    mood: 'critical',
    avatarType: 'eco',
    text: 'ALERTA: El archivo se ha multiplicado en 4 subcanales. Los comentarios hostiles crecen exponencialmente. Vale ha desconectado su comunicador personal de la red general. Has actuado como repetidor del daño.',
    choices: [
      {
        id: 'act2_forward_proceed',
        label: 'Proceder a la Mesa de Auditoría de Comandancia',
        nextStepId: 'TRIGGER_ACT3'
      }
    ]
  },
  'act2_dm_vale': {
    id: 'act2_dm_vale',
    speaker: 'Vale',
    speakerRole: 'Canal Cifrado Privado',
    speakerColor: '#4FD1C5',
    mood: 'concerned',
    avatarType: 'vale',
    text: 'Ale... ya me avisaron lo que están subiendo al canal no moderado. Están usando mi imagen para inventar una escena que jamás ocurrió y desacreditarme ante el escuadrón. Gracias por no reenviarlo ni intentar hablar por mí sin preguntarme. ¿Me acompañas a reportarlo formalmente?',
    choices: [
      {
        id: 'act2_dm_support_yes',
        label: 'Acompañar a Vale: "Cuentas con mi respaldo en la comandancia."',
        deltaSignal: 5,
        deltaRisk: 5,
        nextStepId: 'TRIGGER_ACT3'
      },
      {
        id: 'act2_dm_also_scan',
        label: 'Sugerir antes un escaneo pericial: "Déjame extraer los metadatos para llevar pruebas técnicas irrebatibles."',
        nextStepId: 'TRIGGER_SCANNER'
      }
    ]
  },

  // --- ACTO 3: LA MESA DE AUDITORÍA INSTITUCIONAL ---
  'act3_audit_root': {
    id: 'act3_audit_root',
    speaker: 'Comandante Rosa',
    speakerRole: 'Dirección de la Estación KUNTUR',
    speakerColor: '#E86AA8',
    mood: 'firm',
    avatarType: 'rosa',
    text: 'Estamos reunidos por la anomalía detectada en los canales de comunicaciones. Circulan acusaciones contra la Jefa de Escuadrón Vale. Sargento Ortega, ¿cuál es el reporte preliminar?',
    autoNextId: 'act3_ortega_dismiss'
  },
  'act3_ortega_dismiss': {
    id: 'act3_ortega_dismiss',
    speaker: 'Sargento Ortega',
    speakerRole: 'Oficial de Disciplina y Logística',
    speakerColor: '#5E4FA2',
    mood: 'neutral',
    avatarType: 'ortega',
    text: 'Comandante, con el debido respeto, esto son roces y memes típicos entre cadetes. Abrir un sumario formal por un archivo de chat distrae a la dotación de las tareas críticas. Recomiendo borrar el historial y cerrar el asunto sin mayor aspaviento.',
    autoNextId: 'act3_rosa_asks_ale'
  },
  'act3_rosa_asks_ale': {
    id: 'act3_rosa_asks_ale',
    speaker: 'Comandante Rosa',
    speakerRole: 'Dirección de la Estación KUNTUR',
    speakerColor: '#E86AA8',
    mood: 'firm',
    avatarType: 'rosa',
    text: 'Cadete Ale, sus terminales registraron el tráfico de la red. Si recolectó evidencia forense en su Datapad, preséntela ahora.',
    choices: [] // Dynamically generated based on Ale's inventory!
  },
  'act3_report_metadata': {
    id: 'act3_report_metadata',
    speaker: 'Comandante Rosa',
    speakerRole: 'Dirección de la Estación KUNTUR',
    speakerColor: '#E86AA8',
    mood: 'calm',
    avatarType: 'rosa',
    text: 'Informe pericial de IA verificado. Falla lumínica de 38°, artefactos de ruido de 14.2 kHz y firma de modelo generativo no autorizado. Esto no es una broma: es sabotaje a la cadena de mando y violencia digital tipificada. Iniciamos sumario disciplinario contra el terminal emisor.',
    autoNextId: 'act3_vale_supported'
  },
  'act3_vale_supported': {
    id: 'act3_vale_supported',
    speaker: 'Vale',
    speakerRole: 'Líder de Escuadrón / Ingeniera',
    speakerColor: '#4FD1C5',
    mood: 'firm',
    avatarType: 'vale',
    text: 'Agradezco que la evidencia técnica y el respeto a mi autonomía hayan prevalecido frente al morbo. Los sistemas del hangar operan al cien por ciento; mi lugar de liderazgo sigue firme.',
    choices: [
      {
        id: 'act3_finalize_constelacion',
        label: 'Ver Conclusión de la Transmisión',
        nextStepId: 'TRIGGER_ENDING'
      }
    ]
  },
  'act3_downplay_reaction': {
    id: 'act3_downplay_reaction',
    speaker: 'Sargento Ortega',
    speakerRole: 'Oficial de Disciplina y Logística',
    speakerColor: '#5E4FA2',
    mood: 'neutral',
    avatarType: 'ortega',
    text: 'Como anticipé. Sin pruebas de software ni reclamos firmes, esto se archiva. Se ordena a la tropa volver a sus puestos y evitar dramatismos.',
    autoNextId: 'act3_vale_disappointed'
  },
  'act3_vale_disappointed': {
    id: 'act3_vale_disappointed',
    speaker: 'Vale',
    speakerRole: 'Líder de Escuadrón / Ingeniera',
    speakerColor: '#4FD1C5',
    mood: 'concerned',
    avatarType: 'vale',
    text: 'El archivo se archiva en el papel, pero en el pasillo el daño ya está hecho. Cuando la gente que trabaja contigo prefiere no comprometerse, no hay forma de sostener un liderazgo digno.',
    choices: [
      {
        id: 'act3_finalize_bad',
        label: 'Ver Conclusión de la Transmisión',
        nextStepId: 'TRIGGER_ENDING'
      }
    ]
  }
};
