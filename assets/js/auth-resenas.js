/* ============================================================
   UMAMI — Login/registro + reseñas con cuenta (Vanilla JS)
   NOTA: sitio estático sin backend. La «cuenta» se guarda en el
   navegador (localStorage); es una autenticación simulada, no
   sustituye a un login real de servidor.
   ============================================================ */
(function () {
  'use strict';
  if (typeof UMAMI === 'undefined') return;

  var LS_USERS = 'umami_usuarios';
  var LS_SESSION = 'umami_sesion';
  var LS_RESENAS = 'umami_resenas_usuarios';

  /* ---- Seed original + combinación con reseñas de usuarios ---- */
  var SEED = (window.__UMAMI_SEED_RESENAS = window.__UMAMI_SEED_RESENAS || UMAMI.resenas.slice());

  function leer(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  function resenasUsuarios() { return leer(LS_RESENAS, []); }
  function usuarios() { return leer(LS_USERS, []); }
  function sesion() { return leer(LS_SESSION, null); }

  function sincronizar() { UMAMI.resenas = resenasUsuarios().concat(SEED); }
  sincronizar(); // se ejecuta antes del DOMContentLoaded de main.js

  /* hash simple: evita guardar la contraseña en texto plano (NO es seguridad real) */
  function hash(s) { var h = 5381, i = s.length; while (i) { h = (h * 33) ^ s.charCodeAt(--i); } return (h >>> 0).toString(16); }

  function escapar(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function iniciales(n) { return n.trim().split(/\s+/).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase(); }
  function mesActual() {
    var m = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var d = new Date(); return m[d.getMonth()] + ' ' + d.getFullYear();
  }
  function iconos() { if (window.lucide) lucide.createIcons(); }

  /* ---------- Modal de autenticación ---------- */
  var modal, ultimoFoco = null;

  function abrirModal(tab) {
    if (!modal) return;
    ultimoFoco = document.activeElement;
    modal.classList.add('open');
    modal.removeAttribute('inert');
    document.body.classList.add('no-scroll');
    cambiarTab(tab || 'login');
    var f = modal.querySelector('.auth-form.activo input');
    setTimeout(function () { if (f) f.focus(); }, 150);
  }
  function cerrarModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('inert', '');
    document.body.classList.remove('no-scroll');
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }
  function cambiarTab(cual) {
    modal.querySelectorAll('.auth-tab').forEach(function (t) {
      t.setAttribute('aria-selected', String(t.dataset.authTab === cual));
    });
    modal.querySelector('#form-login').classList.toggle('activo', cual === 'login');
    modal.querySelector('#form-registro').classList.toggle('activo', cual === 'registro');
  }

  function aviso(id, tipo, texto) {
    var el = document.getElementById(id);
    if (!el) return;
    el.className = 'form-aviso ' + tipo;
    el.textContent = texto;
  }

  function initModal() {
    modal = document.getElementById('auth-modal');
    if (!modal) return;

    modal.querySelectorAll('[data-auth-cerrar]').forEach(function (b) {
      b.addEventListener('click', cerrarModal);
    });
    modal.querySelectorAll('.auth-tab').forEach(function (t) {
      t.addEventListener('click', function () { cambiarTab(t.dataset.authTab); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) cerrarModal();
    });

    /* Registro */
    modal.querySelector('#form-registro').addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = document.getElementById('reg-nombre').value.trim();
      var email = document.getElementById('reg-email').value.trim().toLowerCase();
      var pass = document.getElementById('reg-pass').value;
      if (nombre.length < 2) return aviso('registro-aviso', 'error', 'Escribe tu nombre completo.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return aviso('registro-aviso', 'error', 'Correo electrónico no válido.');
      if (pass.length < 6) return aviso('registro-aviso', 'error', 'La contraseña debe tener al menos 6 caracteres.');
      var lista = usuarios();
      if (lista.some(function (u) { return u.email === email; }))
        return aviso('registro-aviso', 'error', 'Ya existe una cuenta con ese correo. Inicia sesión.');
      lista.push({ nombre: nombre, email: email, pass: hash(pass) });
      guardar(LS_USERS, lista);
      guardar(LS_SESSION, { nombre: nombre, email: email });
      aviso('registro-aviso', 'ok', '¡Cuenta creada! Ya puedes dejar tu reseña.');
      setTimeout(function () { cerrarModal(); renderGate(); }, 650);
    });

    /* Login */
    modal.querySelector('#form-login').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('login-email').value.trim().toLowerCase();
      var pass = document.getElementById('login-pass').value;
      var u = usuarios().filter(function (x) { return x.email === email; })[0];
      if (!u || u.pass !== hash(pass))
        return aviso('login-aviso', 'error', 'Correo o contraseña incorrectos.');
      guardar(LS_SESSION, { nombre: u.nombre, email: u.email });
      aviso('login-aviso', 'ok', 'Sesión iniciada. ¡Bienvenido/a de nuevo!');
      setTimeout(function () { cerrarModal(); renderGate(); }, 500);
    });

    iconos();
  }

  /* ---------- Panel de reseña (según sesión) ---------- */
  function opcionesPlatos() {
    return UMAMI.menu.map(function (p) {
      return '<option value="' + escapar(p.nombre) + '">' + escapar(p.nombre) + '</option>';
    }).join('');
  }

  function renderGate() {
    var gate = document.getElementById('resena-gate');
    if (!gate) return;
    var ses = sesion();

    if (!ses) {
      gate.innerHTML =
        '<div class="text-center">' +
          '<span class="icono-circulo verde mx-auto mb-4"><i data-lucide="lock" aria-hidden="true"></i></span>' +
          '<h3 class="font-display text-xl font-semibold mb-2">Inicia sesión para opinar</h3>' +
          '<p class="text-carbon-mute mb-6 max-w-md mx-auto">Solo las personas con una cuenta pueden publicar reseñas. Crea la tuya en segundos o inicia sesión si ya la tienes.</p>' +
          '<div class="flex flex-wrap justify-center gap-3">' +
            '<button type="button" id="abrir-login" class="btn btn-primary"><i data-lucide="log-in" aria-hidden="true"></i>Iniciar sesión</button>' +
            '<button type="button" id="abrir-registro" class="btn btn-outline-dark"><i data-lucide="user-plus" aria-hidden="true"></i>Crear cuenta</button>' +
          '</div>' +
        '</div>';
      gate.querySelector('#abrir-login').addEventListener('click', function () { abrirModal('login'); });
      gate.querySelector('#abrir-registro').addEventListener('click', function () { abrirModal('registro'); });
      iconos();
      marcarPropias();
      return;
    }

    gate.innerHTML =
      '<div class="flex flex-wrap items-center justify-between gap-3 mb-6">' +
        '<span class="sesion-chip"><span class="avatar">' + escapar(iniciales(ses.nombre)) + '</span>Hola, ' + escapar(ses.nombre.split(' ')[0]) + '</span>' +
        '<button type="button" id="cerrar-sesion" class="btn btn-outline-dark btn-sm"><i data-lucide="log-out" aria-hidden="true"></i>Cerrar sesión</button>' +
      '</div>' +
      '<form id="form-resena" class="flex flex-col gap-5" novalidate>' +
        '<div class="form-campo">' +
          '<label id="lbl-estrellas">Tu calificación</label>' +
          '<div class="estrellas-input" role="radiogroup" aria-labelledby="lbl-estrellas">' +
            [5,4,3,2,1].map(function (n) {
              return '<input type="radio" name="estrellas" id="star' + n + '" value="' + n + '"' + (n === 5 ? ' checked' : '') + '>' +
                     '<label for="star' + n + '" title="' + n + ' estrellas" aria-label="' + n + ' estrellas">★</label>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="form-campo">' +
          '<label for="resena-plato">¿Qué plato recomiendas?</label>' +
          '<select id="resena-plato" class="form-control" required>' + opcionesPlatos() + '</select>' +
        '</div>' +
        '<div class="form-campo">' +
          '<label for="resena-texto">Tu reseña</label>' +
          '<textarea id="resena-texto" class="form-control" maxlength="600" placeholder="Cuéntanos cómo fue tu experiencia en Umami…" required></textarea>' +
        '</div>' +
        '<div id="resena-aviso" role="alert" aria-live="polite"></div>' +
        '<button type="submit" class="btn btn-primary self-start"><i data-lucide="send" aria-hidden="true"></i>Publicar reseña</button>' +
      '</form>';

    gate.querySelector('#cerrar-sesion').addEventListener('click', function () {
      try { localStorage.removeItem(LS_SESSION); } catch (e) {}
      renderGate();
    });

    gate.querySelector('#form-resena').addEventListener('submit', function (e) {
      e.preventDefault();
      var estrellas = Number((gate.querySelector('input[name="estrellas"]:checked') || {}).value || 0);
      var plato = gate.querySelector('#resena-plato').value;
      var texto = gate.querySelector('#resena-texto').value.trim();
      if (!estrellas) return aviso('resena-aviso', 'error', 'Elige una calificación.');
      if (texto.length < 12) return aviso('resena-aviso', 'error', 'Escribe un poco más sobre tu experiencia (mínimo 12 caracteres).');
      var nueva = { nombre: ses.nombre, email: ses.email, fecha: mesActual(), estrellas: estrellas, plato: plato, texto: texto };
      var lista = resenasUsuarios();
      lista.unshift(nueva);
      guardar(LS_RESENAS, lista);
      sincronizar();
      if (typeof window.initResenasPage === 'function') window.initResenasPage();
      aviso('resena-aviso', 'ok', '¡Gracias! Tu reseña ya aparece arriba.');
      e.target.reset();
      var cinco = gate.querySelector('#star5'); if (cinco) cinco.checked = true;
      marcarPropias();
      var sec = document.getElementById('titulo-testimonios');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    iconos();
    marcarPropias();
  }

  /* Marca con un distintivo las tarjetas que pertenecen al usuario */
  function marcarPropias() {
    var track = document.getElementById('resenas-track');
    if (!track) return;
    var ses = sesion();
    var mios = resenasUsuarios();
    for (var i = 0; i < mios.length; i++) {
      var card = track.children[i];
      if (card && ses && mios[i].email === ses.email) card.classList.add('resena-propia');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initModal();
    renderGate();
  });
})();
