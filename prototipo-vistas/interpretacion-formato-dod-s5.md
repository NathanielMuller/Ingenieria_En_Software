# Interpretacion del Formato DOD S5

## Fuente tomada como base

La estructura de este archivo se basa en el formato visual del Excel `PRY3211_Exp2_S5_formato_de_respuesta_Definition_Of_Done_Vistas_de_Diseño.xlsx`, segun la captura compartida.

---

## Estructura del formato

El archivo de DOD trabaja con una evaluacion por componentes o artefactos.

Cada componente se evalua con los mismos 4 criterios:

1. Todas las pruebas unitarias y funcionales son correctas.
2. El codigo fuente esta documentado y versionado.
3. Actualizada ultima version funcional con cambios aplicados.
4. Pruebas en dispositivos y/o navegadores cumplida.

Cada criterio se califica con una escala de 0 a 3:

- Valor 0: Nunca
- Valor 1: A veces
- Valor 2: Frecuentemente
- Valor 3: Siempre

---

## Como se interpreta el porcentaje por componente

Cada componente tiene 4 criterios.

Puntaje maximo por componente:

`4 criterios x 3 puntos = 12 puntos`

Formula sugerida para el porcentaje del componente:

`(puntaje_obtenido / 12) x 100`

Ejemplo visto en la captura:

- criterio 1 = 3
- criterio 2 = 3
- criterio 3 = 3
- criterio 4 = 0

Total del componente:

`(9 / 12) x 100 = 75%`

Eso coincide con el 75% mostrado para el Componente 1.

---

## Observacion importante sobre el formato

La plantilla oficial debe interpretarse con 4 componentes.

Aunque el ejemplo visual del profesor tenga errores de relleno o inconsistencias, la estructura utilizable del formato es esta:

- 4 bloques de componente en la tabla principal;
- 4 criterios repetidos por cada componente;
- una tabla resumen de artefactos con `Componente 1`, `Componente 2`, `Componente 3`, `Componente 4` y `Total`.

Por eso, para este trabajo, la adaptacion correcta es mantener exactamente 4 componentes y ajustar el contenido del DOD a los componentes reales que tu definiste para el proyecto.

---

## Adaptacion recomendada a este proyecto

Para las vistas del prototipo creado en S5, la agrupacion mas ordenada es esta:

### Componente 1. Consulta y catalogo

Incluye:

- `index.html`
- `habitaciones.html`
- `detalle-habitacion.html`

Objetivo:

Representar el flujo inicial del cliente desde la consulta de disponibilidad hasta la revision detallada de la habitacion.

### Componente 2. Acceso, reserva y confirmacion

Incluye:

- `acceso.html`
- `reserva.html`
- `confirmacion.html`

Objetivo:

Representar autenticacion, captura de datos, calculo del 30 por ciento y confirmacion final.

### Componente 3. Gestion administrativa

Incluye:

- `admin.html`

Objetivo:

Representar el panel de trabajo del administrador con sus modulos principales.

### Componente 4. Vista operativa del trabajador

Incluye:

- `trabajador.html`

Objetivo:

Representar la vista restringida del personal operativo enfocada en calendario, reservas y servicios contratados.

---

## Que conviene poner en la documentacion final de Semana 5

Cuando se redacte el informe final, el DOD deberia explicarse asi:

- se evaluaron los artefactos visuales del prototipo por componentes;
- cada componente fue revisado con 4 criterios comunes de calidad y completitud;
- la escala de evaluacion fue de 0 a 3;
- el porcentaje por componente se obtuvo sobre un maximo de 12 puntos;
- el total general permite estimar el nivel de avance o completitud del diseno.

---

## Criterio tecnico para este prototipo

En este caso, el prototipo HTML de S5 es una base de diseno y no una aplicacion funcional completa. Por eso, al momento de cargar el DOD final, conviene ser cuidadoso con el criterio de pruebas unitarias y funcionales:

- si el docente espera una interpretacion estricta, ese criterio puede mantenerse bajo mientras no exista implementacion real del sistema;
- si el foco esta puesto en las vistas de diseno, puede interpretarse como validacion visual, navegacion y consistencia del prototipo.

La decision final conviene tomarla segun como quieras defender la entrega.
