import { int, text, sqliteTable, customType } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

const isoDate = customType<{ data: Date; driverData: string }>({
  dataType() { return 'DATETIME' },
  fromDriver(value: string) { return new Date(value) },
  toDriver(value: Date) { return value.toISOString() },
})

export const users = sqliteTable('User', {
  id: int('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: isoDate('createdAt').notNull().$defaultFn(() => new Date()),
  updatedAt: isoDate('updatedAt').notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
})

export const noticias = sqliteTable('Noticia', {
  id: int('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  titulo: text('titulo').notNull(),
  fecha: isoDate('fecha').notNull(),
  sede: text('sede'),
  resumen: text('resumen').notNull(),
  contenido: text('contenido').notNull(),
  imagen: text('imagen'),
  createdAt: isoDate('createdAt').notNull().$defaultFn(() => new Date()),
  updatedAt: isoDate('updatedAt').notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
})

export const videos = sqliteTable('Video', {
  id: int('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  descripcion: text('descripcion'),
  youtubeId: text('youtubeId').notNull(),
  fecha: isoDate('fecha').notNull(),
  sede: text('sede'),
  createdAt: isoDate('createdAt').notNull().$defaultFn(() => new Date()),
  updatedAt: isoDate('updatedAt').notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
})

export const jugadores = sqliteTable('Jugador', {
  id: int('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  sede: text('sede'),
  createdAt: isoDate('createdAt').notNull().$defaultFn(() => new Date()),
  updatedAt: isoDate('updatedAt').notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
})

export const torneos = sqliteTable('Torneo', {
  id: int('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  sede: text('sede').notNull(),
  anio: int('anio').notNull(),
  fecha: isoDate('fecha').notNull(),
  puntosPorPosicion: text('puntosPorPosicion').notNull().default('{"1":10,"2":8,"3":6,"4":5,"5":4,"6":3,"7":2,"default":1}'),
  createdAt: isoDate('createdAt').notNull().$defaultFn(() => new Date()),
  updatedAt: isoDate('updatedAt').notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
})

export const clasificacionEntries = sqliteTable('ClasificacionEntry', {
  id: int('id').primaryKey({ autoIncrement: true }),
  jugadorId: int('jugadorId').notNull().references(() => jugadores.id, { onDelete: 'cascade' }),
  torneoId: int('torneoId').notNull().references(() => torneos.id, { onDelete: 'cascade' }),
  posicion: int('posicion').notNull(),
  puntos: int('puntos').notNull(),
  createdAt: isoDate('createdAt').notNull().$defaultFn(() => new Date()),
})

export const torneosRelations = relations(torneos, ({ many }) => ({
  clasificaciones: many(clasificacionEntries),
}))

export const jugadoresRelations = relations(jugadores, ({ many }) => ({
  clasificaciones: many(clasificacionEntries),
}))

export const clasificacionEntriesRelations = relations(clasificacionEntries, ({ one }) => ({
  torneo: one(torneos, { fields: [clasificacionEntries.torneoId], references: [torneos.id] }),
  jugador: one(jugadores, { fields: [clasificacionEntries.jugadorId], references: [jugadores.id] }),
}))
