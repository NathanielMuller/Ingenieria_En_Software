# Documentacion Base de Vistas S5

## Proposito del archivo

Este documento resume las vistas diseniadas para la Semana 5 del proyecto Gestion de Reserva Hotelera del Hotel Pacific Reef. Su objetivo es dejar clara la funcion de cada interfaz, su relacion con las historias de usuario y los puntos que luego deben trasladarse al documento final de la entrega.

La base funcional considerada para esta semana proviene de la version final de Semana 3 y de los diagramas ya definidos en Semana 4.

---

## Alcance de estas vistas

Las vistas creadas en esta carpeta representan el prototipo visual inicial del sistema. No corresponden todavia a una implementacion funcional completa, sino a una aproximacion de interfaz que permite:

- visualizar el flujo principal del cliente;
- representar el acceso de usuarios segun perfil;
- mostrar la reserva con calculo del pago inicial del 30 por ciento;
- exponer una confirmacion con ticket y QR;
- representar la gestion administrativa principal;
- representar la vista operativa del trabajador.

Estas vistas sirven como apoyo para la documentacion de la Semana 5 y como base para relacionar front-end y back-end en el diagrama de componentes.

---

## Estructura del prototipo

### Archivos principales

- `index.html`: pantalla de inicio y consulta de disponibilidad.
- `habitaciones.html`: listado de habitaciones disponibles.
- `detalle-habitacion.html`: detalle visual de una habitacion.
- `acceso.html`: inicio de sesion y registro.
- `reserva.html`: formulario y resumen de reserva.
- `confirmacion.html`: confirmacion final con ticket y QR.
- `admin.html`: panel principal administrativo.
- `trabajador.html`: panel operativo del trabajador.

### Archivos de soporte

- `assets/css/styles.css`: estilos visuales compartidos.
- `assets/vendor/bootstrap/css/bootstrap.min.css`: estilos locales de Bootstrap.
- `assets/vendor/bootstrap/js/bootstrap.bundle.min.js`: comportamiento local de Bootstrap.

---

## Descripcion de las vistas

## 1. Vista de inicio y consulta de disponibilidad

### Archivo

`index.html`

### Objetivo

Servir como puerta de entrada al sistema para visitantes y clientes. Debe permitir una consulta rapida por rango de fechas y reforzar una experiencia clara y elegante.

### Elementos principales

- barra de navegacion principal;
- boton de acceso al sistema;
- formulario de consulta con fecha de entrada, fecha de salida y cantidad de huespedes;
- acceso a habitaciones y reserva;
- seccion de beneficios y navegacion a las vistas clave.

### Relacion funcional

- consultar disponibilidad;
- ver habitaciones disponibles;
- cambiar idioma;
- acceder a registro o inicio de sesion.

### Lo que conviene documentar despues

- por que esta vista es la entrada principal del cliente;
- que informacion prioriza;
- como mejora la claridad del flujo inicial.

---

## 2. Vista de habitaciones disponibles

### Archivo

`habitaciones.html`

### Objetivo

Mostrar al usuario las alternativas disponibles segun la consulta realizada, permitiendo filtrar, comparar y pasar al detalle de la habitacion.

### Elementos principales

- resumen de la busqueda realizada;
- panel lateral de filtros;
- tarjetas de habitaciones con precio, descripcion breve y equipamiento;
- acciones para ver detalle o reservar.

### Relacion funcional

- listar habitaciones disponibles;
- comparar opciones;
- conectar con el detalle y con la reserva.

### Lo que conviene documentar despues

- por que esta vista facilita la comparacion de alternativas;
- como se organiza la informacion sin sobrecargar al usuario;
- que criterios visuales se usaron para jerarquizar precio, capacidad y acciones.

---

## 3. Vista de detalle de habitacion

### Archivo

`detalle-habitacion.html`

### Objetivo

Entregar una descripcion mas completa de la habitacion para apoyar la decision de reserva.

### Elementos principales

- galeria principal;
- descripcion general de la habitacion;
- equipamiento y condiciones principales;
- resumen lateral con precio estimado y acceso directo a la reserva.

### Relacion funcional

- ver detalle de habitacion;
- revisar equipamiento, informacion y precio;
- continuar con la reserva.

### Lo que conviene documentar despues

- por que esta vista reduce incertidumbre antes de reservar;
- como se representa el catalogo visual;
- como se vincula con la consulta y con la reserva.

---

## 4. Vista de acceso de usuarios

### Archivo

`acceso.html`

### Objetivo

Unificar en una misma interfaz el inicio de sesion y el registro para no fragmentar innecesariamente el flujo.

### Elementos principales

- bloque visual de contexto;
- pestanias para iniciar sesion o registrarse;
- seleccion de perfil de usuario;
- formulario de datos personales y credenciales.

### Relacion funcional

- registrarse;
- iniciar sesion segun perfil;
- permitir entrada de cliente, administrador y trabajador.

### Lo que conviene documentar despues

- por que se unificaron registro e inicio de sesion;
- como esta vista simplifica el acceso;
- que diferencia de uso existe entre perfiles.

---

## 5. Vista de reserva y pago inicial

### Archivo

`reserva.html`

### Objetivo

Representar el flujo principal del negocio: completar los datos de la reserva, validar informacion y mostrar el pago inicial del 30 por ciento.

### Elementos principales

- formulario con fechas y datos del huesped;
- seleccion de metodo de pago;
- resumen economico de la reserva;
- bloque de validaciones visibles;
- boton de confirmacion.

### Relacion funcional

- seleccionar dias de estadia;
- validar disponibilidad;
- calcular total de estadia;
- calcular pago inicial del 30 por ciento;
- confirmar reserva.

### Lo que conviene documentar despues

- por que esta es la vista mas critica del flujo;
- como se transparenta el calculo economico al usuario;
- que validaciones se hacen visibles para aumentar confianza.

---

## 6. Vista de confirmacion

### Archivo

`confirmacion.html`

### Objetivo

Mostrar el cierre exitoso del flujo con los datos principales de la reserva, el ticket y una representacion del codigo QR.

### Elementos principales

- mensaje principal de confirmacion;
- resumen final de la reserva;
- bloque visual para QR;
- acciones posteriores.

### Relacion funcional

- generar ticket de reserva;
- asociar codigo QR;
- representar envio de confirmacion al cliente.

### Lo que conviene documentar despues

- como esta vista confirma formalmente la operacion;
- por que se muestra QR y codigo de reserva;
- como se cierra el flujo de cliente de forma comprensible.

---

## 7. Vista administrativa principal

### Archivo

`admin.html`

### Objetivo

Concentrar la operacion administrativa en una interfaz sobria, ordenada y utilitaria para gestionar reservas, clientes, trabajadores, catalogo, precios y reportes.

### Elementos principales

- barra lateral de navegacion por modulos;
- indicadores generales del negocio;
- tabla de reservas recientes;
- bloque de resumen de modulos visibles.

### Relacion funcional

- gestionar reservas;
- administrar clientes;
- crear cuentas de trabajadores;
- actualizar catalogo y precios;
- consultar reportes.

### Lo que conviene documentar despues

- por que se centraliza la gestion en un panel;
- como se diferencian las funciones administrativas del flujo del cliente;
- que modulos se proyectan como componentes del sistema.

---

## 8. Vista operativa del trabajador

### Archivo

`trabajador.html`

### Objetivo

Representar una interfaz mas acotada para personal operativo que necesita revisar reservas, calendario y servicios contratados sin administrar el sistema completo.

### Elementos principales

- calendario operativo;
- tabla de servicios contratados;
- listado breve de reservas del dia.

### Relacion funcional

- revisar calendario;
- revisar reservas del dia;
- consultar servicio contratado.

### Lo que conviene documentar despues

- por que el trabajador no requiere el mismo panel que un administrador;
- como se restringe el foco de esta vista a tareas operativas;
- que datos son prioritarios para la atencion del cliente.

---

## Criterios visuales aplicados

El prototipo fue construido con una linea visual simple, moderna y elegante, adecuada al contexto de reserva hotelera. Los criterios usados fueron:

- paleta sobria basada en tonos arena, verde azulado y blanco;
- jerarquia tipografica clara entre titulos, textos y acciones;
- uso de tarjetas, paneles y bloques suaves para organizar la informacion;
- foco en claridad del flujo antes que en decoracion excesiva;
- consistencia entre vistas de cliente, administrador y trabajador.

---

## Criterios de usabilidad y accesibilidad a mencionar en la documentacion

Para la redaccion final de Semana 5 conviene mencionar que estas vistas buscan cumplir criterios basicos de usabilidad y accesibilidad, por ejemplo:

- navegacion clara y predecible;
- botones visibles y con rotulos comprensibles;
- agrupacion logica de formularios y acciones;
- contraste suficiente entre fondo y texto;
- estructura adaptable a escritorio y tablet mediante Bootstrap;
- separacion entre perfiles y funciones segun contexto de uso.

---

## Relacion con UML 4+1 y con el diagrama de componentes

Estas vistas no reemplazan los diagramas UML de Semana 4, sino que los complementan.

- La vista de escenario ya definida en casos de uso explica quienes usan el sistema.
- Las vistas de proceso ya definidas en actividades explican como fluye la operacion.
- La vista logica ya definida en clases explica las entidades del dominio.
- Las vistas HTML de esta carpeta ayudan a materializar la capa de interfaz de usuario.
- A partir de estas interfaces se puede derivar la vista de componentes de Semana 5, separando front-end, back-end, base de datos y servicios asociados.

---

## Evidencias que luego conviene integrar en la documentacion final de S5

Cuando se redacte el documento final, desde este prototipo conviene rescatar:

- nombre y objetivo de cada vista;
- captura o imagen de cada pantalla principal;
- relacion entre cada vista y una o mas historias de usuario;
- justificacion breve de decisiones visuales;
- referencia al archivo fuente del prototipo;
- trazabilidad con Semana 3 y Semana 4;
- insumos para Trello y Git;
- base para la planilla DOD.

---

## Propuesta de tabla util para el informe final

Una tabla util para el documento final puede contener estas columnas:

| Vista | Archivo fuente | Usuario principal | Objetivo | Historias relacionadas |
| --- | --- | --- | --- | --- |
| Inicio y consulta | index.html | Cliente o visitante | Consultar disponibilidad | HU-03, HU-04 |
| Habitaciones disponibles | habitaciones.html | Cliente o visitante | Comparar opciones | HU-04, HU-05 |
| Detalle de habitacion | detalle-habitacion.html | Cliente o visitante | Revisar informacion completa | HU-05 |
| Acceso | acceso.html | Cliente, administrador, trabajador | Registrar o autenticar usuario | HU-01, HU-02 |
| Reserva | reserva.html | Cliente | Confirmar estadia y pago inicial | HU-06, HU-07, HU-08 |
| Confirmacion | confirmacion.html | Cliente | Mostrar ticket y QR | HU-09 |
| Panel administrativo | admin.html | Administrador | Gestionar operacion del hotel | HU-10, HU-11, HU-12, HU-13, HU-14 |
| Vista trabajador | trabajador.html | Trabajador | Revisar reservas y servicios | HU-15 |

---

## Uso recomendado de este archivo

Este archivo puede utilizarse como base para:

- redactar la seccion de vistas de usuario del informe final de Semana 5;
- preparar descripciones breves para Trello;
- justificar el diseno de interfaces frente a la pauta;
- apoyar la construccion del diagrama de componentes;
- preparar criterios para la DOD de vistas de diseno.
