# Alma Bordado — Landing

Página de presentación y tienda de **Alma Bordado** 🌸. Sitio estático (HTML, CSS y
JavaScript, sin dependencias ni build) que comparte la identidad visual de la app
de Bordados: paleta pastel, motivos botánicos y tipografía Cormorant Garamond.

## Qué incluye

- **Hero** cálido con el logo de marca (espigas de trigo) y el ramo "Alma".
- **Banner rotativo** con varios tipos (Bordado destacado, Oferta, Kit destacado,
  Recién llegado, Envío gratis), con flechas, puntos y pausa.
- **Tres pilares**: kits de bordado (el producto estrella), bordados listos y
  pedidos personalizados.
- **Kits de bordado** (producto principal, primera sección de productos) con el
  detalle de lo que incluye cada uno.
- **Tienda** de bordados listos con filtros por categoría (admite fotos reales).
- **Talleres de bordado**: EN PAUSA. El flujo de reserva sigue en el código;
  para reactivarlos, descomenta el arreglo `TALLERES` en `app.js` y restaura la
  sección `#talleres` del `index.html` (y su enlace en el menú).
- **Carrito de compras** con persistencia y **checkout simulado** de 4 pasos
  (datos → envío → pago → confirmación), incluyendo gestión de envío
  (retiro en taller o despacho a domicilio por región, con envío gratis sobre un monto).
- **Pedido personalizado**: formulario "Enviar requerimiento" con confirmación cálida en
  pantalla (y opción de adelantarlo por WhatsApp o correo).
- **Chatbot guía** que orienta al cliente por la página (sin IA externa).
- **Botón flotante de WhatsApp** para escribir directo al número de Alma Bordado.
- **Contacto**: Instagram, correo y WhatsApp/teléfono.

> El carrito, los pedidos, los requerimientos y las reservas se guardan en el navegador
> (`localStorage`) y, al confirmar, se envían a la empresa abriendo WhatsApp o el correo
> con el mensaje ya redactado (con un botón extra para **copiar** el mensaje si esos
> enlaces no abren). Es una simulación: **no se procesan cobros reales** y la imagen de
> referencia del requerimiento debe adjuntarse a mano al abrir WhatsApp/correo.
>
> ¿Quieres que el requerimiento llegue **solo**, sin ese paso manual? Conecta el
> formulario a un servicio de formularios (Formspree, Getform, Google Forms) o a un
> pequeño backend que envíe el correo a `CONFIG.email` automáticamente al hacer *submit*.

## Personalizar

Edita el objeto `CONFIG` al inicio de [`app.js`](app.js) para poner tus datos reales:

```js
const CONFIG = {
  instagram: 'almabordado',
  instagramUrl: 'https://instagram.com/almabordado',
  email: 'contacto@almabordado.cl',   // ← reemplazar por el correo real
  telDisplay: '+56 9 1234 5678',      // ← reemplazar por el teléfono real
  telWhatsapp: '56912345678',         // ← solo dígitos, con código país
  ...
};
```

- **Contacto** (Instagram, correo, teléfono/WhatsApp): en `CONFIG`.
- **Costos y reglas de envío**: en `CONFIG.envio`.
- **Productos y kits**: en los arreglos `PRODUCTOS` y `KITS` de `app.js`.
- **Banner**: en el arreglo `BANNERS` (cada banner destaca un producto por `productId`
  o muestra info con `cta`/`href`; `precioAntes` muestra el precio tachado de una oferta).
- **Fotos reales**: agrega `img: 'fotos/mi-bordado.jpg'` a un producto y se mostrará
  la foto en vez del emoji. Sube las imágenes a una carpeta `fotos/` del repo.
- **Chatbot**: edita los textos en `CHAT_RESPUESTAS` y las palabras clave en `CHAT_PALABRAS`.

## Ver el sitio

Al ser estático, basta abrir `index.html` en el navegador, o servirlo localmente:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

Se puede publicar tal cual en **GitHub Pages** (rama y carpeta raíz).
