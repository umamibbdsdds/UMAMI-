/* ============================================================
   UMAMI — Interacción (Vanilla JS)
   Navbar sticky · Menú móvil accesible · Scroll reveal ·
   Filtros de carta con loader · Carrusel de reseñas · Horarios
   ============================================================ */

/* ---------- Utilidades compartidas ---------- */

function estrellasHTML(valor, extra) {
  const pct = Math.max(0, Math.min(100, (Number(valor) / 5) * 100));
  return `<span class="stars ${extra || ''}" role="img" aria-label="Calificación: ${Number(valor)} de 5 estrellas">
    <span class="stars-fill" aria-hidden="true" style="width:${pct}%">★★★★★</span>
    <span aria-hidden="true">★★★★★</span>
  </span>`;
}

function initSkeletons(scope) {
  (scope || document).querySelectorAll('.img-skeleton').forEach(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return;
    const listo = () => wrap.classList.remove('img-skeleton');
    if (img.complete && img.naturalWidth > 0) listo();
    else {
      img.addEventListener('load', listo, { once: true });
      img.addEventListener('error', listo, { once: true });
    }
  });
}

const CATEGORIAS = {
  entradas: 'Entrada',
  fuertes: 'Plato fuerte',
  postres: 'Postre',
  bebidas: 'Bebida'
};

const ALERGENOS = {
  gluten: { label: 'Gluten', icono: 'wheat' },
  lacteos: { label: 'Lácteos', icono: 'milk' },
  huevo: { label: 'Huevo', icono: 'egg' },
  pescado: { label: 'Pescado', icono: 'fish' },
  mariscos: { label: 'Mariscos', icono: 'shell' },
  sesamo: { label: 'Sésamo', icono: 'triangle-alert' },
  soya: { label: 'Soya', icono: 'triangle-alert' }
};

function tarjetaPlato(item) {
  const alergenos = item.alergenos.map(a =>
    `<button type="button" class="alergeno alergeno-btn" data-tag="${a}" data-tagtipo="alergeno" aria-pressed="false" title="Filtrar por ${ALERGENOS[a].label}"><i data-lucide="${ALERGENOS[a].icono}" aria-hidden="true"></i>${ALERGENOS[a].label}</button>`
  ).join('');

  const tiempo = item.tiempo >= 20
    ? `<span class="badge badge-tiempo lento"><i data-lucide="timer" aria-hidden="true"></i>Elaboración ${item.tiempo} min</span>`
    : `<span class="badge badge-tiempo"><i data-lucide="clock" aria-hidden="true"></i>${item.tiempo} min</span>`;

  const etiquetas = item.etiquetas.map(e =>
    `<button type="button" class="badge badge-tiempo etiqueta-btn" data-tag="${e}" data-tagtipo="etiqueta" aria-pressed="false" title="Filtrar por ${e === 'vegano' ? 'Vegano' : 'Vegetariano'}"><i data-lucide="leaf" aria-hidden="true"></i>${e === 'vegano' ? 'Vegano' : 'Vegetariano'}</button>`
  ).join('');

  const destacado = item.destacado
    ? `<span class="badge badge-chef absolute left-3 top-3"><i data-lucide="star" aria-hidden="true"></i>Firma del chef</span>`
    : '';

  return `<article class="card">
    <div class="card-img-wrap img-skeleton">
      <img src="${item.imagen}" alt="${item.nombre}: ${item.descripcion}" loading="lazy" width="900" height="672">
      ${destacado}
      <span class="badge badge-cat absolute right-3 top-3">${CATEGORIAS[item.categoria]}</span>
    </div>
    <div class="card-body">
      <div class="menu-leader">
        <h3 class="font-display text-lg font-semibold leading-snug">${item.nombre}</h3>
        <span class="dots" aria-hidden="true"></span>
        <span class="precio">$${item.precio}</span>
      </div>
      <p class="text-sm text-carbon-mute leading-relaxed">${item.descripcion}</p>
      <div class="flex flex-wrap items-center gap-1.5 pt-1">${alergenos}</div>
      <div class="flex flex-wrap items-center justify-between gap-2 mt-1 pt-3 border-t border-[#E7E2D8]">
        ${tiempo}
        <span class="flex flex-wrap gap-1.5">${etiquetas}</span>
      </div>
    </div>
  </article>`;
}

function refrescarIconos() {
  if (window.lucide) lucide.createIcons();
}

/* ---------- Header sticky con blur ---------- */

function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Menú móvil (overlay con panel deslizante) ---------- */

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const panel = menu.querySelector('.mobile-menu-panel');
  const cerrarBtn = document.getElementById('cerrar-menu');

  function abrir() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    document.body.classList.add('no-scroll');
    menu.removeAttribute('inert');
    setTimeout(() => cerrarBtn && cerrarBtn.focus(), 140);
  }

  function cerrar(devolverFoco = true) {
    if (!menu.classList.contains('open')) return;
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú de navegación');
    document.body.classList.remove('no-scroll');
    menu.setAttribute('inert', '');
    if (devolverFoco) toggle.focus();
  }

  toggle.addEventListener('click', () => (menu.classList.contains('open') ? cerrar() : abrir()));
  if (cerrarBtn) cerrarBtn.addEventListener('click', () => cerrar());
  menu.querySelector('.mobile-menu-backdrop').addEventListener('click', () => cerrar(false));
  menu.querySelectorAll('a').forEach(enlace => enlace.addEventListener('click', () => cerrar(false)));

  document.addEventListener('keydown', e => {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key === 'Tab') {
      const focusables = Array.from(panel.querySelectorAll('a[href], button'));
      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
  });
}

/* ---------- Scroll reveal progresivo ---------- */

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('revealed');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
  els.forEach(el => io.observe(el));
}

/* ---------- Página de menú: filtros + loader simulado ---------- */

function initMenuPage() {
  const grid = document.getElementById('menu-grid');
  if (!grid || typeof UMAMI === 'undefined') return;

  const loader = document.getElementById('menu-loader');
  const vacio = document.getElementById('menu-empty');
  const input = document.getElementById('buscador');
  const selectPrecio = document.getElementById('filtro-precio');
  const selectTipo = document.getElementById('filtro-tipo');

  const estado = { categoria: 'todas', tipo: 'todos', precio: 'todos', excluir: new Set(), texto: '', tag: null };
  let timer = null;

  const pasaFiltros = it => {
    if (estado.categoria !== 'todas' && it.categoria !== estado.categoria) return false;
    if (estado.tipo !== 'todos' && it.tipo !== estado.tipo) return false;
    if (estado.precio === 'bajo' && it.precio > 12) return false;
    if (estado.precio === 'medio' && (it.precio <= 12 || it.precio > 25)) return false;
    if (estado.precio === 'alto' && it.precio <= 25) return false;
    for (const ex of estado.excluir) {
      if (ex === 'vegetariano') {
        if (!it.etiquetas.includes('vegetariano') && !it.etiquetas.includes('vegano')) return false;
      } else if (it.alergenos.includes(ex)) return false;
    }
    if (estado.tag) {
      if (estado.tag.tipo === 'alergeno') { if (!it.alergenos.includes(estado.tag.valor)) return false; }
      else if (!it.etiquetas.includes(estado.tag.valor)) return false;
    }
    const q = estado.texto.trim().toLowerCase();
    if (q && !(it.nombre + ' ' + it.descripcion + ' ' + it.tipo + ' ' + (it.categoria || '')).toLowerCase().includes(q)) return false;
    return true;
  };

  const etiquetaTag = t => t.tipo === 'alergeno'
    ? ALERGENOS[t.valor].label
    : (t.valor === 'vegano' ? 'Vegano' : 'Vegetariano');

  const sincronizarTags = () => {
    grid.querySelectorAll('.alergeno-btn, .etiqueta-btn').forEach(b => {
      const activo = Boolean(estado.tag) && b.dataset.tag === estado.tag.valor && b.dataset.tagtipo === estado.tag.tipo;
      b.setAttribute('aria-pressed', String(activo));
    });
  };

  const actualizarBannerTag = () => {
    const wrap = document.getElementById('tag-activo');
    if (!wrap) return;
    if (!estado.tag) { wrap.classList.add('hidden'); wrap.innerHTML = ''; return; }
    wrap.classList.remove('hidden');
    wrap.innerHTML = `<span class="text-xs font-semibold uppercase tracking-wider text-carbon-mute">Filtrando por etiqueta:</span>` +
      `<button type="button" id="quitar-tag" class="chip chip-activo" aria-label="Quitar filtro de etiqueta"><i data-lucide="tag" aria-hidden="true"></i>${etiquetaTag(estado.tag)}<i data-lucide="x" aria-hidden="true"></i></button>`;
    refrescarIconos();
  };

  const render = () => {
    const items = UMAMI.menu.filter(pasaFiltros);
    grid.innerHTML = items.map(tarjetaPlato).join('');
    const contador = document.getElementById('menu-count');
    if (contador) contador.textContent = items.length === 1 ? 'Mostrando 1 plato' : `Mostrando ${items.length} de ${UMAMI.menu.length} platos`;
    vacio.classList.toggle('hidden', items.length > 0);
    refrescarIconos();
    initSkeletons(grid);
    sincronizarTags();
    actualizarBannerTag();
  };

  const filtrar = (demora = 450) => {
    loader.classList.remove('hidden');
    grid.setAttribute('aria-busy', 'true');
    clearTimeout(timer);
    timer = setTimeout(() => {
      render();
      loader.classList.add('hidden');
      grid.removeAttribute('aria-busy');
    }, demora);
  };

  document.querySelectorAll('.filter-tab[data-categoria]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab[data-categoria]').forEach(t =>
        t.setAttribute('aria-pressed', String(t === tab)));
      estado.categoria = tab.dataset.categoria;
      filtrar();
    });
  });

  if (selectTipo) selectTipo.addEventListener('change', () => {
    estado.tipo = selectTipo.value;
    filtrar();
  });

  if (selectPrecio) selectPrecio.addEventListener('change', () => {
    estado.precio = selectPrecio.value;
    filtrar();
  });

  document.querySelectorAll('.chip[data-excluir]').forEach(chip => {
    chip.addEventListener('click', () => {
      const activo = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', String(!activo));
      activo ? estado.excluir.delete(chip.dataset.excluir) : estado.excluir.add(chip.dataset.excluir);
      filtrar();
    });
  });

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.alergeno-btn, .etiqueta-btn');
    if (!btn || !grid.contains(btn)) return;
    const nuevo = { tipo: btn.dataset.tagtipo, valor: btn.dataset.tag };
    const mismo = estado.tag && estado.tag.tipo === nuevo.tipo && estado.tag.valor === nuevo.valor;
    estado.tag = mismo ? null : nuevo;
    filtrar();
  });

  const bannerTag = document.getElementById('tag-activo');
  if (bannerTag) bannerTag.addEventListener('click', e => {
    if (e.target.closest('#quitar-tag')) { estado.tag = null; filtrar(); }
  });

  if (input) input.addEventListener('input', () => {
    estado.texto = input.value;
    filtrar(280);
  });

  document.getElementById('limpiar-filtros')?.addEventListener('click', () => {
    estado.categoria = 'todas';
    estado.tipo = 'todos';
    estado.precio = 'todos';
    estado.excluir.clear();
    estado.texto = '';
    estado.tag = null;
    document.querySelectorAll('.filter-tab[data-categoria]').forEach(t =>
      t.setAttribute('aria-pressed', String(t.dataset.categoria === 'todas')));
    document.querySelectorAll('.chip[data-excluir]').forEach(c => c.setAttribute('aria-pressed', 'false'));
    if (selectTipo) selectTipo.value = 'todos';
    if (selectPrecio) selectPrecio.value = 'todos';
    if (input) input.value = '';
    filtrar();
  });

  filtrar(650);
}

/* ---------- Inicio: destacados y vista previa de reseñas ---------- */

function initDestacados() {
  const grid = document.getElementById('destacados-grid');
  if (!grid || typeof UMAMI === 'undefined') return;
  const destacados = UMAMI.menu.filter(i => i.destacado).slice(0, 4);
  grid.innerHTML = destacados.map(tarjetaPlato).join('');
  refrescarIconos();
  initSkeletons(grid);
}

function initPreviewResenas() {
  const cont = document.getElementById('preview-resenas');
  if (!cont || typeof UMAMI === 'undefined') return;

  const picks = [UMAMI.resenas[0], UMAMI.resenas[4], UMAMI.resenas[7]];
  cont.innerHTML = picks.map(r => `
    <article class="resena-card">
      ${estrellasHTML(r.estrellas, 'stars-sm')}
      <p class="text-[15px] leading-relaxed text-carbon-soft">“${r.texto}”</p>
      <footer class="mt-auto pt-3 border-t border-[#E7E2D8]">
        <p class="font-semibold">${r.nombre}</p>
        <p class="text-xs text-carbon-mute mt-0.5">${r.fecha} · recomendó: ${r.plato}</p>
      </footer>
    </article>`).join('');

  const suma = UMAMI.resenas.reduce((s, r) => s + r.estrellas, 0);
  const promedio = (suma / UMAMI.resenas.length).toFixed(1);
  const num = document.getElementById('preview-promedio');
  const stars = document.getElementById('preview-stars');
  if (num) num.textContent = promedio;
  if (stars) stars.innerHTML = estrellasHTML(promedio);
}

/* ---------- Página de reseñas: promedio dinámico + carrusel ---------- */

function initResenasPage() {
  const track = document.getElementById('resenas-track');
  if (!track || typeof UMAMI === 'undefined') return;

  track.innerHTML = UMAMI.resenas.map(r => `
    <article class="resena-card" role="listitem">
      <div class="flex items-center justify-between gap-3">
        ${estrellasHTML(r.estrellas, 'stars-sm')}
        <i data-lucide="quote" class="lucide w-7 h-7 text-[#E7E2D8]" aria-hidden="true"></i>
      </div>
      <p class="text-[15px] leading-relaxed text-carbon-soft">“${r.texto}”</p>
      <footer class="mt-auto pt-3 border-t border-[#E7E2D8]">
        <p class="font-semibold">${r.nombre}</p>
        <p class="text-xs text-carbon-mute mt-0.5">${r.fecha} · recomendó: ${r.plato}</p>
      </footer>
    </article>`).join('');

  const promedio = (UMAMI.resenas.reduce((s, r) => s + r.estrellas, 0) / UMAMI.resenas.length).toFixed(1);
  const num = document.getElementById('promedio-num');
  const stars = document.getElementById('promedio-stars');
  if (num) num.textContent = promedio;
  if (stars) stars.innerHTML = estrellasHTML(promedio);

  const total = document.getElementById('total-resenas');
  if (total) total.textContent = String(UMAMI.resenas.length);

  const dist = document.getElementById('distribucion');
  if (dist) {
    dist.innerHTML = UMAMI.distribucion.map(d => `
      <li class="flex items-center gap-4">
        <span class="flex w-14 items-center gap-1 text-sm font-semibold"><i data-lucide="star" class="!w-4 !h-4" aria-hidden="true"></i>${d.estrellas}</span>
        <div class="barra-dist flex-1"><span style="width:${d.porcentaje}%"></span></div>
        <span class="w-10 text-right text-sm text-carbon-mute">${d.porcentaje}%</span>
      </li>`).join('');
  }

  refrescarIconos();

  const prev = document.getElementById('carrusel-prev');
  const next = document.getElementById('carrusel-next');
  if (!prev || !next) return;

  const suave = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  const paso = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 24 : 380);

  prev.addEventListener('click', () => track.scrollBy({ left: -paso(), behavior: suave }));
  next.addEventListener('click', () => track.scrollBy({ left: paso(), behavior: suave }));

  const actualizar = () => {
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
  };
  track.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar);
  actualizar();
}

/* Exponer para re-render tras publicar una reseña nueva (auth-resenas.js) */
window.initResenasPage = initResenasPage;

/* ---------- Horarios: estado abierto/cerrado + fila de hoy ---------- */

function initHorarios() {
  const tabla = document.getElementById('tabla-horarios');
  if (!tabla || typeof UMAMI === 'undefined') return;

  const ahora = new Date();
  const idxJS = ahora.getDay();                    // 0 = domingo
  const idxHoy = idxJS === 0 ? 6 : idxJS - 1;      // horarios van de lunes a domingo
  const H = UMAMI.horarios;

  const filaHoy = tabla.querySelector(`tr[data-dia="${idxJS}"]`);
  if (filaHoy && !filaHoy.querySelector('.marca-hoy')) {
    filaHoy.classList.add('hoy');
    filaHoy.querySelector('td').insertAdjacentHTML('beforeend', ' <span class="marca-hoy">Hoy</span>');
  }

  const badge = document.getElementById('estado-actual');
  if (!badge) return;

  const aMin = h => {
    if (!h) return null;
    const [hh, mm] = h.split(':').map(Number);
    return hh * 60 + mm;
  };
  const ahoraMin = ahora.getHours() * 60 + ahora.getMinutes();
  const hoy = H[idxHoy];
  const cierre = hoy.cierra === '00:00' ? 1440 : aMin(hoy.cierra);
  const abierto = Boolean(hoy.abre) && ahoraMin >= aMin(hoy.abre) && ahoraMin < cierre;

  let texto;
  if (abierto) {
    texto = `Abierto ahora · cerramos ${hoy.cierra === '00:00' ? 'a medianoche' : hoy.cierra}`;
  } else if (hoy.abre && ahoraMin < aMin(hoy.abre)) {
    texto = `Cerrado ahora · abrimos hoy a las ${hoy.abre}`;
  } else {
    let prox = null, salto = 0;
    for (let k = 1; k <= 7; k++) {
      const j = (idxHoy + k) % 7;
      if (H[j].abre) { prox = H[j]; salto = k; break; }
    }
    const cuando = salto === 1 ? 'mañana' : 'el ' + prox.dia.toLowerCase();
    texto = `Cerrado ahora · abrimos ${cuando} a las ${prox.abre}`;
  }

  badge.className = `estado-badge ${abierto ? 'abierto' : 'cerrado'}`;
  badge.innerHTML = `<span class="punto" aria-hidden="true"></span>${texto}`;
}

/* ---------- Arranque ---------- */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initReveal();
  initMenuPage();
  initDestacados();
  initPreviewResenas();
  initResenasPage();
  initHorarios();
  initSkeletons();
  refrescarIconos();

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});

/* ═══════════ Intro loader (video de carga) ═══════════ */
(function () {
  var loader = document.getElementById('intro-loader');
  if (!loader) return;
  var video = document.getElementById('intro-video');
  var skip = document.getElementById('intro-skip');
  var cerrado = false;

  function cerrar() {
    if (cerrado) return;
    cerrado = true;
    loader.classList.add('oculto');
    document.documentElement.classList.remove('intro-activo');
    document.body.classList.remove('intro-activo');
    setTimeout(function () {
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    }, 700);
  }

  // Mostrar solo una vez por sesión (al cerrar el navegador se reinicia).
  var yaVisto = false;
  try { yaVisto = !!sessionStorage.getItem('umami_intro_visto'); } catch (e) {}
  if (yaVisto) { cerrar(); return; }
  try { sessionStorage.setItem('umami_intro_visto', '1'); } catch (e) {}

  if (video) {
    video.addEventListener('ended', cerrar);
    var intento = video.play();
    if (intento && typeof intento.catch === 'function') {
      intento.catch(function () { /* autoplay bloqueado: se cerrará por tiempo o al saltar */ });
    }
  }
  if (skip) skip.addEventListener('click', cerrar);
  // Salvavidas: si el video no carga/termina, cerrar tras 15 s
  setTimeout(cerrar, 15000);
})();
