/**
 * DULCERA · datos de contenido.
 * SHOTS replica brand/IMAGE_SHOTLIST.md (IDs, nombres de archivo y alt text).
 * LINES replica el catálogo de brand/BRAND_GUIDE.md §9. Marca ficticia: sin precios reales.
 */

/** Nombre base de archivo esperado en /assets/generated: `${file}.webp` (o -800/-1600/-2400 para srcset). */
export const SHOTS = {
  '01': { file: 'dulcera-img-01-hero-caja-capas', alt: 'Caja de dulces color crema con tres charolas en escalera, cada una con tres dulces distintos', illustrative: false },
  '02': { file: 'dulcera-img-02-degustacion-cenital', alt: 'Vista cenital de una caja abierta con nueve dulces en rejilla y la tapa roja por dentro', illustrative: false },
  '03': { file: 'dulcera-img-03-macro-mango-chile', alt: 'Macro de gomitas de mango cubiertas de chile y sal, una con mordida', illustrative: false },
  '04': { file: 'dulcera-img-04-bombon-corte', alt: 'Bombón de vainilla cortado a la mitad que muestra su base de cacao', illustrative: false },
  '05': { file: 'dulcera-img-05-caja-corporativa', alt: 'Caja corporativa café oscuro entreabierta con charolas de color en el interior', illustrative: false },
  '06': { file: 'dulcera-img-06-jamaica-contraluz', alt: 'Caramelos rojos translúcidos de jamaica a contraluz junto a flores secas', illustrative: false },
  '07': { file: 'dulcera-img-07-leche-quemada-rejilla', alt: 'Cubos de leche quemada en rejilla, uno envuelto a medias en papel encerado', illustrative: false },
  '08': { file: 'dulcera-img-08-cocada-tostada', alt: 'Bloques de cocada con la superficie dorada sobre lino crudo', illustrative: false },
  '09': { file: 'dulcera-img-09-tamarindo-sal', alt: 'Cuadros de pasta de tamarindo con escamas de sal junto a una vaina abierta', illustrative: false },
  '10': { file: 'dulcera-img-10-tableta-cajeta', alt: 'Tableta de chocolate partida que muestra una capa de cajeta en el centro', illustrative: false },
  '11': { file: 'dulcera-img-11-trio-lineas', alt: 'Tres cajas pequeñas en ámbar, rojo y café con las charolas a medio salir', illustrative: false },
  '12': { file: 'dulcera-img-12-unboxing-sello', alt: 'Manos rompiendo el sello rojo de una caja color crema', illustrative: false },
  '13': { file: 'dulcera-img-13-unboxing-tapa', alt: 'Manos levantando la tapa de una caja que es roja por dentro', illustrative: false },
  '14': { file: 'dulcera-img-14-unboxing-pieza', alt: 'Dedos tomando un bombón de una caja abierta con charolas en escalera', illustrative: false },
  '15': { file: 'dulcera-img-15-fabricacion-caramelo', alt: 'Caramelo dorado vertido sobre una mesa de mármol. Imagen ilustrativa', illustrative: true },
  '16': { file: 'dulcera-img-16-fabricacion-corte', alt: 'Cuchillo cortando una plancha de leche quemada en cubos. Imagen ilustrativa', illustrative: true },
  '17': { file: 'dulcera-img-17-fabricacion-empaque', alt: 'Manos envolviendo una pieza en papel encerado. Imagen ilustrativa', illustrative: true },
  '18': { file: 'dulcera-img-18-mesa-evento', alt: 'Mesa de dulces minimalista agrupada por colores en un evento. Imagen ilustrativa', illustrative: true },
  '19': { file: 'dulcera-img-19-recuerdo-mesa', alt: 'Cajita de recuerdo color crema sobre un plato en una mesa puesta. Imagen ilustrativa', illustrative: true },
  '20': { file: 'dulcera-img-20-corporativo-escritorio', alt: 'Caja oscura con faja crema sobre un escritorio de madera clara. Imagen ilustrativa', illustrative: true },
  '21': { file: 'dulcera-img-21-exhibidor-cafeteria', alt: 'Exhibidor rojo de dulces sobre la barra de una cafetería. Imagen ilustrativa', illustrative: true },
  '22': { file: 'dulcera-img-22-cajas-master', alt: 'Cajas de envío apiladas con franjas de color por línea. Imagen ilustrativa', illustrative: true },
  '23': { file: 'dulcera-img-23-textura-capas', alt: '', illustrative: false, decorative: true },
  '24': { file: 'dulcera-img-24-pieza-mordida', alt: 'Cubo de leche quemada con una mordida limpia en la esquina superior derecha', illustrative: false },
};

export const LINES = {
  classic: {
    name: 'DULCERA CLASSIC', short: 'Classic', color: 'var(--color-mango)', index: '01',
    claim: 'Para quien extraña.',
    intro: 'Leche, coco y caramelo, como los recuerdas pero mejor terminados.',
    shot: '07',
    products: [
      { slug: 'leche-quemada', name: 'Leche Quemada', desc: 'Caramelo suave de leche quemada, cortado en cubo y con un toque de sal.', notes: 'lácteo · tostado · salino', format: 'Pieza individual · caja de 4 · granel' },
      { slug: 'cocada-tostada', name: 'Cocada Tostada', desc: 'Bloque de coco con la cara superior dorada al fuego.', notes: 'coco · tostado · húmedo', format: 'Pieza individual · caja de 4' },
    ],
  },
  fruit: {
    name: 'DULCERA FRUIT', short: 'Fruit', color: 'var(--color-jamaica)', index: '02',
    claim: 'Para quien quiere ácido.',
    intro: 'Jamaica, mango con chile y tamarindo con sal.',
    shot: '06',
    products: [
      { slug: 'jamaica-cristal', name: 'Jamaica Cristal', desc: 'Caramelo duro translúcido de jamaica, ácido y brillante.', notes: 'floral · ácido · brillante', format: 'Bolsa de 8 · pieza individual · granel' },
      { slug: 'mango-chile', name: 'Mango Chile', desc: 'Gomita de mango con capa exterior de chile y sal.', notes: 'mango · ácido · picor suave', format: 'Bolsa de 10 · vaso de evento · granel' },
      { slug: 'tamarindo-sal', name: 'Tamarindo y Sal', desc: 'Pasta de fruta de tamarindo con sal en escamas.', notes: 'agridulce · terroso · salino', format: 'Pieza individual · caja de 4' },
    ],
  },
  cacao: {
    name: 'DULCERA CACAO', short: 'Cacao', color: 'var(--color-cacao)', index: '03',
    claim: 'Para quien quiere más.',
    intro: 'Cacao en capas, del bombón a la tableta.',
    shot: '10',
    products: [
      { slug: 'bombon-cacao-vainilla', name: 'Bombón Cacao-Vainilla', desc: 'Bombón de vainilla, esponjoso, con base bañada en cacao.', notes: 'vainilla · cacao · esponjoso', format: 'Caja de 4 · dentro de la Degustación' },
      { slug: 'tableta-capa-cajeta', name: 'Tableta Capa de Cajeta', desc: 'Tableta de chocolate con una capa interior de cajeta.', notes: 'cacao · cajeta · sal', format: 'Tableta en sobre · display de mostrador' },
    ],
  },
  eventos: {
    name: 'DULCERA EVENTOS', short: 'Eventos', color: 'var(--color-pitaya)', index: '04',
    claim: 'Para la mesa que todos fotografían.',
    intro: 'Mesas de dulces por paleta de color y recuerdos con tu nombre.',
    shot: '18',
    products: [
      { slug: 'mesa-dulcera', name: 'Mesa DULCERA', desc: 'Selección de piezas curada según la paleta y el número de invitados.', notes: 'Classic · Fruit · Cacao', format: 'Por pieza · se cotiza por evento' },
      { slug: 'recuerdo-dulcera', name: 'Recuerdo DULCERA', desc: 'Cajita individual de 2 piezas con sticker personalizable.', notes: 'nombres · fecha · logotipo', format: 'Cajita deslizable' },
    ],
  },
  corporativo: {
    name: 'DULCERA CORPORATIVO', short: 'Corporativo', color: 'var(--color-piloncillo)', index: '05',
    claim: 'Para quien hace que las cosas pasen.',
    intro: 'Sobria por fuera, con color por dentro. Tu marca junto a la nuestra.',
    shot: '05',
    products: [
      { slug: 'caja-corporativa-capas', name: 'Caja Corporativa Capas', desc: 'Caja Piloncillo con faja DULCERA × tu marca, tarjeta personalizada y 9 o 16 piezas.', notes: 'co-branding · tarjeta · selección', format: '9 o 16 piezas' },
      { slug: 'caja-capas-degustacion', name: 'Caja Capas · Degustación', desc: 'Nueve piezas en tres capas: Classic, Fruit y Cacao, con mapa de sabores.', notes: 'lácteo → ácido → cacao', format: 'Caja rígida con 3 charolas' },
      { slug: 'caja-arma-tu-capa', name: 'Caja Arma tu Capa', desc: 'Caja personalizable de 4, 9 o 16 piezas con sticker de nombre.', notes: 'a tu elección', format: '4 · 9 · 16 piezas' },
    ],
  },
};

/** Frases de arranque para el campo Mensaje (chips del formulario). */
export const INTENTS = {
  evento: 'Tenemos un evento el [fecha] para [número] invitados y nos interesa una mesa de dulces en nuestra paleta de color.',
  corporativo: 'Necesitamos [número] cajas para regalos de empresa en [mes] y queremos personalizar el empaque con nuestra marca.',
  mayoreo: 'Me interesa vender o distribuir DULCERA en [ciudad / tipo de negocio]. Quisiera conocer formatos y condiciones de mayoreo.',
  regalo: 'Quiero armar una caja de regalo de [4 / 9 / 16] piezas con un mensaje personalizado.',
};
