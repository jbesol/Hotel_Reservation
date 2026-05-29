# Hotel Reservation System

API REST para gestión de reservas de hotel construida con Java y Spring Boot.

## Tecnologías

- **Java 23** — lenguaje principal
- **Spring Boot 3.5** — framework web
- **Spring Data JPA** — ORM para acceso a datos
- **Hibernate** — implementación JPA
- **PostgreSQL** — base de datos
- **Maven** — gestión de dependencias
- **Docker** — contenedor para la base de datos
- **Postman** — pruebas de API

## Arquitectura
controller/   →  recibe requests HTTP y delega al servicio
service/      →  lógica de negocio y reglas del dominio
repository/   →  acceso a datos con Spring Data JPA
entity/       →  modelos de base de datos
dto/          →  objetos de transferencia de datos (entrada/salida)
enums/        →  valores fijos del sistema
exception/    →  manejo centralizado de errores

## Modelo de dominio
Huesped ──< Reserva >── Habitacion

Un huésped puede tener muchas reservas.
Una habitación puede tener muchas reservas (en fechas distintas).

## Estados de una reserva
PENDIENTE → CONFIRMADA → CHECKED_IN → CHECKED_OUT
↓              ↓
CANCELADA      CANCELADA

Transiciones inválidas son rechazadas automáticamente con un error 400.

## Decisiones técnicas

**Prevención de double booking**
Antes de confirmar una reserva se verifica que no exista otra reserva
en estado CONFIRMADA o CHECKED_IN para la misma habitación y fechas.
La query usa lógica de solapamiento de intervalos:
`checkIn < otraCheckOut AND checkOut > otraCheckIn`

**@Transactional en operaciones críticas**
Las operaciones que modifican múltiples entidades (crear reserva,
cambiar estado) usan @Transactional — si algo falla, todo se revierte.

**Máquina de estados**
El sistema valida cada transición de estado. No puedes pasar de
CHECKED_OUT a PENDIENTE ni de CANCELADA a CONFIRMADA.

**DTOs con Records anidados**
Cada dominio tiene un solo archivo DTO con Request y Response como
Records anidados. Más limpio que tener archivos separados por cada tipo.

**Cálculo automático del total**
El precio total se calcula automáticamente al crear la reserva:
`noches = ChronoUnit.DAYS.between(checkIn, checkOut)`
`total = noches * precioPorNoche`

## Endpoints

### Habitaciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/habitaciones` | Crear habitación |
| GET | `/api/v1/habitaciones` | Listar todas |
| GET | `/api/v1/habitaciones/{id}` | Obtener por ID |
| GET | `/api/v1/habitaciones/disponibles` | Listar disponibles |
| GET | `/api/v1/habitaciones/tipo/{tipo}` | Filtrar por tipo |
| GET | `/api/v1/habitaciones/disponibles/fechas?checkIn=&checkOut=` | Disponibles en fechas |
| PUT | `/api/v1/habitaciones/{id}` | Actualizar |
| DELETE | `/api/v1/habitaciones/{id}` | Eliminar |

### Huéspedes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/huespedes` | Crear huésped |
| GET | `/api/v1/huespedes` | Listar todos |
| GET | `/api/v1/huespedes/{id}` | Obtener por ID |
| PUT | `/api/v1/huespedes/{id}` | Actualizar |
| DELETE | `/api/v1/huespedes/{id}` | Eliminar |

### Reservas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/reservas` | Crear reserva |
| GET | `/api/v1/reservas` | Listar todas |
| GET | `/api/v1/reservas/{id}` | Obtener por ID |
| GET | `/api/v1/reservas/huesped/{id}` | Reservas por huésped |
| PATCH | `/api/v1/reservas/{id}/estado?nuevoEstado=` | Cambiar estado |

## Correr el proyecto

**Requisitos:** Docker Desktop, Java 23, Maven

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/hotel-reservation
cd hotel-reservation

# 2. Levantar PostgreSQL
docker compose up -d

# 3. Correr la app
./mvnw spring-boot:run
```

API disponible en `http://localhost:8081`

## Variables de configuración

En `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5435/hotel_db
spring.datasource.username=hotel_user
spring.datasource.password=hotel_password
server.port=8081
```

## Tipos de habitación

- `SIMPLE` — habitación individual
- `DOBLE` — habitación doble
- `SUITE` — suite estándar
- `PRESIDENCIAL` — suite presidencial