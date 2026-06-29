/* ======================================================================
   Alma Bordado — Landing · Lógica
   Sitio estático: carrito, checkout simulado, requerimientos y talleres
   se guardan en el navegador y se envían a la empresa por WhatsApp/correo.
   ====================================================================== */
'use strict';

/* ----------------------------------------------------------------------
   1) CONFIGURACIÓN  ·  EDITA AQUÍ tus datos reales de contacto y envío
   ---------------------------------------------------------------------- */
const CONFIG = {
  instagram: 'alma.bordado',
  instagramUrl: 'https://instagram.com/alma.bordado',
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
const PRODUCTOS = [
  { id:'b1', nombre:'Bastidor «Jardín de primavera»', precio:24990, emoji:'🌷', tono:'rosa', cat:'Cuadros',
    desc:'Cuadro circular de 20 cm con flores silvestres bordadas a mano, listo para colgar.', destacado:true, insignia:'' },
  { id:'b2', nombre:'Bastidor «Mar y ballenas»', precio:22990, emoji:'🐋', tono:'azul', cat:'Cuadros',
    desc:'Escena marina en tonos suaves, ideal para la pieza de un bebé o tu rincón favorito.' },
  { id:'b3', nombre:'Polera «Ramo silvestre»', precio:27990, emoji:'👕', tono:'salvia', cat:'Prendas',
    desc:'Polera de algodón con un ramito bordado en el pecho. Tallas S a XL.' },
  { id:'b4', nombre:'Tote bag «Flores de campo»', precio:18990, emoji:'👜', tono:'trigo', cat:'Accesorios',
    desc:'Bolso de tela resistente con bordado floral. Para llevar tus cosas con estilo.' },
  { id:'b5', nombre:'Mini bastidor «Abeja feliz»', precio:12990, emoji:'🐝', tono:'trigo', cat:'Cuadros',
    desc:'Bordado pequeñito de 10 cm, perfecto para regalar o empezar tu colección.', insignia:'Nuevo' },
  { id:'b6', nombre:'Cojín «Hojas de eucalipto»', precio:29990, emoji:'🛋️', tono:'salvia', cat:'Hogar',
    desc:'Funda de cojín 40×40 cm con ramas de eucalipto bordadas. Suave y acogedora.' },
  { id:'b7', nombre:'Gorro «Margaritas»', precio:16990, emoji:'🧢', tono:'rosa', cat:'Prendas',
    desc:'Gorro de algodón con margaritas bordadas a mano. Talla única.' },
  { id:'b8', nombre:'Bastidor «Inicial floral»', precio:19990, emoji:'🌼', tono:'trigo', cat:'Cuadros',
    desc:'La inicial que elijas, rodeada de flores. Dinos la letra al comprar.' }
];

// Kits de bordado (incluyen insumos + manual)
const KITS = [
  { id:'k1', nombre:'Kit «Cumple mes bebé» (1 a 12)', precio:32990, emoji:'🍼', tono:'azul', kit:true,
    desc:'12 mini diseños para registrar mes a mes el primer año. El regalo perfecto para un nacimiento.',
    incluye:['12 diseños (mes 1 al 12)','Hilos DMC','Aguja','Bastidor','Tela','Manual paso a paso'],
    destacado:true, insignia:'Destacado' },
  { id:'k2', nombre:'Kit «Bolsitas de Halloween»', precio:19990, emoji:'🎃', tono:'trigo', kit:true,
    desc:'Borda dos bolsitas temáticas para dulces y sustos. Edición de temporada.',
    incluye:['Diseño','Hilos','Aguja','Bastidor','2 bolsitas','Manual'],
    destacado:true, insignia:'Temporada' },
  { id:'k3', nombre:'Kit «Primeras puntadas»', precio:15990, emoji:'🌼', tono:'salvia', kit:true,
    desc:'Pensado para quienes empiezan: aprende las puntadas básicas con un diseño tierno.',
    incluye:['Diseño','Hilos','Aguja','Bastidor','Manual ilustrado'], destacado:true, insignia:'' },
  { id:'k4', nombre:'Kit «Ramo silvestre»', precio:21990, emoji:'🌸', tono:'rosa', kit:true,
    desc:'Un ramo de flores de campo para enmarcar. Nivel intermedio, muy relajante.',
    incluye:['Diseño','Hilos DMC','Aguja','Bastidor 20 cm','Tela','Manual'] },
  { id:'k5', nombre:'Kit «Mar de ballenas»', precio:20990, emoji:'🐳', tono:'azul', kit:true,
    desc:'Olas suaves y ballenitas para un cuadro lleno de calma.',
    incluye:['Diseño','Hilos','Aguja','Bastidor','Tela','Manual'] },
  { id:'k6', nombre:'Kit «Inicial floral»', precio:17990, emoji:'✒️', tono:'trigo', kit:true,
    desc:'Borda tu inicial entre flores. Incluye plantillas de la A a la Z.',
    incluye:['Plantillas A–Z','Hilos','Aguja','Bastidor','Manual'] }
];

const CATALOGO = [...PRODUCTOS, ...KITS];
const porId = (id) => CATALOGO.find(p => p.id === id);

// Destacados del banner (los marcados con destacado:true)
const DESTACADOS = CATALOGO.filter(p => p.destacado);

// Talleres de bordado
const TALLERES = [
  { id:'t1', titulo:'Iniciación al bordado: tu primer bastidor', modo:'presencial', fecha:'2026-07-12',
    lugar:'Taller Alma Bordado · Providencia', duracion:'3 horas', nivel:'Principiante', precio:18000, cupos:8,
    desc:'Aprende a montar el bastidor y las puntadas esenciales. Te llevas tu primer bordado terminado.' },
  { id:'t2', titulo:'Bordando flores silvestres', modo:'virtual', fecha:'2026-07-26',
    lugar:'Online (Zoom, con grabación)', duracion:'2 horas', nivel:'Intermedio', precio:12000, cupos:20,
    desc:'Crea un ramo de flores con puntadas de relleno y texturas, desde la comodidad de tu casa.' },
  { id:'t3', titulo:'Bordado en prendas: renueva tu ropa', modo:'presencial', fecha:'2026-08-09',
    lugar:'Taller Alma Bordado · Providencia', duracion:'3,5 horas', nivel:'Intermedio', precio:22000, cupos:6,
    desc:'Aprende a bordar sobre poleras y jeans sin dañar la tela. Trae una prenda para intervenir.' },
  { id:'t4', titulo:'Tarde de bordado y café', modo:'presencial', fecha:'2026-08-23',
    lugar:'Taller Alma Bordado · Providencia', duracion:'2 horas', nivel:'Todos los niveles', precio:8000, cupos:0,
    desc:'Un encuentro relajado entre bordadoras para avanzar tus proyectos y compartir un café.' },
  { id:'t5', titulo:'Punto de cruz moderno', modo:'virtual', fecha:'2026-09-06',
    lugar:'Online (Zoom, con grabación)', duracion:'2 horas', nivel:'Principiante', precio:12000, cupos:15,
    desc:'Descubre el punto de cruz con diseños frescos y actuales. Incluye patrón descargable.' }
];

/* ----------------------------------------------------------------------
   3) HELPERS
   ---------------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const fmt = new Intl.NumberFormat(CONFIG.locale, { style:'currency', currency:CONFIG.moneda, maximumFractionDigits:0 });
const precio = (n) => fmt.format(n);

const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

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
        <div class="ci-foto" aria-hidden="true">${p.emoji}</div>
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
  return `<article class="producto tono-${p.tono}">
      <div class="foto" aria-hidden="true">${p.emoji}<span class="etiqueta">${esc(p.cat || (p.kit ? 'Kit' : ''))}</span>${insignia}</div>
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
  $('#filtrosTienda').innerHTML = cats.map((c, i) =>
    `<button class="chip${i === 0 ? ' activo' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
}
function pintarKits() {
  $('#grillaKits').innerHTML = KITS.map(tarjetaProducto).join('');
}

/* Banner de destacados rotativo */
let destIdx = 0, destTimer, destPausaManual = false, destHover = false;
const prefiereMenosMovimiento = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
function pintarDestacado(i) {
  if (!DESTACADOS.length) return;
  destIdx = (i + DESTACADOS.length) % DESTACADOS.length;
  const p = DESTACADOS[destIdx];
  $('#destNombre').textContent = p.nombre;
  $('#destDesc').textContent = p.desc;
  $('#destPrecio').textContent = precio(p.precio);
  $('#destAgregar').dataset.id = p.id;
  $('#destVer').setAttribute('href', p.kit ? '#kits' : '#tienda');
  $$('#destPuntos .dest-punto').forEach((b, idx) => {
    const act = idx === destIdx;
    b.classList.toggle('activo', act);
    b.setAttribute('aria-current', act ? 'true' : 'false');
  });
}
function pintarPuntosDestacado() {
  $('#destPuntos').innerHTML = DESTACADOS.map((p, i) =>
    `<button class="dest-punto" data-idx="${i}" aria-current="false" aria-label="Ver destacado ${i + 1}: ${esc(p.nombre)}"></button>`).join('');
}
function rotarDestacado() {
  clearTimeout(destTimer);
  // Respeta "reducir movimiento", la pausa manual, el hover/foco y los casos sin contenido que rotar
  if (prefiereMenosMovimiento || destPausaManual || destHover || DESTACADOS.length <= 1) return;
  destTimer = setTimeout(() => { pintarDestacado(destIdx + 1); rotarDestacado(); }, 6000);
}
function alternarPausaDestacado() {
  destPausaManual = !destPausaManual;
  const b = $('#destPausa');
  b.setAttribute('aria-pressed', String(destPausaManual));
  b.textContent = destPausaManual ? '▶' : '⏸';
  b.setAttribute('aria-label', (destPausaManual ? 'Reanudar' : 'Pausar') + ' el cambio automático de destacados');
  rotarDestacado();
}

/* Talleres */
function inscritosTalleres() {
  const v = leer('ab_talleres_inscritos', {});
  return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
}
function cuposDisponibles(t) {
  const usados = Number(inscritosTalleres()[t.id]) || 0;
  return Math.max(0, t.cupos - usados);
}
function pintarTalleres() {
  $('#listaTalleres').innerHTML = TALLERES.map(t => {
    const fc = fechaCorta(t.fecha);
    const disp = cuposDisponibles(t);
    let cuposTxt, cuposCls, btn;
    if (disp === 0) {
      cuposTxt = 'Cupos agotados'; cuposCls = 'agotado';
      btn = `<button class="btn btn-sec btn-mini" disabled>Sin cupos</button>`;
    } else if (disp <= 4) {
      cuposTxt = `¡Últimos ${disp} cupos!`; cuposCls = 'pocos';
      btn = `<button class="btn btn-rosa btn-mini" data-taller="${t.id}">Reservar cupo</button>`;
    } else {
      cuposTxt = `${disp} cupos disponibles`; cuposCls = '';
      btn = `<button class="btn btn-primario btn-mini" data-taller="${t.id}">Reservar cupo</button>`;
    }
    return `<article class="taller">
        <div class="fecha-caja" aria-hidden="true">
          <div class="mes">${fc.mes}</div><div class="dia">${fc.dia}</div><div class="anio">${fc.anio}</div>
        </div>
        <div class="t-cuerpo">
          <span class="modo ${t.modo}">${t.modo === 'virtual' ? '💻 Virtual' : '📍 Presencial'}</span>
          <h3>${esc(t.titulo)}</h3>
          <div class="t-meta">
            <span>🗓️ ${fechaLarga(t.fecha)}</span>
            <span>⏱️ ${esc(t.duracion)}</span>
            <span>🎯 ${esc(t.nivel)}</span>
            <span>📍 ${esc(t.lugar)}</span>
          </div>
          <p class="t-desc">${esc(t.desc)}</p>
          <div class="t-pie">
            <span class="precio">${precio(t.precio)}</span>
            <span class="cupos ${cuposCls}">${cuposTxt}</span>
            ${btn}
          </div>
        </div>
      </article>`;
  }).join('');
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
    presupuesto: $('#reqPresupuesto').value.trim() || 'No indicado',
    adjunto: $('#reqArchivo').files.length ? $('#reqArchivo').files[0].name : 'Sin imagen'
  };
  const reqs = leer('ab_requerimientos', []);
  reqs.push(datos);
  guardar('ab_requerimientos', reqs);

  const texto = `¡Hola Alma Bordado! 🌸 Quiero un pedido personalizado:\n\n`
    + `Nombre: ${datos.nombre}\nContacto: ${datos.contacto}\nTipo: ${datos.tipo}\n`
    + `Para: ${datos.para}\nPresupuesto: ${datos.presupuesto}\nImagen de referencia: ${datos.adjunto}\n\n`
    + `Proyecto:\n${datos.descripcion}`;
  const asunto = 'Nuevo requerimiento personalizado — Alma Bordado';

  abrirGenerico(`
    <div class="confirma">
      <div class="check-grande" aria-hidden="true">✓</div>
      <h2>¡Recibimos tu idea! 🌷</h2>
      <p class="sub">Para que tu requerimiento llegue a Alma Bordado, envíalo por WhatsApp o correo. Te responderemos con una propuesta antes de empezar.</p>
      <div class="modal-acciones">
        <button class="btn btn-rosa" id="reqWa">Enviar por WhatsApp</button>
        <button class="btn btn-sec" id="reqMail">Enviar por correo</button>
      </div>
      <div class="modal-acciones" style="margin-top:10px;">
        <button class="btn btn-fantasma" id="reqCopiar">📋 Copiar mensaje</button>
        <button class="btn btn-fantasma" id="reqCerrar">Cerrar</button>
      </div>
    </div>`);
  $('#reqWa').onclick = () => abrirWhatsApp(texto);
  $('#reqMail').onclick = () => abrirCorreo(asunto, texto);
  $('#reqCopiar').onclick = () => copiarTexto(texto);
  $('#reqCerrar').onclick = () => cerrarModal('#modalGenerico');

  $('#formReq').reset();
  toast('Requerimiento guardado 💌', 'ok');
}

/* ----------------------------------------------------------------------
   11) INSCRIPCIÓN A TALLERES
   ---------------------------------------------------------------------- */
function abrirTaller(id) {
  const t = TALLERES.find(x => x.id === id);
  if (!t || cuposDisponibles(t) === 0) return;
  abrirGenerico(`
    <h2>Reservar cupo</h2>
    <p class="sub">${esc(t.titulo)} · ${fechaLarga(t.fecha)} · ${precio(t.precio)}</p>
    <form id="formTaller" novalidate>
      <div class="campo full">
        <label for="tNombre">Tu nombre <span class="req">*</span></label>
        <input type="text" id="tNombre" autocomplete="name" placeholder="Camila Soto">
        <div class="msg-error">Ingresa tu nombre.</div>
      </div>
      <div class="fila">
        <div class="campo">
          <label for="tEmail">Email <span class="req">*</span></label>
          <input type="email" id="tEmail" autocomplete="email" placeholder="correo@ejemplo.com">
          <div class="msg-error">Ingresa un email válido.</div>
        </div>
        <div class="campo">
          <label for="tTel">Teléfono <span class="req">*</span></label>
          <input type="tel" id="tTel" autocomplete="tel" placeholder="+56 9 1234 5678">
          <div class="msg-error">Ingresa tu teléfono.</div>
        </div>
      </div>
      <div class="campo full">
        <label for="tCupos">Cantidad de cupos</label>
        <select id="tCupos">${Array.from({ length: Math.min(4, cuposDisponibles(t)) }, (_, i) =>
          `<option value="${i + 1}">${i + 1}</option>`).join('')}</select>
      </div>
      <button type="submit" class="btn btn-primario btn-bloque btn-grande" style="margin-top:6px;">Confirmar reserva</button>
    </form>`);
  $('#formTaller').addEventListener('submit', (e) => {
    e.preventDefault();
    const n = $('#tNombre'), em = $('#tEmail'), tel = $('#tTel');
    const ok = [validoTexto(n), validoEmail(em), validoTel(tel)].every(Boolean);
    if (!ok) { toast('Revisa tus datos.'); enfocarPrimerInvalido($('#formTaller')); return; }
    const cant = Number($('#tCupos').value);
    const disp = cuposDisponibles(t);   // revalida por si cambió mientras llenaba el formulario
    if (cant > disp) { toast(disp > 0 ? `Solo quedan ${disp} cupo(s).` : 'Ya no quedan cupos.'); pintarTalleres(); return; }

    const texto = `¡Hola Alma Bordado! 🌸 Quiero reservar ${cant} cupo(s) para el taller "${t.titulo}" del ${fechaLarga(t.fecha)} (${t.modo}).\n\n`
      + `Nombre: ${n.value.trim()}\nEmail: ${em.value.trim()}\nTeléfono: ${tel.value.trim()}\nTotal: ${precio(t.precio * cant)}`;

    // El cupo solo se descuenta cuando la persona realmente avisa a la empresa
    let reservado = false;
    function confirmarReserva() {
      if (reservado) return;
      reservado = true;
      const inscritos = inscritosTalleres();
      inscritos[t.id] = (inscritos[t.id] || 0) + cant;
      guardar('ab_talleres_inscritos', inscritos);
      pintarTalleres();
      toast('¡Cupo reservado! 🌼', 'ok');
    }
    abrirGenerico(`
      <div class="confirma">
        <div class="check-grande" aria-hidden="true">✓</div>
        <h2>Confirma tu reserva 🌼</h2>
        <p class="sub">Para guardar tu cupo, avísale a Alma Bordado por WhatsApp o correo. Coordinaremos el pago contigo.</p>
        <div class="modal-acciones">
          <button class="btn btn-rosa" id="tWa">Confirmar por WhatsApp</button>
          <button class="btn btn-sec" id="tMail">Confirmar por correo</button>
        </div>
        <div class="modal-acciones" style="margin-top:10px;">
          <button class="btn btn-fantasma" id="tCopiar">📋 Copiar mensaje</button>
          <button class="btn btn-fantasma" id="tCerrar">Cerrar</button>
        </div>
      </div>`);
    $('#tWa').onclick = () => { confirmarReserva(); abrirWhatsApp(texto); };
    $('#tMail').onclick = () => { confirmarReserva(); abrirCorreo('Reserva de taller — Alma Bordado', texto); };
    $('#tCopiar').onclick = () => { confirmarReserva(); copiarTexto(texto); };
    $('#tCerrar').onclick = () => cerrarModal('#modalGenerico');
  });
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
  pintarPuntosDestacado();
  pintarDestacado(0);
  rotarDestacado();
  pintarTalleres();
  pintarBadge();
  pintarCarrito();

  // Banner: pausa al pasar el cursor o enfocar dentro; oculta el botón si no hay autoavance
  const banner = $('.banner-dest');
  if (prefiereMenosMovimiento || DESTACADOS.length <= 1) $('#destPausa').style.display = 'none';
  banner.addEventListener('mouseenter', () => { destHover = true; clearTimeout(destTimer); });
  banner.addEventListener('mouseleave', () => { destHover = false; rotarDestacado(); });
  banner.addEventListener('focusin', () => { destHover = true; clearTimeout(destTimer); });
  banner.addEventListener('focusout', () => { destHover = false; rotarDestacado(); });

  // No permitir fechas pasadas en el requerimiento personalizado
  $('#reqFecha').min = new Date().toISOString().slice(0, 10);

  // Delegación global de clicks
  document.addEventListener('click', (e) => {
    const t = e.target;

    // Agregar al carrito (productos, kits y destacado)
    const ag = t.closest('[data-agregar]');
    if (ag) { agregarAlCarrito(ag.dataset.agregar); return; }
    if (t.closest('#destAgregar')) { agregarAlCarrito($('#destAgregar').dataset.id); return; }

    // Filtros tienda
    const chip = t.closest('#filtrosTienda .chip');
    if (chip) {
      $$('#filtrosTienda .chip').forEach(c => c.classList.remove('activo'));
      chip.classList.add('activo');
      pintarTienda(chip.dataset.cat);
      return;
    }

    // Puntos del banner
    const punto = t.closest('.dest-punto');
    if (punto) { pintarDestacado(Number(punto.dataset.idx)); rotarDestacado(); return; }

    // Carrito: cantidades / quitar
    const cantBtn = t.closest('[data-cant]');
    if (cantBtn) { cambiarCant(cantBtn.dataset.id, Number(cantBtn.dataset.cant)); return; }
    const quitar = t.closest('[data-quitar]');
    if (quitar) { quitarDelCarrito(quitar.dataset.quitar); return; }

    // Talleres
    const tallerBtn = t.closest('[data-taller]');
    if (tallerBtn) { abrirTaller(tallerBtn.dataset.taller); return; }

    // Navegación del checkout
    const ir = t.closest('[data-ir]');
    if (ir) { irPaso(Number(ir.dataset.ir)); return; }

    // Pausa/reanuda del banner de destacados
    if (t.closest('#destPausa')) { alternarPausaDestacado(); return; }
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
