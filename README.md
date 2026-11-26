# Suppli · Frontend

**Suppli** es una plataforma web de gestión de proveedores para hostelería, desarrollada como Trabajo de Fin de Grado del ciclo de **Desarrollo de Aplicaciones Web (DAW)**.

El objetivo es quitarle al encargado el papel de cuello de botella en las compras. Cualquier trabajador autorizado del local puede buscar los productos que necesita, ver a qué proveedor pertenecen y preparar el pedido, que se envía al proveedor por WhatsApp con el mensaje ya formateado.

> **Estado actual:** este repositorio contiene el **frontend en React**, con todas las funciones principales terminadas: landing, login y registro, catálogo, pedido en curso, envío por WhatsApp, historial, paneles del empleado, del encargado y del proveedor, gestión de locales, de empleados y de proveedores, y política de cookies. La API REST está en su propio repositorio: [Suppli-TFG-BACKEND](https://github.com/JorgeSanchezGallego/Suppli-TFG-BACKEND).

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Librería de interfaz | React 19 |
| Herramienta de desarrollo y build | Vite 8 |
| Navegación | React Router 7 |
| Estilos | Tailwind CSS 4 |
| Tipografía | Outfit, servida desde `public/fonts` (sin peticiones a Google Fonts) |
| Estado de la sesión | Context API de React |
| Peticiones a la API | `fetch` nativo |
| Calidad de código | Oxlint |

El proyecto completo sigue la arquitectura **MERN** (MongoDB, Express, React, Node.js).

---

## Estructura del proyecto

```
frontend-app/
├── public/
│   ├── favicon.svg           # Icono de la pestaña
│   └── fonts/                # Tipografía Outfit (woff2), servida desde la propia app
├── src/
│   ├── api/                  # Cliente de la API (fetch) y llamadas por recurso: usuarios, bares, proveedores, productos y pedidos
│   ├── assets/img/           # Fotos del hero, de los locales, del login y del registro
│   ├── components/           # Menú, carrito, footer, hero, aviso de cookies, tarjetas y rutas protegidas por rol
│   │   ├── catalogo/         # Tarjetas de proveedor y producto, buscador, selector de cantidad y barra del pedido
│   │   ├── encargado/        # Panel del encargado, fichas de empleados, cambio de rol, fotos y encargados de un local
│   │   ├── formulario/       # Campos, campo de contraseña y diseño común de login y registro
│   │   ├── historial/        # Tarjeta de pedido y colores de cada estado
│   │   └── proveedor/        # Panel del proveedor y formularios de producto y de proveedor
│   ├── context/              # Contextos de la sesión (AuthProvider) y del pedido en curso (PedidoProvider)
│   ├── data/                 # Datos de los locales que se muestran en la landing
│   ├── hooks/                # Carga de datos del catálogo, del encargado y del proveedor
│   ├── pages/                # Una página por ruta (ver la tabla de Páginas)
│   ├── utils/                # Validaciones, formato de precios y fechas, mensaje de WhatsApp y consentimiento de cookies
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
- El **backend** de Suppli funcionando ([Suppli-TFG-BACKEND](https://github.com/JorgeSanchezGallego/Suppli-TFG-BACKEND)), con su base de datos y los datos del seed cargados (su README explica cuándo hace falta ejecutar `npm run seed`)

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

Si el backend tiene cargado el seed, se puede entrar con cualquiera de sus usuarios, todos con la contraseña `Prueba1234`. Por ejemplo:

| Correo | Rol |
|---|---|
| `empleado1@suppli.test` | Empleado de *Kiosko Gómiz* y *Noray* |
| `empleado4@suppli.test` | Empleado sin bar asignado |
| `encargado1@suppli.test` | Encargado de *Kiosko Gómiz* y *Noray* |
| `proveedor1@suppli.test` | Proveedor de *Cafés Tavira* |
| `proveedor2@suppli.test` | Proveedor de *Exclusivas Ramírez* |

El seed trae **4 proveedores reales** (Cafés Tavira, Exclusivas Ramírez, Comercial Tabarca y Distribuciones Guillén) con 34 productos y sus fotos, y **ningún pedido**: el historial empieza vacío. La lista completa de usuarios está en el README del backend.

---

## Páginas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Landing: hero a pantalla completa con el logo, y las tarjetas de los tres locales con carrusel de fotos, descripción, web y cómo llegar |
| `/quienes-somos` | Público | Origen del proyecto, el problema que resuelve, la solución y quién está detrás |
| `/politica-cookies` | Público | Qué guarda Suppli en el navegador y para qué, servicios de terceros y opción de cambiar la elección del aviso de cookies |
| `/login` | Público | Inicio de sesión. Si ya hay sesión, redirige a `/panel` |
| `/register` | Público | Registro de una cuenta nueva. Al terminar, inicia sesión automáticamente |
| `/panel` | Con sesión | Página de inicio de cada rol. **Empleado:** aviso si aún no tiene local, sus locales con foto y logo, y accesos al catálogo y a los pedidos. **Encargado:** resumen con el número de locales, empleados (lleva a la lista de empleados) y pedidos pendientes, aviso si hay empleados registrados esperando un local, sus locales con foto, y accesos a la gestión de locales, los pedidos y el catálogo. **Proveedor:** cifras de su empresa (productos, pedidos pendientes, importe pedido este mes y locales clientes), aviso destacado los días de reparto y los pedidos que tiene por entregar |
| `/mis-locales` | Encargado | Lista de los locales del encargado, con sus empleados y pedidos pendientes, y formulario para crear uno nuevo (nombre, dirección y foto opcional con vista previa; la dirección no se puede cambiar después). Los locales sin foto muestran su nombre sobre un fondo terracota |
| `/mis-locales/:id` | Encargado | Gestión de un local: ver, añadir y quitar a sus encargados (o dejar de gestionarlo uno mismo), cambiar el nombre, añadir o cambiar la foto (se usa como fondo de la cabecera), ver y quitar empleados, buscar entre todos los empleados (por nombre, apellidos o correo) para añadirlos, y borrar el local con una confirmación en la que hay que escribir su nombre |
| `/empleados` | Encargado | Todo el equipo (empleados y encargados; los proveedores tienen su propio filtro), en fichas con su nombre, los locales en los que trabajan, correo, teléfono, residencia, edad y fecha de alta. Filtros "Todos", "En mis locales", "Sin local", "Encargados" y "Proveedores", buscador por nombre, correo, teléfono o residencia, un selector para añadir a cada empleado a uno de tus locales (o, si es encargado, añadirlo como encargado de uno de tus locales) y la opción **Cambiar rol** en cada ficha (empleado, encargado o proveedor con su empresa), que explica qué implica cada cambio antes de guardarlo |
| `/catalogo` | Empleado / Encargado | Vista general de todos los proveedores: contacto, días de reparto, número de productos y categorías. Tiene un buscador que encuentra proveedores y también productos (indicando a qué proveedor se piden). El encargado tiene además el botón **Nuevo proveedor** |
| `/catalogo/:proveedorId` | Con sesión | Productos de un proveedor, con buscador y filtro por categoría. Cada producto muestra su precio, proveedor y categoría, un icono de información que, al pasar el ratón, enseña el stock óptimo de invierno y verano y los días de reparto, y un selector de cantidad en su medida (caja, unidad…). El encargado ve el botón **Gestionar catálogo**. Un proveedor solo puede abrir el de su propia empresa |
| `/catalogo/:proveedorId/gestionar` | Encargado | Gestión del catálogo de cualquier proveedor: crear, editar y borrar productos (con foto), editar los datos del proveedor y borrarlo, con una confirmación en la que hay que escribir su nombre (se borran también sus productos y sus pedidos) |
| `/proveedores/nuevo` | Encargado | Alta de un proveedor: empresa, persona de contacto, teléfono y días de reparto. Al guardarlo se abre la gestión de su catálogo para añadirle productos |
| `/pedido` | Empleado con local / Encargado | Revisión del pedido en curso: productos con su cantidad e importe, total, elección del local desde el que se pide, vista previa del mensaje y botón **Enviar por WhatsApp**, que guarda el pedido en la API y abre WhatsApp con el mensaje listo para el proveedor |
| `/historial` | Con sesión | Historial de pedidos según el rol: el empleado ve los de sus locales (suyos y de sus compañeros), el encargado los de todos sus locales y el proveedor, con el título "Pedidos recibidos", los que ha recibido su empresa. Cada pedido es una tarjeta con proveedor (o local), fecha, quién lo hizo, estado y total, que se despliega para ver los productos. Filtros por estado y por local, se muestran 20 pedidos y un botón "Ver más" carga los siguientes. Desde cada tarjeta se puede marcar como entregado y borrar el pedido (ver [Estados del pedido](#estados-del-pedido)) |
| `/mi-catalogo` | Proveedor | Catálogo de su empresa: crear, editar y borrar sus productos (nombre, precio, medida, categoría, stock óptimo de invierno y verano, y foto) en un formulario en ventana emergente |
| `/mi-empresa` | Proveedor | Datos de su empresa: nombre, persona de contacto, teléfono y días de reparto |

### Diseño

- **Paleta cálida y clara:** crema (`#fbf7f1`), arena (`#e8dfd3`), terracota (`#c2643c`) y café (`#2b211b`). Están definidos en `src/index.css` y se usan como clases de Tailwind (`bg-crema`, `text-terracota`, etc.).
- **Tipografía:** Outfit.
- **Aviso de cookies:** banner inferior con «Aceptar» y «Rechazar» hasta que el usuario elige. La elección se guarda en `localStorage` (`suppli-consentimiento`) y se puede cambiar desde `/politica-cookies`. Suppli solo usa almacenamiento técnico, así que ninguna de las dos opciones cambia el funcionamiento.
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
- Además, cada rol tiene su propia protección: `RutaEncargado` deja pasar solo a encargados, `RutaProveedor` solo a proveedores con empresa, y `RutaNoProveedor` impide que un proveedor entre al catálogo general o al pedido (lo lleva a su catálogo). Un proveedor no puede ver a los demás proveedores, igual que en la API.
- Con la sesión iniciada, el menú muestra un único enlace, **Panel**, además del nombre del usuario, el carrito (para quien puede hacer pedidos: empleados con local y encargados) y el botón **Cerrar sesión**. El resto de secciones (catálogo, pedidos…) se abren desde el panel, para que el menú no crezca con cada página nueva.

> **Sobre el registro:** todo el que se registra entra como `empleado` y sin bar asignado. Puede iniciar sesión, pero no puede hacer pedidos hasta que el encargado de un bar lo añada a su local. Es una decisión de seguridad: así nadie de fuera puede hacer pedidos en nombre de un local.

### Gestión de locales (encargado)

El encargado es quien da acceso a los empleados: alguien que se registra entra como empleado sin local y no puede hacer pedidos hasta que el encargado lo añade a uno de sus locales. Por eso el panel del encargado avisa cuando hay empleados esperando, y en la página de cada local el buscador muestra primero a los que aún no tienen local.

La foto de cada local se guarda en la API (Cloudinary), así que se mantiene aunque se cambie el nombre. Para los tres locales de ejemplo del seed, que no tienen foto en la base de datos, la app usa las fotos de la landing.

**Cambio de rol.** Desde la página de empleados, el encargado puede cambiar el rol de cualquier persona salvo el suyo, usando las reglas de la API: al pasar a encargado o proveedor deja sus locales de empleado, al pasar a proveedor hay que elegir su empresa, y un encargado que es el único de algún local no puede dejar de serlo hasta que haya otro encargado.

Un local puede tener **varios encargados**, todos con los mismos permisos. En la página de cada local, la sección "Encargados del local" permite añadir a otro usuario con rol de encargado, quitarlo o dejar de gestionar el local uno mismo; un local nunca puede quedarse sin encargados. En las tarjetas de los locales compartidos aparece "También lo gestiona…".

Un empleado puede trabajar en varios locales. Al borrar un local, la API borra también sus pedidos y lo quita de sus empleados, así que la app pide confirmarlo escribiendo el nombre del local. Las páginas de gestión solo están disponibles para encargados; cualquier otro rol que intente entrar vuelve al panel.

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
Hola Manolo, buenas tardes.
Te escribo desde Noray para hacerte el siguiente pedido:

- Corona 330ml (caja 24): 4 cajas
- Patatas Supreme 45g (caja 24): 2 cajas
- Cóctel frutos secos R55 1kg: 1 unidad
```

El saludo usa el nombre de la persona de contacto del proveedor y cambia según la hora (buenos días, buenas tardes o buenas noches).

Pueden preparar pedidos los **empleados con un local asignado**, para los locales en los que trabajan, y los **encargados**, para los locales que gestionan. Un empleado sin local puede consultar el catálogo, pero no pedir. Los proveedores no tienen acceso al catálogo general ni al pedido.

### Estados del pedido

Todo pedido se crea como **pendiente** y solo puede pasar a **entregado** cuando llega la mercancía. En el historial, cada pedido muestra su estado con un color (pendiente en ámbar y entregado en verde). Al desplegar un pedido pendiente aparece el botón **Marcar como entregado**, que solo ven el encargado y los empleados del local, igual que exige la API. Un pedido entregado ya no se puede modificar.

**Borrar un pedido.** El botón **Borrar pedido** pide confirmación antes de borrarlo, porque no se puede deshacer. El encargado puede borrar cualquier pedido de sus locales. El empleado solo puede borrar los que ha hecho él y mientras sigan pendientes. El proveedor no puede borrar pedidos.

### Panel del proveedor

Un usuario con rol **proveedor** entra a un panel propio, pensado para su empresa y no para un bar:

- **Resumen:** número de productos, pedidos pendientes, importe pedido este mes y número de locales que le compran. Los días de reparto aparecen destacados, y si aún no los ha indicado, un aviso le lleva a rellenarlos.
- **Mi catálogo** (`/mi-catalogo`): alta, edición y borrado de sus productos con foto.
- **Pedidos recibidos** (`/historial`): los pedidos que los bares han hecho a su empresa.
- **Datos de la empresa** (`/mi-empresa`): contacto, teléfono y días de reparto, que son los que ven los bares en el catálogo.

Si su cuenta todavía no está vinculada a ninguna empresa, el panel le pide que se lo solicite a un encargado.

### Gestión de proveedores (encargado)

Los proveedores son comunes a todos los locales. El encargado puede:

- **Dar de alta** un proveedor desde el botón **Nuevo proveedor** del catálogo.
- **Gestionar el catálogo** de cualquier proveedor, aunque el proveedor no tenga cuenta en Suppli: crear, editar y borrar productos.
- **Editar los datos** del proveedor o **borrarlo**. Al borrarlo se pierden sus productos y todos sus pedidos, en todos los locales, así que la app pide escribir el nombre de la empresa para confirmarlo.
- **Vincular a un usuario** con un proveedor cambiándole el rol a *proveedor* desde la página de empleados.

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
- [x] Panel del **encargado**: resumen, gestión de locales y de sus empleados
- [x] Panel del **proveedor**: resumen, gestión de su catálogo y de los datos de su empresa
- [x] **Gestión de proveedores** por parte del encargado: alta, edición, borrado y catálogo
- [x] Borrado de pedidos según el rol
- [x] **Política de cookies** con aviso, y tipografía servida desde la propia app
- [ ] Más adelante: gestión de propinas y solicitud de días libres para el personal

---

## Autor

**Jorge Sánchez Gallego**: TFG del ciclo de Desarrollo de Aplicaciones Web
Tutor: José Manuel Villar Ferradal
