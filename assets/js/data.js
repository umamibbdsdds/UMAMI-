
const UMAMI = {

  info: {
    nombre: 'Umami',
    slogan: 'El quinto sabor, elevado a arte',
    direccion: '20 Avenida Norte y Diagonal Cipactli, San Salvador',
    telefono: '+503 7200 8919',
    telefonoHref: 'tel:+50372008919',
    email: 'umami8reservas@gmail.com',
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    maps: 'https://maps.google.com/?q=20+Avenida+Norte,+Diagonal+Cipactli,+San+Salvador,+El+Salvador'
  },

  menu: [

    {
      id: 'tiradito-nikkei',
      nombre: 'Tiradito Nikkei',
      categoria: 'entradas',
      tipo: 'mar',
      descripcion: 'Láminas de lenguado en leche de tigre de yuzu, aceite de ajonjolí y crisps de camote morado.',
      precio: 15,
      imagen: 'assets/img/platos/tiradito-nikkei.jpg',
      alergenos: ['pescado', 'sesamo'],
      etiquetas: [],
      tiempo: 15,
      destacado: true
    },
    {
      id: 'causa-limami',
      nombre: 'Causa Umami',
      categoria: 'entradas',
      tipo: 'mar',
      descripcion: 'Torre de causa de papa amarilla y palta, relleno de jaiba fresca y crema de rocoto ahumado.',
      precio: 13,
      imagen: 'assets/img/platos/causa-limami.jpg',
      alergenos: ['lacteos', 'mariscos'],
      etiquetas: [],
      tiempo: 20,
      destacado: false
    },
    {
      id: 'gyoza-chicharron',
      nombre: 'Gyoza de Chicharrón',
      categoria: 'entradas',
      tipo: 'carne',
      descripcion: 'Gyoza rellena de chicharrón criollo, glaseada con salsa anticuchera y sésamo tostado.',
      precio: 12,
      imagen: 'assets/img/platos/gyoza-chicharron.jpg',
      alergenos: ['gluten', 'sesamo'],
      etiquetas: [],
      tiempo: 18,
      destacado: false
    },
    {
      id: 'carpaccio-palta',
      nombre: 'Carpaccio de Palta Ahumada',
      categoria: 'entradas',
      tipo: 'vegetariano',
      descripcion: 'Palta ahumada en láminas, brotes frescos, vinagreta de maracuyá y quinoa crocante.',
      precio: 11,
      imagen: 'assets/img/platos/carpaccio-palta.jpg',
      alergenos: [],
      etiquetas: ['vegano'],
      tiempo: 12,
      destacado: false
    },

    {
      id: 'lomo-umami',
      nombre: 'Lomo Saltado Umami',
      categoria: 'fuertes',
      tipo: 'carne',
      descripcion: 'Medallones de lomo wagyu sellados, papas suflé y reducción de soya negra al ají amarillo.',
      precio: 9,
      imagen: 'assets/img/platos/lomo-umami.jpg',
      alergenos: ['gluten', 'soya'],
      etiquetas: [],
      tiempo: 25,
      destacado: true
    },
    {
      id: 'pato-oliva',
      nombre: 'Pato a la Oliva',
      categoria: 'fuertes',
      tipo: 'carne',
      descripcion: 'Magret de pato en su punto, quinua crocante y reducción de oliva y café de altura.',
      precio: 30,
      imagen: 'assets/img/platos/pato-oliva.jpg',
      alergenos: [],
      etiquetas: [],
      tiempo: 30,
      destacado: false
    },
    {
      id: 'risotto-amazonico',
      nombre: 'Risotto de Hongos Amazónicos',
      categoria: 'fuertes',
      tipo: 'vegetariano',
      descripcion: 'Risotto carnaroli con hongos de sauce, aceite de sacha inchi y tuile de parmesano.',
      precio: 24,
      imagen: 'assets/img/platos/risotto-amazonico.jpg',
      alergenos: ['lacteos'],
      etiquetas: ['vegetariano'],
      tiempo: 28,
      destacado: true
    },
    {
      id: 'ramen-pato',
      nombre: 'Ramen de Pato',
      categoria: 'fuertes',
      tipo: 'carne',
      descripcion: 'Caldo dashi-pato de cocción lenta, tallarines artesanales, huevo curado y nori.',
      precio: 7,
      imagen: 'assets/img/platos/ramen-pato.jpg',
      alergenos: ['gluten', 'huevo'],
      etiquetas: [],
      tiempo: 25,
      destacado: false
    },

    {
      id: 'suspiro-limeno',
      nombre: 'Suspiro Reinterpretado',
      categoria: 'postres',
      tipo: 'dulce',
      descripcion: 'Merengue ahumado a la brasa, crema de manjar y granizado de lúcuma con gel de oporto.',
      precio: 11,
      imagen: 'assets/img/platos/suspiro-limeno.jpg',
      alergenos: ['lacteos', 'huevo'],
      etiquetas: ['vegetariano'],
      tiempo: 12,
      destacado: true
    },
    {
      id: 'volcan-cacao',
      nombre: 'Volcán de Cacao y Guanábana',
      categoria: 'postres',
      tipo: 'dulce',
      descripcion: 'Volcán de chocolate con centro fluido, helado de guanábana y coulis de berries.',
      precio: 11,
      imagen: 'assets/img/platos/volcan-cacao.jpg',
      alergenos: ['gluten', 'lacteos', 'huevo'],
      etiquetas: ['vegetariano'],
      tiempo: 15,
      destacado: false
    },
    {
      id: 'cheesecake-lucuma',
      nombre: 'Cheesecake de Lúcuma',
      categoria: 'postres',
      tipo: 'dulce',
      descripcion: 'Cheesecake cremoso de lúcuma, base crocante de galleta de almendras y frutos rojos.',
      precio: 10,
      imagen: 'assets/img/platos/cheesecake-lucuma.jpg',
      alergenos: ['gluten', 'lacteos', 'huevo'],
      etiquetas: ['vegetariano'],
      tiempo: 10,
      destacado: false
    },
    {
      id: 'helado-aguaymanto',
      nombre: 'Helado de Aguaymanto y Sacha Inchi',
      categoria: 'postres',
      tipo: 'dulce',
      descripcion: 'Helado artesanal de aguaymanto, crocante de sacha inchi y miel de caña.',
      precio: 8,
      imagen: 'assets/img/platos/helado-aguaymanto.jpg',
      alergenos: [],
      etiquetas: ['vegano'],
      tiempo: 8,
      destacado: false
    },

    {
      id: 'pisco-sour-umami',
      nombre: 'Pisco Sour Umami',
      categoria: 'bebidas',
      tipo: 'bebida',
      descripcion: 'Nuestra firma: pisco quebranta, limón criollo, clara sedosa y amargo de Angostura.',
      precio: 10,
      imagen: 'assets/img/platos/pisco-sour-umami.jpg',
      alergenos: ['huevo'],
      etiquetas: [],
      tiempo: 8,
      destacado: true
    },
    {
      id: 'chilcano-maracuya',
      nombre: 'Chilcano de Maracuyá',
      categoria: 'bebidas',
      tipo: 'bebida',
      descripcion: 'Pisco italiano, maracuyá fresco, ginger ale artesanal y lima deshidratada.',
      precio: 9,
      imagen: 'assets/img/platos/chilcano-maracuya.jpg',
      alergenos: [],
      etiquetas: [],
      tiempo: 6,
      destacado: false
    },
    {
      id: 'maridaje-casa',
      nombre: 'Maridaje de la Casa',
      categoria: 'bebidas',
      tipo: 'bebida',
      descripcion: 'Cuatro copas seleccionadas por nuestro sommelier para acompañar cada tiempo de la carta.',
      precio: 30,
      imagen: 'assets/img/platos/maridaje-casa.jpg',
      alergenos: [],
      etiquetas: [],
      tiempo: 5,
      destacado: false
    },
    {
      id: 'refresco-andino',
      nombre: 'Refresco de Hierbas Andinas',
      categoria: 'bebidas',
      tipo: 'bebida',
      descripcion: 'Infusión fría de muña, hierba luisa y menta, servida sobre hielo con limón.',
      precio: 7,
      imagen: 'assets/img/platos/refresco-andino.jpg',
      alergenos: [],
      etiquetas: ['vegano'],
      tiempo: 5,
      destacado: false
    }
  ],

  resenas: [
    {
      nombre: 'Valeria Rodríguez',
      fecha: 'Agosto 2026',
      estrellas: 5,
      plato: 'Tiradito Nikkei',
      texto: 'El tiradito es una obra de arte: la acidez del yuzu con el ajonjolí es perfecta. Atención impecable y el ambiente te transporta. Sin duda, la mejor fusión de San Salvador.'
    },
    {
      nombre: 'Diego Morales',
      fecha: 'Agosto 2026',
      estrellas: 5,
      plato: 'Lomo Saltado Umami',
      texto: 'Pagué por un lomo saltado y recibí una experiencia. El wagyu se deshace y las papas suflé son adictivas. Volveré solo por ese plato.'
    },
    {
      nombre: 'Camila Torres',
      fecha: 'Julio 2026',
      estrellas: 4,
      plato: 'Risotto de Hongos Amazónicos',
      texto: 'El risotto con sacha inchi es una mezcla sorprendente y deliciosa. El único pero: la sala se llena y el ruido sube un poco. Aún así, muy recomendable.'
    },
    {
      nombre: 'Andrés Salazar',
      fecha: 'Julio 2026',
      estrellas: 5,
      plato: 'Maridaje de la Casa',
      texto: 'El maridaje de cuatro copas es obligatorio. El sommelier explica cada selección con una pasión contagiosa. Cena de aniversario inolvidable.'
    },
    {
      nombre: 'Lucía Paredes',
      fecha: 'Junio 2026',
      estrellas: 5,
      plato: 'Suspiro Reinterpretado',
      texto: 'El suspiro ahumado me dejó sin palabras, nunca probé algo igual. Postres de nivel mundial en San Salvador. Los vuelvo a mencionar: pidan el suspiro.'
    },
    {
      nombre: 'Jorge Huamán',
      fecha: 'Junio 2026',
      estrellas: 4,
      plato: 'Ramen de Pato',
      texto: 'Un ramen con identidad salvadoreña, el caldo es profundo y reconfortante. La espera es algo larga pero la avisan con anticipación. Vale cada minuto.'
    },
    {
      nombre: 'Sofía Andrade',
      fecha: 'Mayo 2026',
      estrellas: 5,
      plato: 'Pisco Sour Umami',
      texto: 'El pisco sour de la casa tiene una textura de espuma increíble. La barra es hermosa y los bartenders son unos artistas. Ambiente diez sobre diez.'
    },
    {
      nombre: 'Renzo Villar',
      fecha: 'Mayo 2026',
      estrellas: 5,
      plato: 'Pato a la Oliva',
      texto: 'El pato con reducción de café y oliva es el plato más original que comí este año. Cocina de autor en serio. Reserven con anticipación, se llena.'
    },
    {
      nombre: 'Paula Castro',
      fecha: 'Abril 2026',
      estrellas: 4,
      plato: 'Causa Umami',
      texto: 'La causa con jaiba es fresca y elegante, porción ideal para compartir. Los precios son de restaurante de alta gama, pero la calidad los justifica.'
    },
    {
      nombre: 'Martín Quiroz',
      fecha: 'Abril 2026',
      estrellas: 5,
      plato: 'Cheesecake de Lúcuma',
      texto: 'Terminamos la cena con el cheesecake de lúcuma y fue el cierre perfecto. Servicio cálido, carta creativa y una decoración que abraza. Umami puro.'
    }
  ],

  distribucion: [
    { estrellas: 5, porcentaje: 78 },
    { estrellas: 4, porcentaje: 15 },
    { estrellas: 3, porcentaje: 5 },
    { estrellas: 2, porcentaje: 1 },
    { estrellas: 1, porcentaje: 1 }
  ],

  horarios: [
    { dia: 'Lunes', abre: null, cierra: null },
    { dia: 'Martes', abre: '13:00', cierra: '23:00' },
    { dia: 'Miércoles', abre: '13:00', cierra: '23:00' },
    { dia: 'Jueves', abre: '13:00', cierra: '23:00' },
    { dia: 'Viernes', abre: '13:00', cierra: '00:00' },
    { dia: 'Sábado', abre: '12:30', cierra: '00:00' },
    { dia: 'Domingo', abre: '12:30', cierra: '17:00' }
  ]
};
