# Plan de Implementación: Ocultamiento de Pistas en Opciones de Diálogo

Se eliminarán las etiquetas explícitas y los colores de advertencia antes de elegir, permitiendo que el jugador tome decisiones basadas únicamente en su propio criterio y empatía, revelando la categoría de la respuesta y su impacto formativo inmediatamente después de seleccionar.

## Cambios Propuestos

### 1. Nivel 1: Taller de Mantenimiento (`src/components/Level1Taller.tsx`)
* **Eliminar etiquetas de spoiler previas a la elección:**
  * Remover `[COMENTARIO MACHISTA]`, `[TESTIGO PASIVO / SILENCIO]` y `[TESTIGO ACTIVO // PONER UN LÍMITE FIRME]`.
* **Neutralizar diseño visual de los botones:**
  * Reemplazar los bordes de color verde, amarillo y rojo por un borde neutro y uniforme (`border-[#5E4FA2]/50 hover:border-[#4FD1C5]`).
  * Identificar las opciones con prefijos limpios y neutros: `A)`, `B)` y `C)`.
* **Mantener la revelación inmediata post-elección:**
  * Al hacer clic, se muestra la tarjeta explicativa detallando:
    * Categoría de la respuesta (Testigo activo, silencio o machista).
    * Puntos sumados o restados (+25 o -40).
    * Justificación formativa y consecuencia en el mundo real.

### 2. Nivel 3: Laboratorio Forense (`src/components/Level3Forensic.tsx`)
* **Eliminar etiquetas de spoiler en el dilema del chat grupal:**
  * Remover `[SOLICITAR REENVÍO / DIFUNDIR]`, `[CULPABILIZAR A LA VÍCTIMA]` y `[FRENAR EL ACOSO // TESTIGO ACTIVO]`.
* **Diseño neutro de botones:**
  * Presentar las opciones de respuesta al grupo como `A)`, `B)` y `C)` con estilo uniforme sin sesgo visual.
* **Revelación formativa inmediata:**
  * Tras seleccionar, mostrar la tarjeta de análisis ético y el impacto en la viralización antes de ingresar al escáner pericial.

---

## Plan de Verificación

### Pruebas Automatizadas
* Ejecutar `lint_applet` para validar sintaxis de TypeScript y componentes React.
* Ejecutar `compile_applet` para confirmar la compilación exitosa del proyecto.

### Pruebas Visuales y de Experiencia de Usuario
* En el **Nivel 1**, verificar que las tres opciones aparezcan sin colores ni etiquetas acusatorias (solo A, B y C con el texto del diálogo).
* Comprobar que al hacer clic en una opción, se active de inmediato la tarjeta de retroalimentación indicando los puntos ganados o perdidos y el motivo.
* En el **Nivel 3**, verificar la misma experiencia limpia y neutra en las opciones del canal público de cadetes.
