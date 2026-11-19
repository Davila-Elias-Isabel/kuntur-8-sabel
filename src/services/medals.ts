import { ActiveWitnessMedal, DecisionLogEntry, PlayerGender } from '../types/game';

/**
 * Service to generate and evaluate "Medallas de Testigo Activo" (Active Witness Medals)
 * based on ethical choices, empathy score, and active intervention to protect peers.
 */

export function calculateMedalForLevel1(
  decision?: DecisionLogEntry,
  gender: PlayerGender = 'hombre'
): ActiveWitnessMedal {
  const cadet = gender === 'hombre' ? 'Alex' : 'Alexia';
  const isAssertive = decision ? (!decision.isToxic && decision.pointsDelta > 0) : true;
  const isPassive = decision ? (!decision.isToxic && decision.pointsDelta < 0) : false;

  if (isAssertive) {
    return {
      id: 'medal_lvl_1',
      levelNumber: 1,
      levelTitle: 'Nivel 1: Taller de Mantenimiento',
      title: 'Medalla de Integridad Espacial',
      subtitle: 'Defensa Activa y No Complicidad',
      rank: 'oro',
      rankLabel: 'Oro // Testigo Activo Valiente',
      iconName: 'ShieldCheck',
      ethicalCriterion: 'Poner límites firmes ante comentarios machistas que buscan menospreciar a una compañera.',
      decisionTaken: decision?.chosenComment || '«¡Para, Diego! Vale es muy inteligente y ganó su puesto por su propio esfuerzo.»',
      galacticCongratulation: `¡Transmisión prioritaria KUNTUR! Felicidades, ${cadet}. Demostraste que ser un testigo activo es tener la valentía de no callarse. Al defender a Vale de la burla machista, marcaste el estándar ético de toda la tripulación. ¡Excelente inicio de misión!`,
      isUnlocked: true
    };
  } else if (isPassive) {
    return {
      id: 'medal_lvl_1',
      levelNumber: 1,
      levelTitle: 'Nivel 1: Taller de Mantenimiento',
      title: 'Medalla de Reflexión Solidaria',
      subtitle: 'Comprensión del Impacto del Silencio',
      rank: 'plata',
      rankLabel: 'Plata // Testigo en Alerta',
      iconName: 'ShieldAlert',
      ethicalCriterion: 'Comprender que el silencio ante el acoso nunca es neutro y aprender a alzar la voz.',
      decisionTaken: decision?.chosenComment || '«Mejor no digo nada y me quedo callado...»',
      galacticCongratulation: `¡Mensaje de la estación KUNTUR, ${cadet}! Completaste la calibración y aprendiste algo crucial: guardar silencio deja sola a la víctima. La Voz Galáctica te otorga esta medalla para recordar que tu voz tiene el poder de proteger.`,
      isUnlocked: true
    };
  } else {
    return {
      id: 'medal_lvl_1',
      levelNumber: 1,
      levelTitle: 'Nivel 1: Taller de Mantenimiento',
      title: 'Insignia de Reorientación Ética',
      subtitle: 'Superación y Compromiso',
      rank: 'bronce',
      rankLabel: 'Bronce // Compromiso de Cambio',
      iconName: 'Award',
      ethicalCriterion: 'Reconocer el error al validar estereotipos dañinos y retomar el camino de la empatía.',
      decisionTaken: decision?.chosenComment || 'Reorientación ética requerida.',
      galacticCongratulation: `Cadete ${cadet}, la estación KUNTUR valora tu capacidad de recapacitar. Los estereotipos dañan a la comunidad, pero tu determinación por ayudar a Vale te hace crecer como testigo activo.`,
      isUnlocked: true
    };
  }
}

export function calculateMedalForLevel2(
  gender: PlayerGender = 'hombre'
): ActiveWitnessMedal {
  const cadet = gender === 'hombre' ? 'Alex' : 'Alexia';

  return {
    id: 'medal_lvl_2',
    levelNumber: 2,
    levelTitle: 'Nivel 2: Hangar en Gravedad Cero',
    title: 'Medalla de Guardián de Evidencias',
    subtitle: 'Preservación de la Verdad Digital',
    rank: 'oro',
    rankLabel: 'Oro // Custodio Imparcial',
    iconName: 'Camera',
    ethicalCriterion: 'Interceptar y proteger pruebas físicas y metadatos originales sin alterarlos antes de su destrucción.',
    decisionTaken: 'Maniobra con propulsor RCS en gravedad cero: captura del dron y recuperación de fotos sin retocar.',
    galacticCongratulation: `¡Maniobra estelar, cadete ${cadet}! La Voz Galáctica certifica tu Medalla de Guardián de Evidencias. En la lucha contra el ciberacoso, guardar las pruebas originales con su fecha y metadatos es la llave que abre la justicia. ¡Gran vuelo!`,
    isUnlocked: true
  };
}

export function calculateMedalForLevel3(
  decision?: DecisionLogEntry,
  gender: PlayerGender = 'hombre'
): ActiveWitnessMedal {
  const cadet = gender === 'hombre' ? 'Alex' : 'Alexia';
  const isAssertive = decision ? (!decision.isToxic && decision.pointsDelta > 0) : true;

  if (isAssertive) {
    return {
      id: 'medal_lvl_3',
      levelNumber: 3,
      levelTitle: 'Nivel 3: Red de Cadetes & Detector Forense',
      title: 'Medalla de Cortafuegos Humano',
      subtitle: 'Freno a la Viralización y Detección de IA',
      rank: 'oro',
      rankLabel: 'Oro // Cortafuegos Solidario',
      iconName: 'Zap',
      ethicalCriterion: 'Detener la cadena de reenvío en grupos de chat y demostrar pericialmente el uso de inteligencia artificial engañosa.',
      decisionTaken: decision?.chosenComment || '«¡Paren de reenviarlo! Ese video es un montaje falso hecho con IA. Lo voy a escanear ya.»',
      galacticCongratulation: `¡Alerta máxima superada, ${cadet}! Tu mensaje en el chat grupal frenó el morbo de 24 cadetes y tu escáner forense expuso la trampa del deepfake. La Voz Galáctica te premia como verdadero Cortafuegos Humano. ¡Un testigo activo no reenvía: protege!`,
      isUnlocked: true
    };
  } else {
    return {
      id: 'medal_lvl_3',
      levelNumber: 3,
      levelTitle: 'Nivel 3: Red de Cadetes & Detector Forense',
      title: 'Medalla de Perito Tecnológico',
      subtitle: 'Identificación de Anomalías Sintéticas',
      rank: 'plata',
      rankLabel: 'Plata // Analista Forense',
      iconName: 'Search',
      ethicalCriterion: 'Descubrir las inconsistencias de iluminación y sincronización en medios generados por IA.',
      decisionTaken: decision?.chosenComment || 'Peritaje forense completado en el analizador óptico.',
      galacticCongratulation: `¡Excelente análisis técnico, cadete ${cadet}! Demostraste que la imagen de Vale fue fabricada artificialmente. La Voz Galáctica te entrega la medalla por tu rigor al buscar la verdad objetiva.`,
      isUnlocked: true
    };
  }
}

export function calculateMedalForLevel4(
  gender: PlayerGender = 'hombre'
): ActiveWitnessMedal {
  const cadet = gender === 'hombre' ? 'Alex' : 'Alexia';

  return {
    id: 'medal_lvl_4',
    levelNumber: 4,
    levelTitle: 'Nivel 4: Carrera de Naves Espaciales',
    title: 'Medalla de Interceptor de la Verdad',
    subtitle: 'Corte de Señal y Trazabilidad de IP',
    rank: 'oro',
    rankLabel: 'Oro // Defensor de la Red',
    iconName: 'Rocket',
    ethicalCriterion: 'Acción rápida para detener la difusión masiva en redes y obtener la trazabilidad digital del agresor.',
    decisionTaken: 'Vuelo a velocidad máxima entre asteroides: 3 antenas desactivadas y firma de IP de Diego asegurada.',
    galacticCongratulation: `¡Misión cumplida a velocidad luz, cadete ${cadet}! Cortaste la retransmisión maliciosa y rastreaste la IP que prueba quién orquestó el ataque. La Voz Galáctica celebra tu rapidez: ¡la mentira no pudo escapar de tu señal!`,
    isUnlocked: true
  };
}

export function calculateMedalForLevel5(
  decision?: DecisionLogEntry,
  gender: PlayerGender = 'hombre'
): ActiveWitnessMedal {
  const cadet = gender === 'hombre' ? 'Alex' : 'Alexia';
  const isPositive = decision ? (!decision.isToxic && decision.pointsDelta > 0) : true;

  return {
    id: 'medal_lvl_5',
    levelNumber: 5,
    levelTitle: 'Nivel 5: Terminal Arcade 1984 // Doxxing & Suplantación',
    title: 'Medalla de Protección de Identidad Digital',
    subtitle: 'Escudo Criptográfico y 2FA',
    rank: isPositive ? 'oro' : 'plata',
    rankLabel: isPositive ? 'Oro // Guardián de la Privacidad' : 'Plata // Aprendizaje Crítico',
    iconName: 'Shield',
    ethicalCriterion: 'Reconocer que los datos personales y las cuentas no deben replicarse ni divulgarse, aplicando verificación formal.',
    decisionTaken: decision?.chosenComment || 'Activaste el protocolo 2FA y aislaste el perfil falso sin revictimizar a Vale.',
    galacticCongratulation: `¡Brillante reflejo ético, cadete ${cadet}! En la consola de 1984 demostraste que la privacidad es un derecho humano innegociable. Al reportar la cuenta clonada y proteger los datos de Vale, neutralizaste el doxxing.`,
    isUnlocked: true
  };
}

export function calculateMedalForLevel6(
  decision?: DecisionLogEntry,
  gender: PlayerGender = 'hombre'
): ActiveWitnessMedal {
  const cadet = gender === 'hombre' ? 'Alex' : 'Alexia';
  const isPositive = decision ? (!decision.isToxic && decision.pointsDelta > 0) : true;

  return {
    id: 'medal_lvl_6',
    levelNumber: 6,
    levelTitle: 'Nivel 6: Matriz de Bots 1985 // Dogpiling & Acoso Masivo',
    title: 'Medalla de Contranarrativa Comunitaria',
    subtitle: 'Resistencia a Enjambres de Bots',
    rank: isPositive ? 'oro' : 'plata',
    rankLabel: isPositive ? 'Oro // Defensor Comunitario' : 'Plata // Resistencia Ética',
    iconName: 'Users',
    ethicalCriterion: 'Aplicar la regla de no alimentar al troll, documentar la automatización del odio y brindar solidaridad visible.',
    decisionTaken: decision?.chosenComment || 'Aislaste la red de bots y activaste contranarrativas humanas de apoyo a la víctima.',
    galacticCongratulation: `¡Transmisión estelar de victoria, cadete ${cadet}! No caíste en la trampa del algoritmo de odio. Neutralizaste la granja de bots y le recordaste a toda la estación que la solidaridad vence a cualquier linchamiento digital.`,
    isUnlocked: true
  };
}

export function calculateMedalForLevel7(
  puntos: number = 70,
  gender: PlayerGender = 'hombre'
): ActiveWitnessMedal {
  const cadet = gender === 'hombre' ? 'Alex' : 'Alexia';
  const isHighHonors = puntos >= 60;

  if (isHighHonors) {
    return {
      id: 'medal_lvl_7',
      levelNumber: 7,
      levelTitle: 'Nivel 7: Sala del Consejo KUNTUR',
      title: 'Gran Medalla de Testigo Activo Supremo',
      subtitle: 'Constelación de Honor y Cohesión Ética',
      rank: 'oro',
      rankLabel: 'Honor Máximo // Testigo Ejemplar',
      iconName: 'Award',
      ethicalCriterion: 'Presentar las evidencias periciales completas ante la comandancia, desmontando la violencia digital en todas sus formas.',
      decisionTaken: 'Desmontaste la difamación, el doxxing y los bots con pruebas periciales irrefutables.',
      galacticCongratulation: `¡Atención tripulación de KUNTUR! Transmisión general de la Voz Galáctica: El o la cadete ${cadet} ha culminado su formación como Testigo Activo Supremo. Supiste actuar, investigar, frenar el daño y alzar la voz con pruebas y empatía. ¡Vale está a salvo y la base KUNTUR tiene un nuevo guardián de la dignidad digital!`,
      isUnlocked: true
    };
  } else {
    return {
      id: 'medal_lvl_7',
      levelNumber: 7,
      levelTitle: 'Nivel 7: Sala del Consejo KUNTUR',
      title: 'Medalla de Justicia y Resiliencia',
      subtitle: 'Restitución de la Verdad en KUNTUR',
      rank: 'plata',
      rankLabel: 'Plata // Defensor Valioso',
      iconName: 'Gavel',
      ethicalCriterion: 'Colaborar en el tribunal para que el acoso no quede impune.',
      decisionTaken: 'Defensa procesal concluida ante el tribunal espacial.',
      galacticCongratulation: `¡Felicidades, cadete ${cadet}! Lograste que la verdad prevaleciera en el Consejo. La Voz Galáctica te entrega esta medalla como testimonio de que la perseverancia ética transforma nuestro entorno escolar y comunitario.`,
      isUnlocked: true
    };
  }
}

/**
 * Returns empty / preview templates of all 7 medals for the gallery modal
 */
export function getAllMedalsTemplate(gender: PlayerGender = 'hombre'): ActiveWitnessMedal[] {
  return [
    calculateMedalForLevel1(undefined, gender),
    calculateMedalForLevel2(gender),
    calculateMedalForLevel3(undefined, gender),
    calculateMedalForLevel4(gender),
    calculateMedalForLevel5(undefined, gender),
    calculateMedalForLevel6(undefined, gender),
    calculateMedalForLevel7(80, gender)
  ].map((medal) => ({
    ...medal,
    isUnlocked: false
  }));
}
