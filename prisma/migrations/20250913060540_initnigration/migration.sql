-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('FARMER', 'EXPERT', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."PoultryType" AS ENUM ('CHICKEN', 'DUCK', 'GOOSE', 'TURKEY', 'QUAIL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."HealthStatus" AS ENUM ('HEALTHY', 'SICK', 'RECOVERING', 'QUARANTINE', 'DECEASED');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."CareType" AS ENUM ('FEEDING', 'MEDICATION', 'VACCINATION', 'HEALTH_CHECK', 'CLEANING', 'TEMPERATURE_CHECK', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."VaccinationStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'MISSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ChatType" AS ENUM ('AI_ASSISTANT', 'EXPERT_CONSULTATION');

-- CreateEnum
CREATE TYPE "public"."MessageRole" AS ENUM ('USER', 'ASSISTANT', 'EXPERT');

-- CreateEnum
CREATE TYPE "public"."ConsultationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ExpertSpecialization" AS ENUM ('VETERINARY', 'NUTRITION', 'BREEDING', 'DISEASE_PREVENTION', 'GENERAL');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('CARE_REMINDER', 'VACCINATION_DUE', 'HEALTH_ALERT', 'WEATHER_WARNING', 'DISEASE_ALERT', 'EXPERT_RESPONSE', 'SYSTEM_UPDATE');

-- CreateEnum
CREATE TYPE "public"."NotificationStatus" AS ENUM ('UNREAD', 'READ', 'DISMISSED');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('HEALTH_SUMMARY', 'COST_ANALYSIS', 'GROWTH_TRACKING', 'MORTALITY_REPORT', 'VACCINATION_REPORT', 'CUSTOM');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'FARMER',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."farms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "description" TEXT,
    "image" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."breeds" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."PoultryType" NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "averageWeight" DOUBLE PRECISION,
    "maturityAge" INTEGER,
    "eggProduction" INTEGER,
    "diseaseResistance" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "breeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pens" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "temperature" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "image" TEXT,
    "farmId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."poultry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tagNumber" TEXT,
    "type" "public"."PoultryType" NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "healthStatus" "public"."HealthStatus" NOT NULL DEFAULT 'HEALTHY',
    "image" TEXT,
    "notes" TEXT,
    "userId" INTEGER NOT NULL,
    "penId" INTEGER,
    "breedId" INTEGER,
    "birthDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "poultry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."poultry_photos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "poultryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "poultry_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."care_records" (
    "id" SERIAL NOT NULL,
    "type" "public"."CareType" NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "cost" DOUBLE PRECISION,
    "image" TEXT,
    "poultryId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "careDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "care_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vaccination_schedules" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "age" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "breedId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vaccination_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vaccinations" (
    "id" SERIAL NOT NULL,
    "status" "public"."VaccinationStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "cost" DOUBLE PRECISION,
    "poultryId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vaccinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_history" (
    "id" SERIAL NOT NULL,
    "type" "public"."ChatType" NOT NULL DEFAULT 'AI_ASSISTANT',
    "message" TEXT NOT NULL,
    "role" "public"."MessageRole" NOT NULL,
    "image" TEXT,
    "userId" INTEGER NOT NULL,
    "expertId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."diseases" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."PoultryType" NOT NULL,
    "description" TEXT NOT NULL,
    "symptoms" TEXT[],
    "causes" TEXT[],
    "prevention" TEXT[],
    "treatment" TEXT[],
    "severity" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."knowledge_base" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" "public"."PoultryType",
    "tags" TEXT[],
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."experts" (
    "id" SERIAL NOT NULL,
    "specialization" "public"."ExpertSpecialization" NOT NULL,
    "experience" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "bio" TEXT,
    "certifications" TEXT[],
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."consultations" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "status" "public"."ConsultationStatus" NOT NULL DEFAULT 'PENDING',
    "response" TEXT,
    "rating" INTEGER,
    "farmerId" INTEGER NOT NULL,
    "expertId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."weather_data" (
    "id" SERIAL NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "pressure" DOUBLE PRECISION NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "farmId" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weather_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."disease_alerts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "source" TEXT,
    "diseaseId" INTEGER,
    "alertDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "disease_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "status" "public"."NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "data" JSONB,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "public"."ReportType" NOT NULL,
    "content" JSONB NOT NULL,
    "filters" JSONB,
    "period" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."statistics" (
    "id" SERIAL NOT NULL,
    "totalPoultry" INTEGER NOT NULL DEFAULT 0,
    "healthyCount" INTEGER NOT NULL DEFAULT 0,
    "sickCount" INTEGER NOT NULL DEFAULT 0,
    "deceasedCount" INTEGER NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "monthlyCost" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "userId" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "farms_userId_key" ON "public"."farms"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "breeds_name_key" ON "public"."breeds"("name");

-- CreateIndex
CREATE UNIQUE INDEX "poultry_tagNumber_key" ON "public"."poultry"("tagNumber");

-- CreateIndex
CREATE UNIQUE INDEX "diseases_name_key" ON "public"."diseases"("name");

-- CreateIndex
CREATE UNIQUE INDEX "experts_userId_key" ON "public"."experts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_userId_key" ON "public"."statistics"("userId");

-- AddForeignKey
ALTER TABLE "public"."farms" ADD CONSTRAINT "farms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pens" ADD CONSTRAINT "pens_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "public"."farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."poultry" ADD CONSTRAINT "poultry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."poultry" ADD CONSTRAINT "poultry_penId_fkey" FOREIGN KEY ("penId") REFERENCES "public"."pens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."poultry" ADD CONSTRAINT "poultry_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "public"."breeds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."poultry_photos" ADD CONSTRAINT "poultry_photos_poultryId_fkey" FOREIGN KEY ("poultryId") REFERENCES "public"."poultry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."care_records" ADD CONSTRAINT "care_records_poultryId_fkey" FOREIGN KEY ("poultryId") REFERENCES "public"."poultry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."care_records" ADD CONSTRAINT "care_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vaccination_schedules" ADD CONSTRAINT "vaccination_schedules_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "public"."breeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vaccinations" ADD CONSTRAINT "vaccinations_poultryId_fkey" FOREIGN KEY ("poultryId") REFERENCES "public"."poultry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vaccinations" ADD CONSTRAINT "vaccinations_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."vaccination_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_history" ADD CONSTRAINT "chat_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_history" ADD CONSTRAINT "chat_history_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."experts" ADD CONSTRAINT "experts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."consultations" ADD CONSTRAINT "consultations_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."consultations" ADD CONSTRAINT "consultations_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."weather_data" ADD CONSTRAINT "weather_data_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "public"."farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."disease_alerts" ADD CONSTRAINT "disease_alerts_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "public"."diseases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."statistics" ADD CONSTRAINT "statistics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
