/* ======================================================================
   Alma Bordado — Landing · Lógica
   Sitio estático: carrito, checkout simulado y requerimientos se guardan
   en el navegador y se envían a la empresa por WhatsApp/correo.
   ====================================================================== */
'use strict';

/* ----------------------------------------------------------------------
   1) CONFIGURACIÓN  ·  EDITA AQUÍ tus datos reales de contacto y envío
   ---------------------------------------------------------------------- */
const CONFIG = {
  instagram: 'almabordado',
  instagramUrl: 'https://instagram.com/almabordado',
  email: 'contacto@almabordado.cl',
  telDisplay: '+56 9 1234 5678',
  telWhatsapp: '56912345678',     // solo dígitos, con código país (para WhatsApp)
  tallerLugar: 'Taller Alma Bordado · Providencia, Santiago',
  moneda: 'CLP',
  locale: 'es-CL',
  envio: {
    montoRM: 3990,                // despacho a domicilio en Región Metropolitana
    montoRegiones: 6490,          // despacho a otras regiones
    gratisDesde: 50000,           // envío gratis sobre este monto
    rmNombre: 'Región Metropolitana de Santiago'
  }
};

const REGIONES = [
  'Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo','Valparaíso',
  'Región Metropolitana de Santiago','O’Higgins','Maule','Ñuble','Biobío','La Araucanía',
  'Los Ríos','Los Lagos','Aysén','Magallanes'
];

/* ----------------------------------------------------------------------
   2) CATÁLOGO
   ---------------------------------------------------------------------- */
// Bordados listos para venta
// (cada producto admite "img": 'fotos/archivo.png' para mostrar una foto real en vez del emoji)
const PRODUCTOS = [
  { id:'r1', nombre:'Bastidor «Maggie»', precio:14990, emoji:'💛', tono:'trigo', cat:'Cuadros', img:'fotos/maggie.png',
    desc:'Bordado a mano de Maggie en bastidor de 10 cm. Un guiño tierno y divertido para tu pared.' },
  { id:'r2', nombre:'Bastidor «Pantera Rosa»', precio:19990, emoji:'🐾', tono:'rosa', cat:'Cuadros', img:'fotos/pantera-rosa.png',
    desc:'La Pantera Rosa bordada a mano con mucho detalle, en bastidor rosado. Pieza única.' },
  { id:'r4', nombre:'Bastidor «Calavera mexicana»', precio:29990, emoji:'💀', tono:'trigo', cat:'Cuadros', img:'fotos/calavera.png',
    desc:'Calavera estilo Día de Muertos, llena de color y flores, bordada sobre tela negra. Una pieza vibrante y única.' },
  { id:'r5', nombre:'Bastidor «Mandala floral»', precio:32990, emoji:'🌸', tono:'rosa', cat:'Cuadros', img:'fotos/mandala.png',
    desc:'Mandala de flores y hojas bordada a mano con mucho detalle. Delicada y llena de vida.' },
  { id:'r6', nombre:'Bastidor «Hongos de colores»', precio:26990, emoji:'🍄', tono:'salvia', cat:'Cuadros', img:'fotos/hongos.png',
    desc:'Hongos de colores entre hojas y estrellas, bordados sobre tela negra. Mágico y alegre.' },
  { id:'b2', nombre:'Bastidor «Mar y ballenas»', precio:22990, emoji:'🐋', tono:'azul', cat:'Cuadros', img:'fotos/ballenas.png',
    desc:'Trío de ballenas bordadas a mano en azules suaves. Una escena marina llena de calma.' }
];

// Kits de bordado (incluyen insumos + manual)
const KITS = [
  { id:'k_flores', nombre:'Kit «Flores Silvestres»', precio:30000, emoji:'🌷', tono:'salvia', kit:true, img:'fotos/kit-flores.webp',
    desc:'Todo lo necesario para bordar un ramo de flores silvestres. Ideal para principiantes.',
    incluye:['Diseño','6 hilos','Agujas','Bastidor','Tela','Manual'], insignia:'Principiantes' },
  { id:'k_calavera', nombre:'Kit «Calavera Floral»', precio:35000, emoji:'💀', tono:'trigo', kit:true, img:'fotos/kit-calavera.webp',
    desc:'Todo lo necesario para bordar una calavera floral sobre tela negra. Para todo nivel.',
    incluye:['Diseño','10 hilos','Agujas','Bastidor','Tela','Manual'], insignia:'Todo nivel' }
];

const CATALOGO = [...PRODUCTOS, ...KITS];
const porId = (id) => CATALOGO.find(p => p.id === id);

// Banner = 3 afiches propios que rotan. Cada uno muestra una imagen completa
// (fotos/bannerN.webp) y enlaza a una sección. Mientras no se suba el afiche,
// se muestra el texto de respaldo (kicker/titulo/desc/cta).
const BANNERS = [
  { tipo:'destacado', afiche:'fotos/banner1.webp', href:'#tienda', icono:'🌼', alt:'Bordados destacados',
    kicker:'Bordado destacado', titulo:'Bordados hechos a mano', desc:'Descubre nuestras piezas únicas.', cta:'Ver la tienda' },
  { tipo:'oferta', afiche:'fotos/banner2.webp', href:'#tienda', icono:'🏷️', alt:'Ofertas de Alma Bordado',
    kicker:'Ofertas', titulo:'Ofertas de Alma Bordado', desc:'Aprovecha nuestros precios especiales.', cta:'Ver la tienda' },
  { tipo:'kit', afiche:'fotos/banner3.webp', href:'#kits', icono:'🎁', alt:'Kits y novedades',
    kicker:'Novedades', titulo:'Kits y novedades', desc:'Todo listo para bordar en casa.', cta:'Ver los kits' }
];

/* ----------------------------------------------------------------------
   3) HELPERS
   ---------------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const fmt = new Intl.NumberFormat(CONFIG.locale, { style:'currency', currency:CONFIG.moneda, maximumFractionDigits:0 });
const precio = (n) => fmt.format(n);

const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Versión de assets: fuerza recarga de imágenes al actualizarlas (evita caché). Súbela al cambiar fotos.
const ASSET_V = '6';
const ver = (u) => u ? u + (u.indexOf('?') >= 0 ? '&' : '?') + 'v=' + ASSET_V : u;

function leer(clave, def) {
  try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : def; }
  catch (e) { return def; }
}
function guardar(clave, valor) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* modo privado */ }
}

let toastTimer;
function toast(msg, tipo) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast ver' + (tipo ? ' ' + tipo : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = 'toast'; }, 2800);
}

function fechaLarga(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  const dt = new Date(a, m - 1, d);
  return dt.toLocaleDateString(CONFIG.locale, { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}
function fechaCorta(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return { dia: d, mes: meses[m - 1], anio: a };
}

/* ----------------------------------------------------------------------
   4) CARRITO
   ---------------------------------------------------------------------- */
// Sanea lo leído desde localStorage: descarta basura, ids inexistentes y cantidades inválidas
function sanearCarrito(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter(i => i && porId(i.id) && Number.isFinite(i.cant) && i.cant > 0)
    .map(i => ({ id: i.id, cant: Math.min(99, Math.floor(i.cant)) }));
}
let carrito = sanearCarrito(leer('ab_carrito', []));   // [{id, cant}]

function guardarCarrito() { guardar('ab_carrito', carrito); }
function totalItems() { return carrito.reduce((s, i) => s + i.cant, 0); }
function subtotalCarrito() { return carrito.reduce((s, i) => { const p = porId(i.id); return p ? s + p.precio * i.cant : s; }, 0); }

function agregarAlCarrito(id, cant = 1) {
  const p = porId(id);
  if (!p) return;
  const item = carrito.find(i => i.id === id);
  if (item) item.cant += cant; else carrito.push({ id, cant });
  guardarCarrito();
  pintarBadge();
  pintarCarrito();
  toast(`${p.nombre} agregado al carrito 🧵`, 'ok');
}
function cambiarCant(id, delta) {
  const item = carrito.find(i => i.id === id);
  if (!item) return;
  item.cant += delta;
  if (item.cant <= 0) carrito = carrito.filter(i => i.id !== id);
  guardarCarrito();
  pintarBadge();
  pintarCarrito();
}
function quitarDelCarrito(id) {
  carrito = carrito.filter(i => i.id !== id);
  guardarCarrito();
  pintarBadge();
  pintarCarrito();
}

function pintarBadge() {
  const n = totalItems();
  const b = $('#carritoBadge');
  b.textContent = n;
  b.classList.toggle('ver', n > 0);
  $('#btnCarrito').setAttribute('aria-label',
    n > 0 ? `Abrir carrito de compras, ${n} ${n === 1 ? 'artículo' : 'artículos'}` : 'Abrir carrito de compras');
}

function pintarCarrito() {
  const cont = $('#carritoItems');
  const pie = $('#carritoPie');
  if (!carrito.length) {
    cont.innerHTML = `<div class="carrito-vacio">
        <span class="emoji">🧺</span>
        <p>Tu carrito está vacío.</p>
        <p style="margin-top:6px;font-size:.9rem;">Descubre nuestros bordados y kits hechos con amor.</p>
      </div>`;
    pie.hidden = true;
    return;
  }
  cont.innerHTML = carrito.map(i => {
    const p = porId(i.id);
    if (!p) return '';
    return `<div class="ci">
        <div class="ci-foto">${p.img ? `<img src="${esc(ver(p.img))}" alt="" data-emoji="${p.emoji}" onerror="fotoFallback(this)">` : `<span aria-hidden="true">${p.emoji}</span>`}</div>
        <div class="ci-info">
          <strong>${esc(p.nombre)}</strong>
          <div class="ci-precio">${precio(p.precio)} c/u</div>
          <div class="ci-cant">
            <button data-cant="-1" data-id="${p.id}" aria-label="Quitar uno">−</button>
            <span>${i.cant}</span>
            <button data-cant="1" data-id="${p.id}" aria-label="Agregar uno">+</button>
          </div>
          <button class="ci-quitar" data-quitar="${p.id}">Eliminar</button>
        </div>
        <div class="ci-subtotal">${precio(p.precio * i.cant)}</div>
      </div>`;
  }).join('');
  $('#carritoSubtotal').textContent = precio(subtotalCarrito());
  pie.hidden = false;
}

/* Panel del carrito */
function abrirCarrito() {
  recordarFoco();
  $('#carritoPanel').classList.add('ver');
  $('#carritoPanel').setAttribute('aria-hidden', 'false');
  $('#overlay').classList.add('ver');
  setFondoInerte(true);
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#cerrarCarrito').focus(), 60);
}
function cerrarCarrito() {
  $('#carritoPanel').classList.remove('ver');
  $('#carritoPanel').setAttribute('aria-hidden', 'true');
  if (!$('#modalCheckout').classList.contains('ver')) $('#overlay').classList.remove('ver');
  if (!hayModalAbierto()) { setFondoInerte(false); document.body.style.overflow = ''; restaurarFoco(); }
}

/* ----------------------------------------------------------------------
   5) RENDER DE CATÁLOGO Y SECCIONES
   ---------------------------------------------------------------------- */
function tarjetaProducto(p) {
  const incluye = p.incluye ? `<ul class="incluye">${p.incluye.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const insignia = p.insignia ? `<span class="insignia">${esc(p.insignia)}</span>` : '';
  const foto = p.img
    ? `<img class="foto-img" src="${esc(ver(p.img))}" alt="${esc(p.nombre)}" loading="lazy" data-emoji="${p.emoji}" onerror="fotoFallback(this)">`
    : `<span class="foto-emoji" aria-hidden="true">${p.emoji}</span>`;
  return `<article class="producto tono-${p.tono}${p.img ? ' con-foto' : ''}">
      <div class="foto">${foto}<span class="etiqueta">${esc(p.cat || (p.kit ? 'Kit' : ''))}</span>${insignia}</div>
      <div class="cuerpo">
        <h3>${esc(p.nombre)}</h3>
        <p class="desc">${esc(p.desc)}</p>
        ${incluye}
        <div class="pie-prod">
          <span class="precio">${precio(p.precio)}</span>
          <button class="btn btn-primario btn-mini" data-agregar="${p.id}">Agregar 🛒</button>
        </div>
      </div>
    </article>`;
}

function pintarTienda(cat = 'Todos') {
  const items = cat === 'Todos' ? PRODUCTOS : PRODUCTOS.filter(p => p.cat === cat);
  $('#grillaTienda').innerHTML = items.map(tarjetaProducto).join('');
}
function pintarFiltros() {
  const cats = ['Todos', ...Array.from(new Set(PRODUCTOS.map(p => p.cat)))];
  // Si solo hay una categoría, el filtro no aporta: lo ocultamos
  if (cats.length <= 2) { $('#filtrosTienda').innerHTML = ''; return; }
  $('#filtrosTienda').innerHTML = cats.map((c, i) =>
    `<button class="chip${i === 0 ? ' activo' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
}
function pintarKits() {
  if (!KITS.length) {
    $('#grillaKits').innerHTML = `
      <div class="proximamente">
        <svg viewBox="0 0 80 80" aria-hidden="true"><use href="#margaritaSalvia" transform="translate(40,40) scale(1.1)"/></svg>
        <h3>¡Muy pronto! 🎁</h3>
        <p>Estamos preparando nuestros kits con diseño, hilos, aguja, bastidor y un manual detallado, todo listo en una cajita. ¿Quieres que te avisemos cuando estén?</p>
        <div class="proximamente-acciones">
          <a class="btn btn-rosa" href="#contacto">Avísenme</a>
          <a class="btn btn-sec" href="#personalizado">Pedir algo a medida</a>
        </div>
      </div>`;
    return;
  }
  $('#grillaKits').innerHTML = KITS.map(tarjetaProducto).join('');
}

/* Banner / carrusel rotativo (ofertas, destacados, novedades…) */
let bannerIdx = 0, bannerTimer, bannerPausaManual = false, bannerHover = false;
const prefiereMenosMovimiento = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// Layout de TEXTO de un banner (también es el respaldo si su afiche aún no se sube)
function slideTextoHTML(b) {
  let titulo, desc, precioHtml = '', acciones;
  if (b.productId) {
    const p = porId(b.productId);
    titulo = p.nombre;
    desc = b.desc || p.desc;
    precioHtml = (b.precioAntes && b.precioAntes > p.precio)
      ? `<div class="dest-precio"><span class="antes">${precio(b.precioAntes)}</span> ${precio(p.precio)}</div>`
      : `<div class="dest-precio">${precio(p.precio)}</div>`;
    acciones = `<button class="btn btn-rosa" data-agregar="${p.id}">Agregar al carrito 🛒</button>
                <a class="btn btn-sec" href="${p.kit ? '#kits' : '#tienda'}">Ver más</a>`;
  } else {
    titulo = b.titulo; desc = b.desc;
    acciones = `<a class="btn btn-rosa" href="${b.href || '#tienda'}">${esc(b.cta || 'Ver más')}</a>`;
  }
  return `
    <div class="estrella" aria-hidden="true">${b.icono || '✨'}</div>
    <div class="dest-txt">
      <div class="dest-kicker">${esc(b.kicker || '')}</div>
      <div class="dest-nombre">${esc(titulo || '')}</div>
      <div class="dest-desc">${esc(desc || '')}</div>
      ${precioHtml}
    </div>
    <div class="dest-acciones">${acciones}</div>`;
}
// Respaldo: si el afiche aún no está subido, muestra el texto del banner
function bannerFallback(img, idx) {
  $('#bannerDest').classList.remove('con-afiche');
  $('#bannerSlide').innerHTML = slideTextoHTML(BANNERS[idx]);
}

function pintarBanner(i) {
  if (!BANNERS.length) return;
  bannerIdx = (i + BANNERS.length) % BANNERS.length;
  const b = BANNERS[bannerIdx];
  $('#bannerDest').className = 'banner-dest tipo-' + b.tipo + (b.afiche ? ' con-afiche' : '');

  const slide = $('#bannerSlide');
  if (b.afiche) {
    slide.innerHTML = `<a class="banner-link" href="${b.href || '#tienda'}">`
      + `<img class="banner-img" src="${esc(ver(b.afiche))}" alt="${esc(b.alt || b.titulo || 'Banner de Alma Bordado')}" onerror="bannerFallback(this, ${bannerIdx})"></a>`;
  } else {
    slide.innerHTML = slideTextoHTML(b);
  }

  if (!prefiereMenosMovimiento) {        // efecto de entrada (se omite con "reducir movimiento")
    slide.classList.remove('entra');
    void slide.offsetWidth;              // reinicia la animación
    slide.classList.add('entra');
  }
  $$('#destPuntos .dest-punto').forEach((d, idx) => {
    const act = idx === bannerIdx;
    d.classList.toggle('activo', act);
    d.setAttribute('aria-current', act ? 'true' : 'false');
  });
}
function pintarPuntosBanner() {
  $('#destPuntos').innerHTML = BANNERS.map((b, i) =>
    `<button class="dest-punto" data-idx="${i}" aria-current="false" aria-label="Ver banner ${i + 1}: ${esc(b.kicker)}"></button>`).join('');
}
function rotarBanner() {
  clearTimeout(bannerTimer);
  // El autoavance se detiene con la pausa manual o el hover/foco (control de WCAG 2.2.2)
  if (bannerPausaManual || bannerHover || BANNERS.length <= 1) return;
  bannerTimer = setTimeout(() => { pintarBanner(bannerIdx + 1); rotarBanner(); }, 3500);
}
function alternarPausaBanner() {
  bannerPausaManual = !bannerPausaManual;
  const b = $('#destPausa');
  b.setAttribute('aria-pressed', String(bannerPausaManual));
  b.textContent = bannerPausaManual ? '▶' : '⏸';
  b.setAttribute('aria-label', (bannerPausaManual ? 'Reanudar' : 'Pausar') + ' el cambio automático del banner');
  rotarBanner();
}


/* ----------------------------------------------------------------------
   6) MODALES (genérico + checkout) y foco
   ---------------------------------------------------------------------- */
function hayModalAbierto() {
  return $('#modalCheckout').classList.contains('ver') ||
         $('#modalGenerico').classList.contains('ver') ||
         $('#carritoPanel').classList.contains('ver');
}
// Foco e inertización del fondo mientras hay un diálogo abierto
let ultimoFoco = null;
function fondoElems() { return [$('header.appbar'), $('main'), $('footer.pie')]; }
function setFondoInerte(activo) {
  fondoElems().forEach(el => {
    if (!el) return;
    if (activo) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
    else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
  });
}
function recordarFoco() { if (!ultimoFoco) ultimoFoco = document.activeElement; }
function restaurarFoco() {
  const el = ultimoFoco; ultimoFoco = null;
  if (el && typeof el.focus === 'function') { try { el.focus(); } catch (e) { /* no-op */ } }
}

function abrirModal(id) {
  recordarFoco();
  $(id).classList.add('ver');
  $(id).setAttribute('aria-hidden', 'false');
  setFondoInerte(true);
  document.body.style.overflow = 'hidden';
  const foco = $(id).querySelector('input:not([type="file"]), select, textarea, button');
  if (foco) setTimeout(() => foco.focus(), 60);
}
function cerrarModal(id) {
  $(id).classList.remove('ver');
  $(id).setAttribute('aria-hidden', 'true');
  if (id === '#modalCheckout' && !$('#carritoPanel').classList.contains('ver')) $('#overlay').classList.remove('ver');
  if (!hayModalAbierto()) { setFondoInerte(false); document.body.style.overflow = ''; restaurarFoco(); }
}
function abrirGenerico(html) {
  $('#genContenido').innerHTML = html;
  abrirModal('#modalGenerico');
}

/* ----------------------------------------------------------------------
   7) VALIDACIÓN DE FORMULARIOS
   ---------------------------------------------------------------------- */
function marcar(input, ok) {
  const campo = input.closest('.campo');
  if (campo) campo.classList.toggle('error', !ok);
  input.setAttribute('aria-invalid', String(!ok));
  return ok;
}
function validoTexto(input) { return marcar(input, input.value.trim().length > 0); }
function validoEmail(input) { return marcar(input, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())); }
function validoTel(input) { return marcar(input, input.value.replace(/\D/g, '').length >= 7); }
function validoContacto(input) {
  const v = input.value.trim();
  return marcar(input, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || v.replace(/\D/g, '').length >= 7);
}
// Lleva el foco (y la atención del lector de pantalla) al primer campo con error
function enfocarPrimerInvalido(scope) {
  const el = (scope || document).querySelector('.campo.error input, .campo.error select, .campo.error textarea');
  if (el) el.focus();
}

/* ----------------------------------------------------------------------
   8) ENVÍO DE MENSAJES A LA EMPRESA (WhatsApp / correo)
   ---------------------------------------------------------------------- */
function abrirWhatsApp(texto) {
  window.open(`https://wa.me/${CONFIG.telWhatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
}
function abrirCorreo(asunto, cuerpo) {
  window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}
function copiarTexto(texto) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(texto).then(() => toast('Mensaje copiado 📋', 'ok'), () => toast('No se pudo copiar.'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand('copy'); toast('Mensaje copiado 📋', 'ok'); } catch (err) { toast('No se pudo copiar.'); }
    document.body.removeChild(ta);
  }
}

/* ----------------------------------------------------------------------
   9) CHECKOUT
   ---------------------------------------------------------------------- */
const checkout = {
  paso: 1,
  envio: 'retiro',          // 'retiro' | 'domicilio'
  pago: 'tarjeta',          // 'tarjeta' | 'transferencia' | 'efectivo'
  region: CONFIG.envio.rmNombre,
  datos: {}, ultimoPedido: null
};

function costoEnvio() {
  if (checkout.envio === 'retiro') return 0;
  const sub = subtotalCarrito();
  if (sub >= CONFIG.envio.gratisDesde) return 0;
  const region = checkout.region || $('#coRegion').value;
  return region === CONFIG.envio.rmNombre ? CONFIG.envio.montoRM : CONFIG.envio.montoRegiones;
}
function totalCheckout() { return subtotalCarrito() + costoEnvio(); }

function pintarOpcionesEnvio() {
  const sub = subtotalCarrito();
  const gratis = sub >= CONFIG.envio.gratisDesde;
  const rm = gratis ? 'Gratis' : precio(CONFIG.envio.montoRM);
  const reg = gratis ? 'Gratis' : precio(CONFIG.envio.montoRegiones);
  $('#envioOpciones').innerHTML = `
    <label class="opcion-radio envio-opcion${checkout.envio === 'retiro' ? ' elegida' : ''}">
      <input type="radio" name="envio" value="retiro" ${checkout.envio === 'retiro' ? 'checked' : ''}>
      <div><strong>Retiro en el taller — Gratis</strong>
      <small>${esc(CONFIG.tallerLugar)}. Coordinamos día y hora contigo.</small></div>
    </label>
    <label class="opcion-radio envio-opcion${checkout.envio === 'domicilio' ? ' elegida' : ''}">
      <input type="radio" name="envio" value="domicilio" ${checkout.envio === 'domicilio' ? 'checked' : ''}>
      <div><strong>Despacho a domicilio</strong>
      <small>Región Metropolitana ${rm} · otras regiones ${reg}. ${gratis ? '🎉 ¡Tu compra tiene envío gratis!' : 'Envío gratis sobre ' + precio(CONFIG.envio.gratisDesde) + '.'}</small></div>
    </label>`;
  $('#bloqueDireccion').style.display = checkout.envio === 'domicilio' ? 'block' : 'none';
}

function pintarResumenPago() {
  const sub = subtotalCarrito();
  const env = costoEnvio();
  const lineas = carrito.filter(i => porId(i.id)).map(i => {
    const p = porId(i.id);
    return `<li><span>${esc(p.nombre)} ×${i.cant}</span><span>${precio(p.precio * i.cant)}</span></li>`;
  }).join('');
  const envTxt = checkout.envio === 'retiro' ? 'Retiro en taller' : (env === 0 ? 'Despacho (gratis)' : 'Despacho a domicilio');
  $('#resumenPago').innerHTML = `${lineas}
    <li><span class="muted">Subtotal</span><span class="muted">${precio(sub)}</span></li>
    <li><span class="muted">Envío · ${envTxt}</span><span class="muted">${env === 0 ? 'Gratis' : precio(env)}</span></li>
    <li class="total"><span>Total</span><strong>${precio(sub + env)}</strong></li>`;

  // métodos de pago según envío
  const metodos = [
    { v:'tarjeta', t:'Tarjeta de crédito o débito', s:'Pago en línea seguro (simulado).' },
    { v:'transferencia', t:'Transferencia bancaria', s:'Te enviamos los datos para transferir.' }
  ];
  if (checkout.envio === 'retiro') metodos.push({ v:'efectivo', t:'Pago al retirar', s:'Pagas en efectivo o transferencia al retirar tu pedido.' });
  if (!metodos.some(m => m.v === checkout.pago)) checkout.pago = 'tarjeta';
  $('#metodoPago').innerHTML = metodos.map(m => `
    <label class="opcion-radio${checkout.pago === m.v ? ' elegida' : ''}">
      <input type="radio" name="pago" value="${m.v}" ${checkout.pago === m.v ? 'checked' : ''}>
      <div><strong>${esc(m.t)}</strong><small>${esc(m.s)}</small></div>
    </label>`).join('');
  $('#bloqueTarjeta').style.display = checkout.pago === 'tarjeta' ? 'grid' : 'none';
}

function marcarPasoInd(n) {
  $$('#pasosInd .paso-ind').forEach(el => {
    const p = Number(el.dataset.paso);
    el.classList.toggle('activo', p === n);
    el.classList.toggle('hecho', p < n);
    if (p < n) el.querySelector('.bolita').textContent = '✓';
    else el.querySelector('.bolita').textContent = p;
  });
}
function mostrarPaso(n) {
  checkout.paso = n;
  $$('.checkout-paso').forEach(el => el.classList.toggle('activo', Number(el.dataset.paso) === n));
  marcarPasoInd(n);
  if (n === 2) pintarOpcionesEnvio();
  if (n === 3) pintarResumenPago();
  $('.modal-caja.ancha').scrollTop = 0;
}

function validarPaso1() {
  const ok = [validoTexto($('#coNombre')), validoEmail($('#coEmail')), validoTel($('#coTel'))].every(Boolean);
  if (!ok) { toast('Revisa tus datos de contacto.'); enfocarPrimerInvalido($('.checkout-paso[data-paso="1"]')); }
  return ok;
}
function validarPaso2() {
  if (checkout.envio !== 'domicilio') return true;
  const ok = [validoTexto($('#coDir')), validoTexto($('#coComuna'))].every(Boolean);
  if (!ok) { toast('Completa tu dirección de despacho.'); enfocarPrimerInvalido($('.checkout-paso[data-paso="2"]')); }
  return ok;
}

function irPaso(n) {
  if (n > checkout.paso) { // avanzar: validar pasos intermedios
    if (checkout.paso === 1 && !validarPaso1()) return;
    if (checkout.paso === 2 && !validarPaso2()) return;
  }
  mostrarPaso(n);
}

function finalizarPago() {
  if (!validarPaso2()) { mostrarPaso(2); return; }
  if (checkout.pago === 'tarjeta') {
    const num = $('#coTarjeta').value.replace(/\s/g, '');
    const venc = $('#coVenc').value.trim();
    const cvv = $('#coCvv').value.trim();
    const mVenc = venc.match(/^(\d{2})\/(\d{2})$/);
    const okNum = marcar($('#coTarjeta'), /^\d{13,16}$/.test(num));
    const okVenc = marcar($('#coVenc'), !!(mVenc && +mVenc[1] >= 1 && +mVenc[1] <= 12));
    const okCvv = marcar($('#coCvv'), /^\d{3,4}$/.test(cvv));
    if (!(okNum && okVenc && okCvv)) { toast('Revisa los datos de la tarjeta (simulado).'); enfocarPrimerInvalido($('#bloqueTarjeta')); return; }
  }
  // Construir pedido
  const num = 'AB-' + Date.now().toString().slice(-6);
  const pedido = {
    num,
    fecha: new Date().toISOString(),
    items: carrito.filter(i => porId(i.id)).map(i => { const p = porId(i.id); return { nombre:p.nombre, cant:i.cant, precio:p.precio }; }),
    subtotal: subtotalCarrito(),
    envio: checkout.envio,
    costoEnvio: costoEnvio(),
    total: totalCheckout(),
    pago: checkout.pago,
    cliente: {
      nombre: $('#coNombre').value.trim(),
      email: $('#coEmail').value.trim(),
      tel: $('#coTel').value.trim(),
      direccion: checkout.envio === 'domicilio'
        ? `${$('#coDir').value.trim()}, ${$('#coComuna').value.trim()}, ${$('#coRegion').value}`
        : 'Retiro en taller'
    }
  };
  checkout.ultimoPedido = pedido;
  const pedidos = leer('ab_pedidos', []);
  pedidos.push(pedido);
  guardar('ab_pedidos', pedidos);

  // Vaciar carrito
  carrito = [];
  guardarCarrito();
  pintarBadge();
  pintarCarrito();

  // Confirmación
  $('#pedidoNum').textContent = 'Pedido ' + num;
  $('#resumenFinal').innerHTML = `
    ${pedido.items.map(it => `<li><span>${esc(it.nombre)} ×${it.cant}</span><span>${precio(it.precio * it.cant)}</span></li>`).join('')}
    <li><span class="muted">Envío</span><span class="muted">${pedido.costoEnvio === 0 ? 'Gratis' : precio(pedido.costoEnvio)}</span></li>
    <li class="total"><span>Total</span><strong>${precio(pedido.total)}</strong></li>
    <li><span class="muted">Entrega</span><span class="muted">${esc(pedido.cliente.direccion)}</span></li>`;
  mostrarPaso(4);
  toast('¡Pedido confirmado! 🌸', 'ok');
}

function mensajePedido(p) {
  const lineas = p.items.map(it => `• ${it.nombre} ×${it.cant} — ${precio(it.precio * it.cant)}`).join('\n');
  const pagos = { tarjeta:'Tarjeta', transferencia:'Transferencia', efectivo:'Pago al retirar' };
  return `¡Hola Alma Bordado! 🌸 Quiero confirmar mi pedido ${p.num}:\n\n${lineas}\n\n`
    + `Subtotal: ${precio(p.subtotal)}\nEnvío: ${p.costoEnvio === 0 ? 'Gratis' : precio(p.costoEnvio)}\n`
    + `Total: ${precio(p.total)}\n\nEntrega: ${p.cliente.direccion}\nPago: ${pagos[p.pago] || p.pago}\n\n`
    + `Mis datos:\n${p.cliente.nombre}\n${p.cliente.email}\n${p.cliente.tel}`;
}

function abrirCheckout() {
  if (!carrito.length) { toast('Tu carrito está vacío.'); return; }
  checkout.paso = 1; checkout.envio = 'retiro'; checkout.pago = 'tarjeta';
  checkout.region = CONFIG.envio.rmNombre;
  // Llenar regiones
  $('#coRegion').innerHTML = REGIONES.map(r =>
    `<option ${r === CONFIG.envio.rmNombre ? 'selected' : ''}>${esc(r)}</option>`).join('');
  // Limpiar datos sensibles/antiguos del intento anterior
  ['#coDir', '#coComuna', '#coTarjeta', '#coVenc', '#coCvv'].forEach(s => { $(s).value = ''; });
  $$('#modalCheckout .campo.error').forEach(c => c.classList.remove('error'));
  $$('#modalCheckout [aria-invalid="true"]').forEach(i => i.setAttribute('aria-invalid', 'false'));
  cerrarCarrito();
  $('#overlay').classList.add('ver');
  mostrarPaso(1);
  abrirModal('#modalCheckout');
}

/* ----------------------------------------------------------------------
   10) PEDIDO PERSONALIZADO (requerimiento)
   ---------------------------------------------------------------------- */
function enviarRequerimiento(e) {
  e.preventDefault();
  const nombre = $('#reqNombre'), contacto = $('#reqContacto'), desc = $('#reqDescripcion');
  const ok = [validoTexto(nombre), validoContacto(contacto), validoTexto(desc)].every(Boolean);
  if (!ok) { toast('Completa los campos marcados con *'); enfocarPrimerInvalido($('#formReq')); return; }

  const datos = {
    fecha: new Date().toISOString(),
    nombre: nombre.value.trim(),
    contacto: contacto.value.trim(),
    tipo: $('#reqTipo').value,
    para: $('#reqFecha').value || 'Sin fecha definida',
    descripcion: desc.value.trim(),
    adjunto: $('#reqArchivo').files.length ? $('#reqArchivo').files[0].name : 'Sin imagen'
  };
  const reqs = leer('ab_requerimientos', []);
  reqs.push(datos);
  guardar('ab_requerimientos', reqs);

  const texto = `¡Hola Alma Bordado! 🌸 Quiero un pedido personalizado:\n\n`
    + `Nombre: ${datos.nombre}\nContacto: ${datos.contacto}\nTipo: ${datos.tipo}\n`
    + `Para: ${datos.para}\nImagen de referencia: ${datos.adjunto}\n\n`
    + `Proyecto:\n${datos.descripcion}`;
  const asunto = 'Nuevo requerimiento personalizado — Alma Bordado';
  const nombrePila = datos.nombre.split(' ')[0];

  abrirGenerico(`
    <div class="confirma">
      <div class="check-grande" aria-hidden="true">✓</div>
      <h2>¡Tu requerimiento fue enviado! 🌸</h2>
      <p class="sub">Gracias, ${esc(nombrePila)}. Lo revisaremos con mucho cariño y te enviaremos la propuesta y el precio a la brevedad. 💛</p>
      <p class="confirma-extra">¿Quieres adelantárnoslo? También puedes escribirnos directo:</p>
      <div class="modal-acciones">
        <button class="btn btn-sec" id="reqWa">Por WhatsApp</button>
        <button class="btn btn-sec" id="reqMail">Por correo</button>
      </div>
      <button class="btn btn-primario btn-bloque" id="reqCerrar" style="margin-top:12px;">Listo 🌷</button>
    </div>`);
  $('#reqWa').onclick = () => abrirWhatsApp(texto);
  $('#reqMail').onclick = () => abrirCorreo(asunto, texto);
  $('#reqCerrar').onclick = () => cerrarModal('#modalGenerico');

  $('#formReq').reset();
  toast('¡Requerimiento enviado! 💌', 'ok');
}

/* ----------------------------------------------------------------------
   11) CHATBOT GUÍA (scripted, sin IA externa)
   ---------------------------------------------------------------------- */
const CHAT_RESPUESTAS = {
  inicio: {
    msg: '¡Hola! 🌸 Soy Alma, te ayudo a encontrar lo que buscas. ¿Qué te gustaría hacer?',
    opciones: ['Ver bordados listos', 'Ver kits', 'Pedido personalizado', 'Envíos y pagos', 'Contacto']
  },
  'ver bordados listos': {
    msg: 'Tenemos bordados hechos a mano listos para enviar 🪡 Te llevo a la tienda. Puedes filtrarlos por categoría y agregarlos al carrito.',
    accion: { tipo: 'scroll', destino: '#tienda' }, opciones: ['Ver kits', 'Envíos y pagos', 'Contacto']
  },
  'ver kits': {
    msg: 'Los kits traen el diseño + todos los insumos (hilos, aguja, bastidor) y un manual detallado 🎁 Ideales para empezar o regalar. ¡Te llevo!',
    accion: { tipo: 'scroll', destino: '#kits' }, opciones: ['Ver bordados listos', 'Pedido personalizado', 'Contacto']
  },
  'pedido personalizado': {
    msg: 'Bordamos lo que tú imagines 💌 Cuéntanos tu idea en el formulario y te enviamos una propuesta con precio antes de empezar. Nada se borda sin tu confirmación.',
    accion: { tipo: 'scroll', destino: '#personalizado' }, opciones: ['Ver bordados listos', 'Envíos y pagos', 'Contacto']
  },
  'envíos y pagos': {
    msg: 'Puedes retirar en el taller (gratis) o pedir despacho a domicilio. 🚚 ¡El envío es gratis en compras sobre $50.000! El pago se simula en la web y coordinamos contigo al confirmar.',
    opciones: ['Ver bordados listos', 'Pedido personalizado', 'Contacto']
  },
  contacto: {
    msg: 'Escríbenos cuando quieras 💛 Estamos en Instagram (@' + CONFIG.instagram + '), por correo y por WhatsApp. Te llevo a la sección de contacto.',
    accion: { tipo: 'scroll', destino: '#contacto' }, opciones: ['Ver bordados listos', 'Ver kits']
  }
};
const CHAT_PALABRAS = [
  { claves: ['hola', 'buenas', 'saludos', 'hey'], key: 'inicio' },
  { claves: ['kit', 'kits', 'insumo', 'material', 'aprender', 'empezar'], key: 'ver kits' },
  { claves: ['personaliz', 'medida', 'encargo', 'pedido especial', 'a pedido', 'quiero bordar', 'requerimiento'], key: 'pedido personalizado' },
  { claves: ['envio', 'envío', 'despacho', 'entrega', 'pago', 'pagar', 'precio', 'cuanto', 'cuánto', 'retiro'], key: 'envíos y pagos' },
  { claves: ['contacto', 'instagram', 'correo', 'mail', 'telefono', 'teléfono', 'whatsapp', 'escribir'], key: 'contacto' },
  { claves: ['bordado', 'listo', 'tienda', 'comprar', 'producto', 'cuadro', 'bastidor', 'cojin', 'cojín', 'bebe', 'bebé'], key: 'ver bordados listos' }
];

function chatBurbuja(texto, quien) {
  const div = document.createElement('div');
  div.className = 'chat-burbuja ' + (quien === 'yo' ? 'yo' : 'alma');
  div.textContent = texto;
  $('#chatCuerpo').appendChild(div);
  $('#chatCuerpo').scrollTop = $('#chatCuerpo').scrollHeight;
}
function chatOpciones(opciones) {
  $('#chatRapidas').innerHTML = (opciones || []).map(o => `<button class="chat-chip" type="button">${esc(o)}</button>`).join('');
}
function chatResponder(key) {
  const r = CHAT_RESPUESTAS[key];
  if (!r) return;
  setTimeout(() => {
    chatBurbuja(r.msg, 'alma');
    chatOpciones(r.opciones);
    if (r.accion && r.accion.tipo === 'scroll') {
      const dest = document.querySelector(r.accion.destino);
      if (dest) setTimeout(() => { cerrarChat(); dest.scrollIntoView({ behavior: prefiereMenosMovimiento ? 'auto' : 'smooth' }); }, 700);
    }
  }, 280);
}
function chatInterpretar(texto) {
  const t = texto.toLowerCase();
  const m = CHAT_PALABRAS.find(p => p.claves.some(c => t.includes(c)));
  if (m) return chatResponder(m.key);
  setTimeout(() => {
    chatBurbuja('Puedo ayudarte con la tienda, los kits, pedidos a medida, envíos o contacto. ¿Cuál te interesa? 🌷', 'alma');
    chatOpciones(CHAT_RESPUESTAS.inicio.opciones);
  }, 280);
}
let chatIniciado = false;
function abrirChat() {
  $('#chatbot').classList.add('ver');
  $('#chatbot').setAttribute('aria-hidden', 'false');
  $('#chatFab').classList.add('oculto');
  if (!chatIniciado) { chatIniciado = true; chatResponder('inicio'); }
  setTimeout(() => $('#chatInput').focus(), 80);
}
function cerrarChat() {
  $('#chatbot').classList.remove('ver');
  $('#chatbot').setAttribute('aria-hidden', 'true');
  $('#chatFab').classList.remove('oculto');
}

/* ----------------------------------------------------------------------
   12) INICIALIZACIÓN Y EVENTOS
   ---------------------------------------------------------------------- */
function aplicarContacto() {
  $('#anio').textContent = new Date().getFullYear();
  $('#valIg').textContent = '@' + CONFIG.instagram;
  $('#cardIg').href = CONFIG.instagramUrl;
  $('#valMail').textContent = CONFIG.email;
  $('#cardMail').href = 'mailto:' + CONFIG.email;
  $('#valTel').textContent = CONFIG.telDisplay;
  $('#cardTel').href = 'https://wa.me/' + CONFIG.telWhatsapp;
  $('#cardTel').target = '_blank';
  $('#cardTel').rel = 'noopener';
  if (CONFIG.email === 'contacto@almabordado.cl' || CONFIG.telWhatsapp === '56912345678') {
    console.info('%cAlma Bordado:%c recuerda reemplazar los datos de contacto de ejemplo (Instagram, correo y teléfono) en el objeto CONFIG de app.js.',
      'font-weight:bold;color:#9a567a', 'color:inherit');
  }
}

function init() {
  aplicarContacto();
  pintarFiltros();
  pintarTienda();
  pintarKits();
  pintarPuntosBanner();
  pintarBanner(0);
  rotarBanner();
  pintarBadge();
  pintarCarrito();

  // Banner: pausa al pasar el cursor o enfocar dentro; oculta el control si hay un solo banner
  const banner = $('#bannerDest');
  if (BANNERS.length <= 1) { $('#destPausa').style.display = 'none'; $('#bannerPrev').style.display = 'none'; $('#bannerNext').style.display = 'none'; }
  banner.addEventListener('mouseenter', () => { bannerHover = true; clearTimeout(bannerTimer); });
  banner.addEventListener('mouseleave', () => { bannerHover = false; rotarBanner(); });
  banner.addEventListener('focusin', () => { bannerHover = true; clearTimeout(bannerTimer); });
  banner.addEventListener('focusout', () => { bannerHover = false; rotarBanner(); });

  // No permitir fechas pasadas en el requerimiento personalizado
  $('#reqFecha').min = new Date().toISOString().slice(0, 10);

  // Delegación global de clicks
  document.addEventListener('click', (e) => {
    const t = e.target;

    // Agregar al carrito (productos, kits y banner)
    const ag = t.closest('[data-agregar]');
    if (ag) { agregarAlCarrito(ag.dataset.agregar); return; }

    // Filtros tienda
    const chip = t.closest('#filtrosTienda .chip');
    if (chip) {
      $$('#filtrosTienda .chip').forEach(c => c.classList.remove('activo'));
      chip.classList.add('activo');
      pintarTienda(chip.dataset.cat);
      return;
    }

    // Banner: puntos, flechas, pausa
    const punto = t.closest('.dest-punto');
    if (punto) { pintarBanner(Number(punto.dataset.idx)); rotarBanner(); return; }
    if (t.closest('#bannerPrev')) { pintarBanner(bannerIdx - 1); rotarBanner(); return; }
    if (t.closest('#bannerNext')) { pintarBanner(bannerIdx + 1); rotarBanner(); return; }
    if (t.closest('#destPausa')) { alternarPausaBanner(); return; }

    // Carrito: cantidades / quitar
    const cantBtn = t.closest('[data-cant]');
    if (cantBtn) { cambiarCant(cantBtn.dataset.id, Number(cantBtn.dataset.cant)); return; }
    const quitar = t.closest('[data-quitar]');
    if (quitar) { quitarDelCarrito(quitar.dataset.quitar); return; }

    // Navegación del checkout
    const ir = t.closest('[data-ir]');
    if (ir) { irPaso(Number(ir.dataset.ir)); return; }

    // Chatbot: chips de respuesta rápida
    const chip2 = t.closest('.chat-chip');
    if (chip2) { chatBurbuja(chip2.textContent, 'yo'); chatResponder(chip2.textContent.toLowerCase()); chatOpciones([]); return; }
  });

  // Selección de envío / pago / región (funciona con teclado vía labels + radios)
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'envio') {
      checkout.envio = t.value;
      $$('#envioOpciones .opcion-radio').forEach(l => l.classList.toggle('elegida', l.querySelector('input').value === t.value));
      $('#bloqueDireccion').style.display = checkout.envio === 'domicilio' ? 'block' : 'none';
    } else if (t.name === 'pago') {
      checkout.pago = t.value;
      $$('#metodoPago .opcion-radio').forEach(l => l.classList.toggle('elegida', l.querySelector('input').value === t.value));
      $('#bloqueTarjeta').style.display = checkout.pago === 'tarjeta' ? 'grid' : 'none';
    } else if (t.id === 'coRegion') {
      checkout.region = t.value;
    }
  });

  // Carrito abrir/cerrar
  $('#btnCarrito').addEventListener('click', () => { pintarCarrito(); abrirCarrito(); });
  $('#cerrarCarrito').addEventListener('click', cerrarCarrito);
  $('#overlay').addEventListener('click', () => {
    if ($('#modalCheckout').classList.contains('ver')) return; // el checkout se cierra con su botón
    cerrarCarrito();
  });
  $('#btnPagar').addEventListener('click', abrirCheckout);

  // Checkout
  $('#cerrarCheckout').addEventListener('click', () => cerrarModal('#modalCheckout'));
  $('#coCancelar').addEventListener('click', () => { cerrarModal('#modalCheckout'); });
  $('#coPagar').addEventListener('click', finalizarPago);
  $('#coTerminar').addEventListener('click', () => cerrarModal('#modalCheckout'));
  $('#coEnviarPedido').addEventListener('click', () => {
    if (checkout.ultimoPedido) abrirWhatsApp(mensajePedido(checkout.ultimoPedido));
  });
  $('#coEnviarCorreo').addEventListener('click', () => {
    if (checkout.ultimoPedido) abrirCorreo('Nuevo pedido ' + checkout.ultimoPedido.num + ' — Alma Bordado', mensajePedido(checkout.ultimoPedido));
  });

  // Modal genérico
  $('#cerrarGenerico').addEventListener('click', () => cerrarModal('#modalGenerico'));
  $('#modalGenerico').addEventListener('click', (e) => { if (e.target.id === 'modalGenerico') cerrarModal('#modalGenerico'); });
  $('#modalCheckout').addEventListener('click', (e) => { if (e.target.id === 'modalCheckout') cerrarModal('#modalCheckout'); });

  // Requerimiento
  $('#formReq').addEventListener('submit', enviarRequerimiento);

  // Chatbot guía
  $('#chatFab').addEventListener('click', abrirChat);
  $('#chatCerrar').addEventListener('click', cerrarChat);
  $('#chatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = $('#chatInput').value.trim();
    if (!val) return;
    chatBurbuja(val, 'yo');
    $('#chatInput').value = '';
    chatOpciones([]);
    chatInterpretar(val);
  });

  // Menú móvil
  const nav = $('#nav'), btnMenu = $('#btnMenu');
  btnMenu.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    btnMenu.setAttribute('aria-expanded', String(abierto));
    if (abierto) { const a = nav.querySelector('a'); if (a) setTimeout(() => a.focus(), 40); }
  });
  nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') { nav.classList.remove('abierto'); btnMenu.setAttribute('aria-expanded', 'false'); } });

  // Tecla Escape cierra lo que esté abierto
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (nav.classList.contains('abierto')) { nav.classList.remove('abierto'); btnMenu.setAttribute('aria-expanded', 'false'); btnMenu.focus(); }
    else if ($('#modalGenerico').classList.contains('ver')) cerrarModal('#modalGenerico');
    else if ($('#modalCheckout').classList.contains('ver')) cerrarModal('#modalCheckout');
    else if ($('#carritoPanel').classList.contains('ver')) cerrarCarrito();
    else if ($('#chatbot').classList.contains('ver')) cerrarChat();
  });

  // Trampa de foco dentro del diálogo activo (Tab / Shift+Tab)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    let cont = null;
    if ($('#modalGenerico').classList.contains('ver')) cont = $('#modalGenerico .modal-caja');
    else if ($('#modalCheckout').classList.contains('ver')) cont = $('#modalCheckout .modal-caja');
    else if ($('#carritoPanel').classList.contains('ver')) cont = $('#carritoPanel');
    if (!cont) return;
    const foco = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', cont)
      .filter(el => el.offsetParent !== null);
    if (!foco.length) return;
    const primero = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });

  // Formateo amistoso del número de tarjeta (simulado)
  document.addEventListener('input', (e) => {
    if (e.target.id === 'coTarjeta') {
      let v = e.target.value.replace(/\D/g, '').slice(0, 16);
      e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
    }
    if (e.target.id === 'coVenc') {
      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
      e.target.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
    }
  });

  // Resaltar enlace activo según la sección visible
  const enlaces = $$('.nav a');
  const secciones = enlaces.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && secciones.length) {
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach(en => {
        if (en.isIntersecting) {
          enlaces.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + en.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach(s => obs.observe(s));
  }
}

document.addEventListener('DOMContentLoaded', init);
