
(function () {
  'use strict';
  if (typeof UMAMI === 'undefined') return;

  var CFG = window.UMAMI_SUPABASE || {};
  var NUBE = !!(CFG.url && CFG.anonKey && window.supabase && window.supabase.createClient);
  var sb = NUBE ? window.supabase.createClient(CFG.url, CFG.anonKey) : null;

  var LS_USERS = 'umami_usuarios';
  var LS_SESSION = 'umami_sesion';
  var LS_RESENAS = 'umami_resenas_usuarios';

  var SEED = (window.__UMAMI_SEED_RESENAS = window.__UMAMI_SEED_RESENAS || UMAMI.resenas.slice());
  var _ses = null;
  var _resenasRemotas = [];

  function leer(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  function escapar(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function iniciales(n) { return String(n).trim().split(/\s+/).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase(); }
  function mesActual() {
    var m = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var d = new Date(); return m[d.getMonth()] + ' ' + d.getFullYear();
  }
  function iconos() { if (window.lucide) lucide.createIcons(); }
  function hash(s) { var h = 5381, i = s.length; while (i) { h = (h * 33) ^ s.charCodeAt(--i); } return (h >>> 0).toString(16); }

  function traducir(msg) {
    msg = String(msg || '');
    if (/already registered|already exists/i.test(msg)) return 'Ya existe una cuenta con ese correo. Inicia sesión.';
    if (/invalid login credentials/i.test(msg)) return 'Correo o contraseña incorrectos.';
    if (/email not confirmed/i.test(msg)) return 'Debes confirmar tu correo antes de iniciar sesión.';
    if (/password should be at least/i.test(msg)) return 'La contraseña debe tener al menos 6 caracteres.';
    return msg;
  }

  function sesionLocal() { return leer(LS_SESSION, null); }
  function usuariosLocal() { return leer(LS_USERS, []); }
  function listaResenasLocal() { return leer(LS_RESENAS, []); }

  function sesionActual() { return NUBE ? _ses : sesionLocal(); }
  function misResenas() { return NUBE ? _resenasRemotas : listaResenasLocal(); }

  function sincronizar() { UMAMI.resenas = misResenas().concat(SEED); }

  function refrescarVista() {
    sincronizar();
    if (typeof window.initResenasPage === 'function') window.initResenasPage();
    marcarPropias();
  }

  function mapFila(r) {
    return { nombre: r.nombre, email: r.email || '', fecha: r.fecha || '', estrellas: r.estrellas, plato: r.plato, texto: r.texto };
  }

  function cargarResenasRemotas() {
    if (!NUBE) return Promise.resolve();
    return sb.from('resenas').select('*').order('created_at', { ascending: false })
      .then(function (res) {
        if (res.error) { console.warn('Umami: no se pudieron cargar reseñas → ' + res.error.message); return; }
        _resenasRemotas = (res.data || []).map(mapFila);
      });
  }

  function syncSesionNube(session) {
    if (session && session.user) {
      var u = session.user;
      var nombre = (u.user_metadata && u.user_metadata.nombre) || (u.email ? u.email.split('@')[0] : 'Invitado');
      _ses = { nombre: nombre, email: u.email || '' };
    } else { _ses = null; }
  }

  sincronizar();

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

  function registrar(nombre, email, pass) {
    if (NUBE) {
      sb.auth.signUp({ email: email, password: pass, options: { data: { nombre: nombre } } })
        .then(function (res) {
          if (res.error) return aviso('registro-aviso', 'error', traducir(res.error.message));
          if (res.data && res.data.session) {
            syncSesionNube(res.data.session);
            aviso('registro-aviso', 'ok', '¡Cuenta creada! Ya puedes dejar tu reseña.');
            setTimeout(function () { cerrarModal(); renderGate(); }, 650);
          } else {
            aviso('registro-aviso', 'ok', 'Cuenta creada. Revisa tu correo para confirmarla e inicia sesión.');
          }
        });
      return;
    }
    var lista = usuariosLocal();
    if (lista.some(function (u) { return u.email === email; }))
      return aviso('registro-aviso', 'error', 'Ya existe una cuenta con ese correo. Inicia sesión.');
    lista.push({ nombre: nombre, email: email, pass: hash(pass) });
    guardar(LS_USERS, lista);
    guardar(LS_SESSION, { nombre: nombre, email: email });
    aviso('registro-aviso', 'ok', '¡Cuenta creada! Ya puedes dejar tu reseña.');
    setTimeout(function () { cerrarModal(); renderGate(); }, 650);
  }

  function entrar(email, pass) {
    if (NUBE) {
      sb.auth.signInWithPassword({ email: email, password: pass })
        .then(function (res) {
          if (res.error) return aviso('login-aviso', 'error', traducir(res.error.message));
          syncSesionNube(res.data.session);
          aviso('login-aviso', 'ok', 'Sesión iniciada. ¡Bienvenido/a de nuevo!');
          setTimeout(function () { cerrarModal(); renderGate(); }, 500);
        });
      return;
    }
    var u = usuariosLocal().filter(function (x) { return x.email === email; })[0];
    if (!u || u.pass !== hash(pass))
      return aviso('login-aviso', 'error', 'Correo o contraseña incorrectos.');
    guardar(LS_SESSION, { nombre: u.nombre, email: u.email });
    aviso('login-aviso', 'ok', 'Sesión iniciada. ¡Bienvenido/a de nuevo!');
    setTimeout(function () { cerrarModal(); renderGate(); }, 500);
  }

  function salir(cb) {
    if (NUBE) { sb.auth.signOut().then(function () { _ses = null; if (cb) cb(); }); return; }
    try { localStorage.removeItem(LS_SESSION); } catch (e) {}
    if (cb) cb();
  }

  function initModal() {
    modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.querySelectorAll('[data-auth-cerrar]').forEach(function (b) { b.addEventListener('click', cerrarModal); });
    modal.querySelectorAll('.auth-tab').forEach(function (t) {
      t.addEventListener('click', function () { cambiarTab(t.dataset.authTab); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) cerrarModal();
    });

    modal.querySelector('#form-registro').addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = document.getElementById('reg-nombre').value.trim();
      var email = document.getElementById('reg-email').value.trim().toLowerCase();
      var pass = document.getElementById('reg-pass').value;
      if (nombre.length < 2) return aviso('registro-aviso', 'error', 'Escribe tu nombre completo.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return aviso('registro-aviso', 'error', 'Correo electrónico no válido.');
      if (pass.length < 6) return aviso('registro-aviso', 'error', 'La contraseña debe tener al menos 6 caracteres.');
      registrar(nombre, email, pass);
    });

    modal.querySelector('#form-login').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('login-email').value.trim().toLowerCase();
      var pass = document.getElementById('login-pass').value;
      entrar(email, pass);
    });

    iconos();
  }

  function opcionesPlatos() {
    return UMAMI.menu.map(function (p) {
      return '<option value="' + escapar(p.nombre) + '">' + escapar(p.nombre) + '</option>';
    }).join('');
  }

  function publicarResena(nueva, gate) {
    if (NUBE) {
      sb.from('resenas').insert({
        nombre: nueva.nombre, email: nueva.email, fecha: nueva.fecha,
        estrellas: nueva.estrellas, plato: nueva.plato, texto: nueva.texto
      }).then(function (res) {
        if (res.error) return aviso('resena-aviso', 'error', 'No se pudo publicar: ' + traducir(res.error.message));
        cargarResenasRemotas().then(function () {
          refrescarVista();
          aviso('resena-aviso', 'ok', '¡Gracias! Tu reseña ya aparece arriba y la verán todos.');
          var f = gate.querySelector('#form-resena'); if (f) f.reset();
          var c = gate.querySelector('#star5'); if (c) c.checked = true;
          var sec = document.getElementById('titulo-testimonios');
          if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      return;
    }
    var lista = listaResenasLocal();
    lista.unshift(nueva);
    guardar(LS_RESENAS, lista);
    refrescarVista();
    aviso('resena-aviso', 'ok', '¡Gracias! Tu reseña ya aparece arriba.');
    var ff = gate.querySelector('#form-resena'); if (ff) ff.reset();
    var cc = gate.querySelector('#star5'); if (cc) cc.checked = true;
    var sec2 = document.getElementById('titulo-testimonios');
    if (sec2) sec2.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderGate() {
    var gate = document.getElementById('resena-gate');
    if (!gate) return;
    var ses = sesionActual();

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

    gate.querySelector('#cerrar-sesion').addEventListener('click', function () { salir(renderGate); });

    gate.querySelector('#form-resena').addEventListener('submit', function (e) {
      e.preventDefault();
      var estrellas = Number((gate.querySelector('input[name="estrellas"]:checked') || {}).value || 0);
      var plato = gate.querySelector('#resena-plato').value;
      var texto = gate.querySelector('#resena-texto').value.trim();
      if (!estrellas) return aviso('resena-aviso', 'error', 'Elige una calificación.');
      if (texto.length < 12) return aviso('resena-aviso', 'error', 'Escribe un poco más sobre tu experiencia (mínimo 12 caracteres).');
      publicarResena({ nombre: ses.nombre, email: ses.email, fecha: mesActual(), estrellas: estrellas, plato: plato, texto: texto }, gate);
    });

    iconos();
    marcarPropias();
  }

  function marcarPropias() {
    var track = document.getElementById('resenas-track');
    if (!track) return;
    var ses = sesionActual();
    var mios = misResenas();
    for (var i = 0; i < mios.length; i++) {
      var card = track.children[i];
      if (card && ses && mios[i].email && mios[i].email === ses.email) card.classList.add('resena-propia');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initModal();
    if (NUBE) {
      sb.auth.getSession()
        .then(function (r) { syncSesionNube(r.data.session); return cargarResenasRemotas(); })
        .then(function () { refrescarVista(); renderGate(); });
      sb.auth.onAuthStateChange(function (_e, session) { syncSesionNube(session); renderGate(); });
    } else {
      renderGate();
    }
  });
})();
