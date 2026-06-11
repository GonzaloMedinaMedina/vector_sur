CREATE TABLE `ClasificacionEntry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jugadorId` integer NOT NULL,
	`torneoId` integer NOT NULL,
	`posicion` integer NOT NULL,
	`puntos` integer NOT NULL,
	`createdAt` DATETIME NOT NULL,
	FOREIGN KEY (`jugadorId`) REFERENCES `Jugador`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`torneoId`) REFERENCES `Torneo`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Jugador` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`sede` text,
	`createdAt` DATETIME NOT NULL,
	`updatedAt` DATETIME NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Noticia` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`titulo` text NOT NULL,
	`fecha` DATETIME NOT NULL,
	`sede` text,
	`resumen` text NOT NULL,
	`contenido` text NOT NULL,
	`imagen` text,
	`createdAt` DATETIME NOT NULL,
	`updatedAt` DATETIME NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Noticia_slug_unique` ON `Noticia` (`slug`);--> statement-breakpoint
CREATE TABLE `Torneo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`sede` text NOT NULL,
	`anio` integer NOT NULL,
	`fecha` DATETIME NOT NULL,
	`puntosPorPosicion` text DEFAULT '{"1":10,"2":8,"3":6,"4":5,"5":4,"6":3,"7":2,"default":1}' NOT NULL,
	`createdAt` DATETIME NOT NULL,
	`updatedAt` DATETIME NOT NULL
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`createdAt` DATETIME NOT NULL,
	`updatedAt` DATETIME NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);--> statement-breakpoint
CREATE TABLE `Video` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`descripcion` text,
	`youtubeId` text NOT NULL,
	`fecha` DATETIME NOT NULL,
	`sede` text,
	`createdAt` DATETIME NOT NULL,
	`updatedAt` DATETIME NOT NULL
);
