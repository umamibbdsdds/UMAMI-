/* ============================================================
   UMAMI — Configuración de Supabase (reseñas y cuentas en la nube)
   ------------------------------------------------------------
   CÓMO ACTIVARLO (pasos para el proyecto estudiantil):
   1) Crea una cuenta gratis en https://supabase.com y un proyecto.
   2) En el panel: Settings → API, copia «Project URL» y la clave
      «anon public» y pégalas abajo.
   3) En Authentication → Providers → Email, desactiva
      «Confirm email» (así al registrarse entra directo, ideal para demo).
   4) En SQL Editor, pega y ejecuta el script que te dejé en
      assets/sql/resenas.sql (crea la tabla y los permisos).

   Mientras url/anonKey estén vacíos, el sitio funciona en modo LOCAL
   (las reseñas y cuentas solo se guardan en ese navegador).
   ============================================================ */
window.UMAMI_SUPABASE = {
  url: 'https://afcguwnjbyftrmdjxxhv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmY2d1d25qYnlmdHJtZGp4eGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1OTg2NDgsImV4cCI6MjEwNzE3NDY0OH0.1fuYpcSuRxolK5dIR53tFN799MElyyrjLcbf7_IMYwI'
};
