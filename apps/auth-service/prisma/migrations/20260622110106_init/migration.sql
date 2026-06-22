-- CreateTable
CREATE TABLE "User_profile" (
    "id" TEXT NOT NULL,
    "keycloak_id" TEXT NOT NULL,
    "favorite_team_id" TEXT,
    "shipping_street" TEXT,
    "shipping_apt" TEXT,
    "shipping_city" TEXT,
    "shipping_state" TEXT,
    "shipping_zip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_profile_keycloak_id_key" ON "User_profile"("keycloak_id");
