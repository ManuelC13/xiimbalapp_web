// Datos globales del sitio
export const SITE = {
  name: 'XíimbalApp',

  // Imágenes
  logos: {
    hero: '/images/logo-amber-950.png',      // navbar transparente
    scrolled: '/images/logo-amber-800.webp', // navbar con fondo, después de scroll
    footer: '/images/logo-amber-50.png',     // pie de página
  },
  appScreenshot: '/images/app-home.jpeg',

  // Enlace del botón "Descargar app"
  downloadUrl: '#descargar',

  // Enlace para el botón "Descargar APK"
  apk: {
    url: '', 
    version: '',                     // OPCIONAL - ejemplo: 1.0.0
    size: '',                        // OPCIONAL - ejemplo: 45 MB
    minAndroid: '', // OPCIONAL - ejemplo: Android 8.0 o superior
  },

  // Redes sociales
  social: [
    { name: 'facebook', label: 'Facebook', href: '#' },
    { name: 'instagram', label: 'Instagram', href: '#' },
    { name: 'tiktok', label: 'TikTok', href: '#' },
  ],

  // Contacto
    contactEmail: 'xiimbalapp@gmail.com',

  // Acceso al panel de administración
  adminUrl: '/admin',

  // Enlaces del menú
  nav: [
    { label: 'Qué es', href: '#que-es' },
    { label: 'Qué puedes hacer', href: '#que-puedes-hacer' },
    { label: 'Pueblos', href: '#pueblos' },
  ],
}