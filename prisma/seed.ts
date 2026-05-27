import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'
import { hash } from 'bcryptjs'

const adapter = new PrismaLibSql({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  // Usuario admin
  const adminPassword = await hash('admin1234', 12)
  await prisma.user.upsert({
    where: { email: 'admin@vectorsur.com' },
    update: {},
    create: {
      email: 'admin@vectorsur.com',
      password: adminPassword,
      name: 'Admin',
      role: 'admin',
    },
  })
  console.log('✓ Usuario admin creado: admin@vectorsur.com / admin1234')

  // Noticias desde JSON
  const noticias = [
    {
      slug: 'primer-torneo-vector-sur-sevilla-2025',
      titulo: 'Primer Torneo Vector Sur — Sevilla 2025',
      fecha: new Date('2025-03-15'),
      sede: 'Sevilla',
      imagen: '/noticias/torneo-sevilla-2025.jpg',
      resumen: 'Gran éxito en el primer torneo oficial de la comunidad Vector Sur. 16 jugadores se dieron cita en Sevilla para disputar una jornada épica de Infinity.',
      contenido: 'El pasado 15 de marzo celebramos el primer torneo oficial de Vector Sur en Sevilla. 16 jugadores de todas nuestras sedes se reunieron para disputar 3 rondas de Infinity N5 en un ambiente fantástico.\n\nEl evento contó con mesas de escenografía propia y los resultados fueron los siguientes:\n\n🥇 1.º puesto: Nombre del jugador (Facción)\n🥈 2.º puesto: Nombre del jugador (Facción)\n🥉 3.º puesto: Nombre del jugador (Facción)\n\nEl próximo torneo será en Málaga. ¡Estad atentos a las noticias!',
    },
    {
      slug: 'liga-de-invierno-2025',
      titulo: 'Liga de Invierno 2025 — ¡Inscripciones abiertas!',
      fecha: new Date('2025-02-01'),
      sede: 'Todas las sedes',
      imagen: '',
      resumen: 'Abrimos inscripciones para la Liga de Invierno 2025. Compite desde tu sede local y clasifícate para la gran final presencial en primavera.',
      contenido: 'Ya está en marcha la Liga de Invierno 2025 de Vector Sur. Este año el formato será de liga descentralizada: cada sede organizará sus propias rondas y los mejores jugadores se clasificarán para la gran final presencial.\n\nFechas clave:\n- Fase de grupos: Febrero — Marzo 2025\n- Final presencial: Abril 2025\n\nPara inscribirse, contacta con el responsable de tu sede o escríbenos a través del formulario de contacto.',
    },
  ]

  for (const n of noticias) {
    await prisma.noticia.upsert({
      where: { slug: n.slug },
      update: {},
      create: n,
    })
  }
  console.log('✓ Noticias importadas')

  // Videos
  const videos = [
    {
      titulo: 'Partida comentada — Ariadna vs PanOceanía',
      youtubeId: 'dQw4w9WgXcQ',
      fecha: new Date('2025-03-10'),
      descripcion: 'Partida de demostración entre dos de las facciones más populares. Comentada por los organizadores de Vector Sur.',
    },
    {
      titulo: 'Tutorial N5 — Primeros pasos en Infinity',
      youtubeId: 'dQw4w9WgXcQ',
      fecha: new Date('2025-02-20'),
      descripcion: 'Guía introductoria para nuevos jugadores. Aprende las mecánicas básicas de la 5ª edición de Infinity en menos de 30 minutos.',
    },
    {
      titulo: 'Resumen Torneo Sevilla 2025',
      youtubeId: 'dQw4w9WgXcQ',
      fecha: new Date('2025-03-16'),
      descripcion: 'Resumen de las mejores jugadas del primer torneo oficial de Vector Sur celebrado en Sevilla.',
    },
  ]

  for (const v of videos) {
    const exists = await prisma.video.findFirst({ where: { youtubeId: v.youtubeId, titulo: v.titulo } })
    if (!exists) {
      await prisma.video.create({ data: v })
    }
  }
  console.log('✓ Videos importados')

  // Torneos 2025
  const puntos = JSON.stringify({ "1": 10, "2": 8, "3": 6, "4": 5, "5": 4, "6": 3, "7": 2, "default": 1 })
  const torneos2025 = [
    { nombre: 'Torneo Málaga 2025', sede: 'Málaga', anio: 2025, fecha: new Date('2025-04-12'), puntosPorPosicion: puntos },
    { nombre: 'Torneo La Línea 2025', sede: 'La Línea', anio: 2025, fecha: new Date('2025-06-07'), puntosPorPosicion: puntos },
    { nombre: 'Torneo Sevilla 2025', sede: 'Sevilla', anio: 2025, fecha: new Date('2025-03-15'), puntosPorPosicion: puntos },
  ]

  for (const t of torneos2025) {
    const exists = await prisma.torneo.findFirst({ where: { nombre: t.nombre } })
    if (!exists) {
      await prisma.torneo.create({ data: t })
    }
  }
  console.log('✓ Torneos 2025 creados (Málaga, La Línea, Sevilla)')

  console.log('\n🎮 Seed completado. Accede al admin en /admin\n   Email: admin@vectorsur.com\n   Contraseña: admin1234')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
