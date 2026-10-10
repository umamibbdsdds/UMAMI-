(function () {
  'use strict';

  var ADMIN_EMAIL = 'umami8reservas@gmail.com';

  var CFG = window.UMAMI_SUPABASE || {};
  var NUBE = !!(CFG.url && CFG.anonKey && window.supabase && window.supabase.createClient);
  var sb = NUBE ? window.supabase.createClient(CFG.url, CFG.anonKey) : null;

  var gate = document.getElementById('admin-gate');
  var panel = document.getElementById('admin-panel');
  var formLogin = document.getElementById('form-admin');
  var avisoLogin = document.getElementById('admin-aviso');
  var listaReservas = document.getElementById('lista-reservas');
  var listaResenas = document.getElementById('lista-resenas');
  var countReservas = document.getElementById('count-reservas');
  var countResenas = document.getElementById('count-resenas');

  function iconos() { if (window.lucide) lucide.createIcons(); }
  function escapar(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fechaCorta(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return escapar(iso);
    return d.toLocaleString('es-SV', { dateStyle: 'medium', timeStyle: 'short' });
  }
  function traducir(msg) {
    msg = String(msg || '');
    if (/invalid login credentials/i.test(msg)) return 'Correo o contraseña incorrectos.';
    if (/email not confirmed/i.test(msg)) return 'La cuenta de administrador no está confirmada en Supabase.';
    return msg;
  }

  function abrirPanel() {
    gate.style.display = 'none';
    panel.style.display = 'block';
    cargarTodo();
  }
  function cerrarPanel() {
    panel.style.display = 'none';
    gate.style.display = 'flex';
    if (formLogin) formLogin.reset();
  }

  if (!NUBE) {
    if (avisoLogin) avisoLogin.textContent = 'Supabase no está configurado. Revisa supabase-config.js.';
    return;
  }

  function emailDe(session) {
    return session && session.user && session.user.email ? session.user.email.toLowerCase() : '';
  }
  function esAdmin(session) {
    return emailDe(session) === ADMIN_EMAIL.toLowerCase();
  }

  sb.auth.getSession().then(function (res) {
    var session = res && res.data ? res.data.session : null;
    if (esAdmin(session)) abrirPanel();
  });

  if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (document.getElementById('admin-user').value || '').trim();
      var pass = (document.getElementById('admin-pass').value || '').trim();
      avisoLogin.textContent = 'Verificando...';
      sb.auth.signInWithPassword({ email: email, password: pass }).then(function (res) {
        if (res.error) { avisoLogin.textContent = traducir(res.error.message); return; }
        if (!esAdmin(res.data.session)) {
          avisoLogin.textContent = 'Esta cuenta no tiene permisos de administración.';
          sb.auth.signOut();
          return;
        }
        avisoLogin.textContent = '';
        abrirPanel();
      });
    });
  }

  var btnSalir = document.getElementById('btn-salir');
  if (btnSalir) btnSalir.addEventListener('click', function () {
    sb.auth.signOut().then(cerrarPanel);
  });
  var btnRefrescar = document.getElementById('btn-refrescar');
  if (btnRefrescar) btnRefrescar.addEventListener('click', cargarTodo);

  document.querySelectorAll('[data-admin-tab]').forEach(function (b) {
    b.addEventListener('click', function () {
      var destino = b.getAttribute('data-admin-tab');
      document.querySelectorAll('[data-admin-tab]').forEach(function (x) {
        x.setAttribute('aria-selected', x === b ? 'true' : 'false');
      });
      document.querySelectorAll('[data-admin-seccion]').forEach(function (s) {
        s.style.display = s.getAttribute('data-admin-seccion') === destino ? 'block' : 'none';
      });
    });
  });

  function vacio(msg) { return '<p class="admin-vacio">' + escapar(msg) + '</p>'; }

  function cargarTodo() {
    cargarReservas();
    cargarResenas();
  }

  function cargarReservas() {
    listaReservas.innerHTML = vacio('Cargando reservas...');
    sb.from('reservas').select('*').order('created_at', { ascending: false })
      .then(function (res) {
        if (res.error) { listaReservas.innerHTML = vacio('Error al cargar: ' + res.error.message); return; }
        var datos = res.data || [];
        if (countReservas) countReservas.textContent = String(datos.length);
        if (!datos.length) { listaReservas.innerHTML = vacio('Aún no hay reservas.'); return; }
        listaReservas.innerHTML = datos.map(tarjetaReserva).join('');
        enlazarBorrar(listaReservas, 'reservas', cargarReservas);
        iconos();
      });
  }

  function tarjetaReserva(r) {
    return '<article class="admin-card">'
      + '<div class="admin-card-top">'
      + '<h3>' + escapar((r.nombre || '') + ' ' + (r.apellido || '')) + '</h3>'
      + '<button type="button" class="admin-borrar" data-id="' + r.id + '" aria-label="Eliminar reserva"><i data-lucide="trash-2" aria-hidden="true"></i></button>'
      + '</div>'
      + '<ul class="admin-datos">'
      + '<li><i data-lucide="calendar" aria-hidden="true"></i>' + escapar(r.fecha || '-') + ' · ' + escapar(r.hora || '-') + '</li>'
      + '<li><i data-lucide="users" aria-hidden="true"></i>Mesas: ' + escapar(r.mesas || '-') + ' · Personas: ' + escapar(r.personas || '-') + '</li>'
      + '<li><i data-lucide="phone" aria-hidden="true"></i>' + escapar(r.telefono || '-') + '</li>'
      + '<li><i data-lucide="mail" aria-hidden="true"></i>' + escapar(r.email || '-') + '</li>'
      + (r.comentarios ? '<li><i data-lucide="message-square" aria-hidden="true"></i>' + escapar(r.comentarios) + '</li>' : '')
      + '</ul>'
      + '<p class="admin-fecha">' + escapar(fechaCorta(r.created_at)) + '</p>'
      + '</article>';
  }

  function cargarResenas() {
    listaResenas.innerHTML = vacio('Cargando reseñas...');
    sb.from('resenas').select('*').order('created_at', { ascending: false })
      .then(function (res) {
        if (res.error) { listaResenas.innerHTML = vacio('Error al cargar: ' + res.error.message); return; }
        var datos = res.data || [];
        if (countResenas) countResenas.textContent = String(datos.length);
        if (!datos.length) { listaResenas.innerHTML = vacio('Aún no hay reseñas en la nube.'); return; }
        listaResenas.innerHTML = datos.map(tarjetaResena).join('');
        enlazarBorrar(listaResenas, 'resenas', cargarResenas);
        iconos();
      });
  }

  function estrellas(n) {
    n = parseInt(n, 10) || 0;
    var s = '';
    for (var i = 0; i < 5; i++) s += (i < n ? '★' : '☆');
    return s;
  }

  function tarjetaResena(r) {
    return '<article class="admin-card">'
      + '<div class="admin-card-top">'
      + '<h3>' + escapar(r.nombre || 'Anónimo') + '</h3>'
      + '<button type="button" class="admin-borrar" data-id="' + r.id + '" aria-label="Eliminar reseña"><i data-lucide="trash-2" aria-hidden="true"></i></button>'
      + '</div>'
      + '<p class="admin-estrellas">' + estrellas(r.estrellas) + (r.plato ? ' <span>· ' + escapar(r.plato) + '</span>' : '') + '</p>'
      + '<p class="admin-texto">' + escapar(r.texto || '') + '</p>'
      + '<p class="admin-fecha">' + escapar(r.email || '') + ' · ' + escapar(fechaCorta(r.created_at) || r.fecha || '') + '</p>'
      + '</article>';
  }

  function enlazarBorrar(contenedor, tabla, recargar) {
    contenedor.querySelectorAll('.admin-borrar').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        if (!id) return;
        if (!window.confirm('¿Eliminar este registro de forma permanente?')) return;
        btn.disabled = true;
        sb.from(tabla).delete().eq('id', id).then(function (res) {
          if (res.error) { window.alert('No se pudo eliminar: ' + res.error.message); btn.disabled = false; return; }
          recargar();
        });
      });
    });
  }
})();
