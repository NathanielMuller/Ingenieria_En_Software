# README BD

## Proposito

Este conjunto de archivos fue preparado para respaldar la parte de base de datos de la entrega de Semana 6 del proyecto Gestion de Reserva Hotelera del Hotel Pacific Reef.

Su objetivo es evidenciar tres aspectos solicitados por la pauta:

- mejora de la base de datos implementada para el proyecto;
- carga de datos depurada, coherente y defendible;
- ejecucion de pruebas CRUD que demuestren el funcionamiento correcto de la capa de datos.

## Archivos del paquete

- `01_bd_mejorada.sql`: crea la base de datos y su estructura actualizada.
- `02_carga_datos.sql`: inserta datos de prueba consistentes con el caso del proyecto.
- `03_pruebas_crud.sql`: ejecuta pruebas CRUD sobre el modulo principal de reservas.

## Alcance de la mejora aplicada a la base de datos

La version incluida en esta carpeta toma como base el modelo inicial del proyecto y agrega mejoras orientadas a trazabilidad, consistencia y soporte del proceso de reservas.

### Mejoras principales

- incorporacion de `fecha_actualizacion` en tablas principales;
- incorporacion de `codigo_reserva` unico para trazabilidad operativa;
- incorporacion de `cantidad_huespedes` en la reserva;
- incorporacion de `observaciones` para registrar contexto de la operacion;
- incorporacion de `motivo_cancelacion` y `fecha_cancelacion` para manejar borrado logico;
- incorporacion de `referencia_pago` en pagos_reserva;
- agregacion de indices orientados a consultas por estado, fechas y relaciones frecuentes.

## Carga de datos

La carga de datos fue pensada para representar un escenario verosimil del hotel y permitir pruebas funcionales sobre la base relacional.

Incluye registros para:

- roles del sistema;
- usuarios, clientes y trabajador administrativo;
- categorias y habitaciones;
- imagenes y equipamientos;
- precios vigentes;
- reservas, pagos y tickets.

## Orden de ejecucion recomendado

Ejecutar los archivos en este orden:

1. `01_bd_mejorada.sql`
2. `02_carga_datos.sql`
3. `03_pruebas_crud.sql`

La ejecucion fue pensada para MySQL y puede realizarse en MySQL Workbench o en otro cliente compatible.

## Pruebas CRUD contempladas

El archivo `03_pruebas_crud.sql` valida el proceso principal del negocio a traves del modulo de reservas.

### Operaciones incluidas

1. `CREATE`: alta de un nuevo cliente y de una nueva reserva.
2. `READ`: consulta relacional de la reserva con cliente, habitacion, pago y ticket.
3. `UPDATE`: confirmacion de la reserva y actualizacion del estado del pago.
4. `DELETE logico`: cancelacion de la reserva sin eliminar el historico.

Adicionalmente, se incluye una consulta complementaria de habitaciones disponibles con precio vigente para reforzar la relacion entre catalogo y proceso de reserva.

## Evidencia sugerida para la entrega

Para respaldar esta parte del trabajo, conviene conservar capturas de los siguientes momentos:

1. creacion correcta de la base de datos;
2. listado de tablas creadas;
3. carga de datos visible en tablas principales;
4. resultado de la prueba `CREATE`;
5. resultado de la prueba `READ`;
6. resultado de la prueba `UPDATE`;
7. resultado de la prueba de cancelacion logica;
8. consulta de habitaciones disponibles con precio vigente.


La base de datos del proyecto fue mejorada respecto de su version inicial, incorporando atributos de trazabilidad y soporte operativo para el proceso de reservas. Posteriormente, se realizo una carga de datos depurada y coherente con el caso del Hotel Pacific Reef. Finalmente, se ejecutaron pruebas CRUD sobre el modulo de reservas, validando operaciones de creacion, consulta, actualizacion y cancelacion logica, con resultados correctos respaldados mediante evidencia visual.


Estas pruebas validan la capa de datos del sistema. No representan aun un backend funcional integrado con las vistas HTML del prototipo. En la defensa oral conviene mantener esta distincion para no sobredimensionar el avance real del proyecto y, al mismo tiempo, demostrar que la base de datos ya fue preparada y verificada como soporte para la etapa de construccion.