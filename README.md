# Suppli · Frontend

**Suppli** es una plataforma web de gestión de proveedores para hostelería, desarrollada como Trabajo de Fin de Grado del ciclo de **Desarrollo de Aplicaciones Web (DAW)**.

El objetivo es quitarle al encargado el papel de cuello de botella en las compras. Cualquier trabajador autorizado del local puede buscar los productos que necesita, ver a qué proveedor pertenecen y preparar el pedido, que se envía al proveedor por WhatsApp con el mensaje ya formateado.

> **Estado actual: en desarrollo.** Este repositorio contiene el **frontend en React**. Ya están hechas la landing, la página "Quiénes somos", el login, el registro y la gestión de la sesión. Faltan el catálogo, el carrito y los pedidos (ver [Próximos pasos](#próximos-pasos)). La API REST está en su propio repositorio: [Suppli-TFG-BACKEND](https://github.com/JorgeSanchezGallego/Suppli-TFG-BACKEND).

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Librería de interfaz | React 19 |
| Herramienta de desarrollo y build | Vite 8 |
| Navegación | React Router 7 |
| Estilos | Tailwind CSS 4 |
| Tipografía | Outfit (Google Fonts) |
| Estado de la sesión | Context API de React |
| Peticiones a la API | `fetch` nativo |
| Calidad de código | Oxlint |

El proyecto completo sigue la arquitectura **MERN** (MongoDB, Express, React, Node.js).

---

## Estructura del proyecto

```
frontend-app/
├── public/
│   └── favicon.svg           # Icono de la pestaña
├── src/
│   ├── api/                  # Cliente de la API (fetch) y llamadas de usuarios
│   ├── assets/img/           # Fotos del hero, de los locales, del login y del registro
│   ├── components/           # Menú, footer, hero, logo, carrusel, tarjetas y ruta privada
│   │   └── formulario/       # Campos, campo de contraseña y diseño común de login y registro
│   ├── context/              # Contexto de la sesión (AuthProvider y useAuth)
│   ├── data/                 # Datos de los locales que se muestran en la landing
│   ├── pages/                # Páginas: Inicio, Quiénes somos, Login, Registro y Panel
│   ├── utils/                # Validaciones de los formularios
│   ├── App.jsx               # Definición de las rutas
│   ├── index.css             # Tailwind, paleta de colores y tipografía
│   └── main.jsx              # Punto de entrada
├── .env.example              # Plantilla de variables de entorno
├── index.html
├── package.json
└── vite.config.js
```

---

## Requisitos previos

- **Node.js** 20 o superior y **npm**
- El **backend** de Suppli funcionando ([Suppli-TFG-BACKEND](https://github.com/JorgeSanchezGallego/Suppli-TFG-BACKEND)), con su base de datos y, para probar, los datos del seed cargados

---

## Instalación

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/JorgeSanchezGallego/Suppli-TFG-FRONTEND.git
   ```

   ```bash
   cd Suppli-TFG-FRONTEND
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno.** Copia la plantilla (ver la sección siguiente):

   ```bash
   cp .env.example .env
   ```

---

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `VITE_API_URL` | No | URL base de la API. Por defecto `http://localhost:3000/api`. |

Ejemplo (`.env.example`):

```env
VITE_API_URL=http://localhost:3000/api
```

> El archivo `.env` está incluido en `.gitignore`. En Vite, solo las variables que empiezan por `VITE_` llegan al navegador, así que **no hay que poner nunca claves secretas** aquí.

---

## Ejecución

Antes de nada, arranca el backend (en su carpeta):

```bash
npm run dev
```

Después, en la carpeta del frontend:

**Modo desarrollo** (recarga automática):

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

**Build de producción** y vista previa del build:

```bash
npm run build
```

```bash
npm run preview
```

**Revisión del código:**

```bash
npm run lint
```

### Usuarios de prueba

Si el backend tiene cargado el seed (`npm run seed` en el backend), se puede entrar con cualquiera de sus usuarios, todos con la contraseña `Prueba1234`. Por ejemplo:

| Correo | Rol |
|---|---|
| `empleado1@suppli.test` | Empleado de *Kiosko Gómiz* y *Noray* |
| `empleado4@suppli.test` | Empleado sin bar asignado |
| `encargado1@suppli.test` | Encargado de *Kiosko Gómiz* y *Noray* |
| `proveedor1@suppli.test` | Proveedor de *Bebidas del Sur* |

La lista completa está en el README del backend.

---

## Páginas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Landing: hero a pantalla completa con el logo, y las tarjetas de los tres locales con carrusel de fotos, descripción, web y cómo llegar |
| `/quienes-somos` | Público | Origen del proyecto, el problema que resuelve, la solución y quién está detrás |
| `/login` | Público | Inicio de sesión. Si ya hay sesión, redirige a `/panel` |
| `/register` | Público | Registro de una cuenta nueva. Al terminar, inicia sesión automáticamente |
| `/panel` | Con sesión | Página de bienvenida con el nombre y el rol del usuario. Si es un empleado sin local, muestra un aviso para que pida al encargado que lo añada; si tiene locales, los muestra con su foto y su logo. Incluye un acceso directo al catálogo |
| `/catalogo` | Con sesión | Vista general de todos los proveedores: contacto, días de reparto, número de productos y categorías. Tiene un buscador que encuentra proveedores y también productos (indicando a qué proveedor se piden) |
| `/pedido` | Con sesión (empleado con local) | Revisión del pedido en curso: productos con su cantidad e importe, total, elección del local desde el que se pide, vista previa del mensaje y botón **Enviar por WhatsApp**, que guarda el pedido en la API y abre WhatsApp con el mensaje listo para el proveedor |
| `/historial` | Con sesión | Historial de pedidos según el rol: el empleado ve los de sus locales (suyos y de sus compañeros), el encargado los de todos sus locales y el proveedor los que ha recibido su empresa. Cada pedido es una tarjeta con proveedor (o local), fecha, quién lo hizo, estado y total, que se despliega para ver los productos. Filtros por estado y por local, y botón para marcar como entregado los pedidos pendientes (encargado y empleados del local) |
| `/catalogo/:proveedorId` | Con sesión | Productos de un proveedor, con buscador y filtro por categoría. Cada producto muestra su precio, proveedor y categoría, un icono de información que, al pasar el ratón, enseña el stock óptimo de invierno y verano y los días de reparto, y un selector de cantidad en su medida (lata, kg, barril…) |

### Diseño

- **Paleta cálida y clara:** crema (`#fbf7f1`), arena (`#e8dfd3`), terracota (`#c2643c`) y café (`#2b211b`). Están definidos en `src/index.css` y se usan como clases de Tailwind (`bg-crema`, `text-terracota`, etc.).
- **Tipografía:** Outfit.
- **Menú superior fijo:** es transparente sobre el hero y toma fondo al hacer scroll. Se esconde al bajar y vuelve a aparecer al subir. En móvil se convierte en un menú hamburguesa.
- **Login y registro:** foto a pantalla completa con el formulario en una tarjeta.
- **Diseño responsive**, probado en escritorio, tablet y móvil.

---

## Autenticación y sesión

- Al iniciar sesión, la API devuelve un **token JWT** (válido durante 1 día), que se guarda junto al usuario en `localStorage`. Así la sesión se mantiene al recargar o al volver otro día.
- Las peticiones protegidas envían la cabecera `Authorization: Bearer <token>`.
- Al cargar la página, y cada vez que se vuelve a la pestaña, el frontend pide los datos actualizados del usuario a `GET /api/usuarios/yo`. Así, si un encargado añade al empleado a un bar, el empleado lo ve sin tener que volver a iniciar sesión.
- La sesión se cierra sola cuando caduca el token o cuando la API responde `401`.
- El componente `RutaPrivada` protege las páginas que necesitan sesión. Si no hay sesión, lleva al login y, al entrar, devuelve a la página que se intentaba abrir.
- Con la sesión iniciada, el menú muestra un único enlace, **Panel**, además del nombre del usuario, el carrito (para empleados con local) y el botón **Cerrar sesión**. El resto de secciones (catálogo, pedidos…) se abren desde el panel, para que el menú no crezca con cada página nueva.

> **Sobre el registro:** todo el que se registra entra como `empleado` y sin bar asignado. Puede iniciar sesión, pero no puede hacer pedidos hasta que el encargado de un bar lo añada a su local. Es una decisión de seguridad: así nadie de fuera puede hacer pedidos en nombre de un local.

### Pedidos: un proveedor cada vez

Cada pedido va a **un solo proveedor**, igual que en la API. En el catálogo, el empleado va marcando cantidades y abajo aparece una barra con el pedido en curso: el proveedor, el número de productos y el total. Además, en el menú superior hay un **carrito** con un contador de productos; al pulsarlo se abre una vista previa del pedido con cada producto, su cantidad y su importe, el total y la opción de quitar productos o vaciarlo. Si intenta añadir un producto de otro proveedor, la app le avisa y le deja elegir entre seguir con el pedido actual o vaciarlo y empezar uno nuevo. El pedido en curso se guarda en `localStorage` para cada usuario, así que no se pierde al recargar.

Las cantidades son siempre **números enteros** (1, 2, 3…), igual que exige la API.

### Envío por WhatsApp

Desde **Revisar pedido** se llega a `/pedido`. Al pulsar **Enviar por WhatsApp**:

1. El pedido se guarda en la API (`POST /api/pedidos`) con el local elegido, y queda como `pendiente` en el historial.
2. Se abre `https://wa.me/<teléfono>?text=<mensaje>` con el teléfono del proveedor (se le añade el prefijo 34 si no lo tiene) y el mensaje ya escrito, para que el empleado solo tenga que pulsar enviar.
3. El pedido en curso se vacía y se muestra una confirmación, con un botón para volver a abrir WhatsApp por si el navegador lo bloqueó.

Ejemplo de mensaje:

```
Hola Luis, buenas tardes.
Te escribo desde Noray para hacerte el siguiente pedido:

- Aceitunas aliñadas: 1 kg
- Limones: 2 kg
- Patatas fritas: 1 bolsa 1kg
```

El saludo usa el nombre de la persona de contacto del proveedor y cambia según la hora (buenos días, buenas tardes o buenas noches).

Solo los **empleados con un local asignado** pueden preparar pedidos. Los demás usuarios pueden consultar el catálogo.

### Estados del pedido

Todo pedido se crea como **pendiente** y solo puede pasar a **entregado** cuando llega la mercancía. En el historial, cada pedido muestra su estado con un color (pendiente en ámbar y entregado en verde). Al desplegar un pedido pendiente aparece el botón **Marcar como entregado**, que solo ven el encargado y los empleados del local, igual que exige la API. Un pedido entregado ya no se puede modificar.

### Validaciones de los formularios

Los formularios comprueban los datos antes de enviarlos y muestran el error debajo de cada campo:

| Campo | Regla |
|---|---|
| Correo | Obligatorio y con formato válido |
| Contraseña (registro) | Mínimo 8 caracteres, con al menos una mayúscula y un número |
| Repetir contraseña | Tiene que coincidir con la contraseña |
| Teléfono | Teléfono español de 9 cifras que empiece por 6, 7, 8 o 9 (admite `+34` y espacios) |
| Fecha de nacimiento | Mínimo 16 años |
| Nombre, apellidos y residencia | Obligatorios |

Los errores que devuelve la API, como "Usuario o contraseña incorrectos" o "El usuario ya está registrado", se muestran en un aviso dentro del formulario.

---

## Próximos pasos

- [x] Estructura del proyecto con Vite, React Router y Tailwind
- [x] Landing con hero, tarjetas de los locales y footer
- [x] Página "Quiénes somos"
- [x] Login y registro con validaciones
- [x] Sesión con JWT, rutas protegidas y refresco de los datos del usuario
- [x] Aviso en el panel para los empleados que aún no tienen bar asignado, y lista de sus locales para los que sí lo tienen
- [x] **Catálogo** visual de productos, con búsqueda por nombre, categoría y proveedor
- [x] **Pedido en curso** para ir sumando productos, siempre de un solo proveedor, que se mantiene al recargar la página
- [x] Pantalla para **revisar el pedido** y elegir el local antes de enviarlo
- [x] Envío del pedido al proveedor por **WhatsApp**, con el mensaje ya formateado
- [x] **Historial de pedidos** y cambio de estado (`pendiente` → `entregado`)
- [ ] Panel del **encargado**: gestión de bares y empleados
- [ ] Panel del **proveedor**: gestión de su catálogo
- [ ] Gestión de proveedores

---

## Autor

**Jorge Sánchez Gallego**: TFG del ciclo de Desarrollo de Aplicaciones Web
Tutor: José Manuel Villar Ferradal
