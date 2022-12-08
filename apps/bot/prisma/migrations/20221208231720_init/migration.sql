-- CreateEnum
CREATE TYPE "UserFlags" AS ENUM ('CONTRIBUTOR');

-- CreateTable
CREATE TABLE "ShardStats" (
    "id" INTEGER NOT NULL,
    "users" INTEGER NOT NULL,
    "guilds" INTEGER NOT NULL,
    "wsPing" INTEGER NOT NULL,
    "unavailableGuilds" INTEGER NOT NULL,

    CONSTRAINT "ShardStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandStats" (
    "name" TEXT NOT NULL,
    "category" TEXT,
    "uses" INTEGER NOT NULL,

    CONSTRAINT "CommandStats_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "EvieUser" (
    "id" TEXT NOT NULL,
    "flags" "UserFlags"[],
    "username" TEXT,
    "fetchedAt" TIMESTAMP(3),
    "avatar" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "guilds" JSONB[],

    CONSTRAINT "EvieUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EviePlus" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "activeGuildId" TEXT NOT NULL,
    "activeUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EviePlus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildSettings" (
    "id" TEXT NOT NULL,
    "modules" JSONB[],
    "importedMessages" TEXT[],
    "logChannel" TEXT,
    "color" TEXT NOT NULL DEFAULT '#f47fff',
    "moderatorRole" TEXT,

    CONSTRAINT "GuildSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationSettings" (
    "guildId" TEXT NOT NULL,
    "logChannel" TEXT,
    "blockedWords" TEXT[],
    "phishingDetection" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ModerationSettings_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "AirportSettings" (
    "guildId" TEXT NOT NULL,
    "channel" TEXT,
    "arrives" BOOLEAN NOT NULL DEFAULT false,
    "arriveMessage" TEXT NOT NULL DEFAULT 'Welcome to our server!',
    "departs" BOOLEAN NOT NULL DEFAULT false,
    "departMessage" TEXT NOT NULL DEFAULT 'Goodbye!',
    "joinRole" TEXT NOT NULL DEFAULT '',
    "giveJoinRole" BOOLEAN NOT NULL DEFAULT false,
    "ping" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AirportSettings_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "EvieTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embed" BOOLEAN NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT,
    "link" TEXT,
    "guildId" TEXT
);

-- CreateTable
CREATE TABLE "ModAction" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "typeId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "targetID" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "moderatorID" TEXT,
    "logMessageID" TEXT,
    "moderatorName" TEXT,
    "targetName" TEXT NOT NULL DEFAULT 'Unknown',

    CONSTRAINT "ModAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickupRole" (
    "roleID" TEXT NOT NULL,
    "guildID" TEXT NOT NULL,

    CONSTRAINT "PickupRole_pkey" PRIMARY KEY ("roleID")
);

-- CreateTable
CREATE TABLE "AstralPlayer" (
    "id" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AstralPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AstralConfig" (
    "guildId" TEXT NOT NULL,
    "rules" JSONB NOT NULL DEFAULT '{ "title": "rules", "type": "rich","color": 5793266, "description": "No rules set yet!" }',
    "roles" JSONB,
    "roleDividerId" TEXT,
    "feedbackChannel" TEXT,

    CONSTRAINT "AstralConfig_pkey" PRIMARY KEY ("guildId")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvieTag_id_key" ON "EvieTag"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EvieTag_slug_key" ON "EvieTag"("slug");

-- AddForeignKey
ALTER TABLE "EviePlus" ADD CONSTRAINT "EviePlus_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "EvieUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EviePlus" ADD CONSTRAINT "EviePlus_activeGuildId_fkey" FOREIGN KEY ("activeGuildId") REFERENCES "GuildSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationSettings" ADD CONSTRAINT "ModerationSettings_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "GuildSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirportSettings" ADD CONSTRAINT "AirportSettings_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "GuildSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvieTag" ADD CONSTRAINT "EvieTag_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "GuildSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
