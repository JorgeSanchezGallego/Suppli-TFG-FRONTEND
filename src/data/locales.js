import gomiz1 from '../assets/img/gomiz1.jpg'
import gomiz2 from '../assets/img/gomiz2.jpg'
import gomiz3 from '../assets/img/gomiz3.jpg'
import gomizLogo from '../assets/img/gomizlogo.png'
import noray1 from '../assets/img/noray1.jpg'
import noray2 from '../assets/img/noray2.jpg'
import noray3 from '../assets/img/noray3.jpg'
import norayLogo from '../assets/img/noraylogo.png'
import parc1 from '../assets/img/parc1.jpg'
import parc2 from '../assets/img/parc2.jpg'
import parc3 from '../assets/img/parc3.jpg'
import parcLogo from '../assets/img/parclogo.png'

const locales = [
  {
    id: 'gomiz',
    nombre: 'Kiosko Gómiz',
    direccion: 'Paseo de Gómiz, 03002 Alicante',
    web: 'https://gomizalicante.es/',
    mapa: 'https://www.google.com/maps/place/G%C3%B3miz+Alicante/@38.3462504,-0.4767816,17z/data=!3m1!4b1!4m6!3m5!1s0xd6237ba9ac03a9d:0x63b6384cac87a65c!8m2!3d38.3462504!4d-0.4767816!16s%2Fg%2F11by__1ynl',
    logo: gomizLogo,
    fotos: [gomiz1, gomiz2, gomiz3],
    texto: [
      'Entre el paseo, la playa y el ritmo de Alicante, hay un punto donde todo fluye. Gómiz es ese lugar abierto al mar, donde la ciudad se mezcla con la brisa y el movimiento nunca se detiene. Vienes paseando, paras un momento… y sin darte cuenta, te quedas.',
      'No hacemos sitios genéricos. Cada espacio responde a su ubicación y a lo que tiene alrededor.',
      'Aquí todo es más sencillo: luz, gente, mar y esa sensación de estar justo donde toca.',
    ],
  },
  {
    id: 'noray',
    nombre: 'Noray',
    direccion: 'Conde de Vallecano, 03001 Alicante',
    web: 'https://norayalicante.es/',
    mapa: 'https://www.google.com/maps/place/Noray+Puerto+de+Alicante+%2F+Caf%C3%A9+Bar/@38.3417718,-0.4851128,16z/data=!3m1!4b1!4m6!3m5!1s0xd6236354de90dbf:0xae02f98446791933!8m2!3d38.3417718!4d-0.4851128!16s%2Fg%2F11b7swd06y',
    logo: norayLogo,
    fotos: [noray1, noray2, noray3],
    texto: [
      'Una terraza sobre el Mediterráneo, abierta al puerto de Alicante, pensada para disfrutar con calma.',
      'Para venir en pareja, con amigos o en familia y dejar que el entorno marque el momento: la luz, el mar, la brisa y la sensación de estar exactamente donde apetece estar.',
    ],
  },
  {
    id: 'parc',
    nombre: 'Soho Parc',
    direccion: 'Portal de Elche, 03001 Alicante',
    web: 'https://sohoparcalicante.es/',
    mapa: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0xd6237b3d4374367:0xf11aa658d4c7f7',
    logo: parcLogo,
    fotos: [parc1, parc2, parc3],
    texto: [
      'En medio del ruido, del asfalto y del ritmo de la ciudad, hay un lugar donde todo se calma.',
      'Soho Parc es ese pequeño paréntesis en pleno centro de Alicante: un espacio rodeado de vegetación, bajo la sombra de los ficus del Portal de Elche, donde vienes a parar un momento… y acabas quedándote.',
    ],
  },
]

const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

export function buscarLocal(nombre) {
  if (!nombre) return null
  const buscado = normalizar(nombre)
  return locales.find((local) => normalizar(local.nombre) === buscado) ?? null
}

export default locales
