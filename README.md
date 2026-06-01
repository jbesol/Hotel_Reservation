# Hotel Reservation System

API REST para gestión de reservas de hotel construida con Java y Spring Boot.  
Cubre el ciclo completo: habitaciones, huéspedes y reservas con máquina de estados y prevención de double booking.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Lenguaje | Java 23 |
| Framework | Spring Boot 3.5 |
| Persistencia | Spring Data JPA + Hibernate |
| Base de datos | PostgreSQL 16 |
| Contenedor BD | Docker Compose |
| Build | Maven |
| Pruebas API | Postman |

---

## Arquitectura

```
com.miportafolio.hotel_reservation
├── controller/     recibe requests HTTP, delega al servicio, retorna respuesta
├── service/        lógica de negocio, validaciones, reglas del dominio
├── repository/     acceso a datos con Spring Data JPA (queries JPQL custom)
├── entity/         entidades JPA mapeadas a tablas de PostgreSQL
├── dto/            Records de entrada (Request) y salida (Response) por dominio
├── enums/          TipoHabitacion · EstadoReserva
└── exception/      excepciones de dominio + GlobalExceptionHandler
```

El flujo siempre es **Controller → Service → Repository**. Los controllers nunca tocan entities directamente; los services nunca exponen entities hacia afuera — solo DTOs.

---

## Modelo de dominio

```
Huesped ──< Reserva >── Habitacion
```

- Un huésped puede tener muchas reservas.
- Una habitación puede tener muchas reservas (en fechas distintas, sin solapamiento).
- La reserva es la entidad central que une ambos lados.

---

## Máquina de estados — Reserva

```
PENDIENTE ──→ CONFIRMADA ──→ CHECKED_IN ──→ CHECKED_OUT
    │               │
    └──→ CANCELADA  └──→ CANCELADA
```

Las transiciones inválidas (ej. `CHECKED_OUT → PENDIENTE`) son rechazadas con `400 Bad Request`. El servicio valida el estado actual antes de permitir cualquier cambio.

---

## Decisiones de diseño

**Prevención de double booking**  
Antes de crear una reserva se ejecuta una query JPQL personalizada que detecta solapamiento de intervalos:
```sql
checkIn < otraCheckOut AND checkOut > otraCheckIn
-- Solo considera reservas CONFIRMADA o CHECKED_IN (no PENDIENTE ni CANCELADA)
```

**`@Transactional` en operaciones críticas**  
Crear una reserva y cambiar su estado están marcados con `@Transactional`. Si cualquier paso falla, la transacción completa se revierte — nunca queda la base de datos en estado inconsistente.

**DTOs como Records anidados**  
Cada dominio tiene un único archivo `XxxDto.java` con `Request` y `Response` como Records internos. Más limpio que tener cuatro archivos separados por entidad.

**Manejo centralizado de errores**  
`GlobalExceptionHandler` (@RestControllerAdvice) cubre tres casos con respuestas JSON consistentes:

| Excepción | HTTP | Cuándo |
|-----------|------|--------|
| `ResourceNotFoundException` | 404 | Entidad no encontrada por ID |
| `BusinessException` | 400 | Regla de negocio violada |
| `MethodArgumentNotValidException` | 422 | Campos con `@Valid` inválidos |

**Cálculo automático del total**  
El servicio calcula el total al crear la reserva:
```java
long noches = ChronoUnit.DAYS.between(checkIn, checkOut);
BigDecimal total = habitacion.getPrecioPorNoche().multiply(BigDecimal.valueOf(noches));
```

---

## Endpoints

Base URL: `http://localhost:8081/api/v1`

### Habitaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/habitaciones` | Crear habitación |
| `GET` | `/habitaciones` | Listar todas |
| `GET` | `/habitaciones/{id}` | Obtener por ID |
| `GET` | `/habitaciones/disponibles` | Solo las disponibles |
| `GET` | `/habitaciones/tipo/{tipo}` | Filtrar por tipo |
| `GET` | `/habitaciones/disponibles/fechas?checkIn=&checkOut=` | Disponibles en rango de fechas |
| `PUT` | `/habitaciones/{id}` | Actualizar |
| `DELETE` | `/habitaciones/{id}` | Eliminar |

Tipos válidos: `SIMPLE` · `DOBLE` · `SUITE` · `PRESIDENCIAL`

### Huéspedes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/huespedes` | Crear huésped |
| `GET` | `/huespedes` | Listar todos |
| `GET` | `/huespedes/{id}` | Obtener por ID |
| `PUT` | `/huespedes/{id}` | Actualizar |
| `DELETE` | `/huespedes/{id}` | Eliminar |

### Reservas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/reservas` | Crear reserva |
| `GET` | `/reservas` | Listar todas |
| `GET` | `/reservas/{id}` | Obtener por ID |
| `GET` | `/reservas/huesped/{id}` | Reservas de un huésped |
| `PATCH` | `/reservas/{id}/estado?nuevoEstado=` | Cambiar estado |

---

## Colección Postman

El archivo `hotel.postman_collection.json` en la raíz del repositorio contiene todos los endpoints listos para importar.

**Importar:** Postman → Import → seleccionar el archivo.  
La variable `{{base_url}}` apunta a `http://localhost:8081/api/v1` por defecto.

Incluye requests de prueba para los casos de negocio más importantes:
- Double booking — debe devolver `400`
- Transición de estado inválida — debe devolver `400`

---

## Ejecutar el proyecto

**Requisitos:** Docker Desktop · Java 23 · Maven

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/hotel-reservation
cd hotel-reservation

# 2. Levantar PostgreSQL en Docker
docker compose up -d

# 3. Iniciar la aplicación
./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:8081/api/v1`

### Configuración (`application.properties`)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5435/hotel_db
spring.datasource.username=hotel_user
spring.datasource.password=hotel_password
server.port=8081
spring.jpa.hibernate.ddl-auto=update
```

PostgreSQL corre en el puerto `5435` del host (mapeado a `5432` dentro del contenedor) para no colisionar con instalaciones locales.

---

## Frontend (complementario)

Interfaz visual construida con React 18 + Vite + Tailwind CSS. Su propósito es demostrar la API, no es el foco del proyecto.

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

Por defecto usa datos mock (`USE_MOCK = true` en `src/api/api.js`).  
Para conectar con el backend real: cambiar a `USE_MOCK = false` y asegurarse de que Spring Boot esté corriendo.
