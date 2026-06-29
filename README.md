# Alma Bordado — Landing

Página de presentación y tienda de **Alma Bordado** 🌸. Sitio estático (HTML, CSS y
JavaScript, sin dependencias ni build) que comparte la identidad visual de la app
de Bordados: paleta pastel, motivos botánicos y tipografía Cormorant Garamond.

## Qué incluye

- **Hero** cálido con el logo del bastidor y el ramo "Alma".
- **Banner de destacados** rotativo (ej. *Kit cumple mes bebé*, *Kit bolsitas de Halloween*).
- **Tres pilares**: bordados listos, pedidos personalizados y kits de bordado.
- **Tienda** de bordados listos con filtros por categoría.
- **Kits de bordado** con el detalle de lo que incluye cada uno.
- **Carrito de compras** con persistencia y **checkout simulado** de 4 pasos
  (datos → envío → pago → confirmación), incluyendo gestión de envío
  (retiro en taller o despacho a domicilio por región, con envío gratis sobre un monto).
- **Pedido personalizado**: formulario "Enviar requerimiento" que arma el resumen y lo
  envía a la empresa por WhatsApp o correo.
- **Talleres de bordado** (presenciales y virtuales) con reserva de cupos.
- **Contacto**: Instagram, correo y WhatsApp/teléfono.

> El carrito, los pedidos, los requerimientos y las reservas se guardan en el navegador
> (`localStorage`) y, al confirmar, se envían a la empresa abriendo WhatsApp o el correo
> con el mensaje ya redactado. Es una simulación: **no se procesan cobros reales**.

## Personalizar

Edita el objeto `CONFIG` al inicio de [`app.js`](app.js) para poner tus datos reales:

```js
const CONFIG = {
  instagram: 'alma.bordado',
  instagramUrl: 'https://instagram.com/alma.bordado',
  email: 'contacto@almabordado.cl',
  telDisplay: '+56 9 1234 5678',
  telWhatsapp: '56912345678',   // solo dígitos, con código país
  ...
};
```

- **Contacto** (Instagram, correo, teléfono/WhatsApp): en `CONFIG`.
- **Costos y reglas de envío**: en `CONFIG.envio`.
- **Productos, kits, destacados y talleres**: en los arreglos `PRODUCTOS`, `KITS` y
  `TALLERES` de `app.js`. Marca `destacado: true` para que un ítem aparezca en el banner.

## Ver el sitio

Al ser estático, basta abrir `index.html` en el navegador, o servirlo localmente:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

Se puede publicar tal cual en **GitHub Pages** (rama y carpeta raíz).
