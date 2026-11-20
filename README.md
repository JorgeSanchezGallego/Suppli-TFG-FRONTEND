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
| `/panel` | Con sesión | Página de bienvenida con el nombre y el rol del usuario. Aquí irán el catálogo y los pedidos |

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
- Con la sesión iniciada, el menú muestra el nombre del usuario y el botón **Cerrar sesión**.

> **Sobre el registro:** todo el que se registra entra como `empleado` y sin bar asignado. Puede iniciar sesión, pero no puede hacer pedidos hasta que el encargado de un bar lo añada a su local. Es una decisión de seguridad: así nadie de fuera puede hacer pedidos en nombre de un local.

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
- [ ] Aviso en el panel para los empleados que aún no tienen bar asignado
- [ ] **Catálogo** visual de productos, con búsqueda por nombre, categoría y proveedor
- [ ] **Carrito** para ir sumando productos a un pedido
- [ ] Envío del pedido al proveedor por **WhatsApp**, con el mensaje ya formateado
- [ ] **Historial de pedidos** y cambio de estado (`pendiente` → `enviado` → `entregado`)
- [ ] Panel del **encargado**: gestión de bares y empleados
- [ ] Panel del **proveedor**: gestión de su catálogo
- [ ] Gestión de proveedores

---

## Autor

**Jorge Sánchez Gallego**: TFG del ciclo de Desarrollo de Aplicaciones Web
Tutor: José Manuel Villar Ferradal
