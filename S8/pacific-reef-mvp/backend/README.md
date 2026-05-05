# Pacific Reef MVP Backend

Backend MVP para el proyecto Gestion de Reserva Hotelera Pacific Reef dentro de una estructura autocontenida lista para repositorio.

## Lo que deja cubierto este corte

- autenticacion basica por perfil cliente, administrador y trabajador;
- registro de cliente;
- consulta de disponibilidad real contra MySQL;
- detalle de habitacion;
- creacion de reserva con abono del 30 por ciento;
- confirmacion con ticket y QR;
- panel administrativo minimo;
- panel operativo de trabajador.

## Estructura

- `src/config`: configuracion de entorno y base de datos.
- `src/controllers`: adaptadores HTTP.
- `src/services`: logica de negocio.
- `src/repositories`: acceso a datos.
- `src/routes`: definicion de endpoints.
- `src/utils`: helpers transversales.

## Configuracion

1. Copiar `.env.example` a `.env`.
2. Ajustar credenciales MySQL reales.
3. Ejecutar los scripts SQL de `../database` en este orden:
   - `01_bd_mejorada.sql`
   - `02_carga_datos.sql`

## Ejecucion

```powershell
Set-Location ".\backend"
npm install
npm start
```

Estos comandos suponen que primero se ingreso a la carpeta raiz del proyecto `pacific-reef-mvp/`.

El backend sirve el frontend directamente desde `../frontend`.

## Credenciales demo esperadas

- Admin: `admin@pacificreef.cl` / `Admin123*`
- Trabajador: `trabajador@pacificreef.cl` / `Trabajador123*`
- Cliente: `ana.paredes@email.com` / `Cliente123*`

## Endpoints MVP

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/rooms/availability`
- `GET /api/rooms/:roomId`
- `POST /api/reservations`
- `GET /api/reservations/:reservationCode`
- `GET /api/admin/dashboard`
- `PATCH /api/admin/reservations/:reservationCode/status`
- `GET /api/staff/dashboard`