<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/core/stores/auth.store";
import { AuthController } from "@/core/controllers/auth.controller";

const router = useRouter();
const auth = useAuthStore();

/* =========================
   Estado de autenticación
========================= */
const isLoaded = computed(() => auth.loaded);
const isAuthenticated = computed(() => !!auth.user);

/* =========================
   Rol del usuario
========================= */
const role = computed<"guest" | "user" | "admin">((): "guest" | "user" | "admin" => {
  if (!isLoaded.value || !isAuthenticated.value) return "guest";
  return auth.role ?? "guest";
});

/* =========================
   Nombre del usuario
========================= */
const userName = computed(() => {
  if (!auth.user) return "";
  return auth.user.user_metadata?.name || auth.user.email || "Usuario";
});

/* =========================
   Menú móvil
========================= */
const mobileOpen = ref(false);

const toggleMobileMenu = () => {
  mobileOpen.value = !mobileOpen.value;
};

const closeMobileMenu = () => {
  mobileOpen.value = false;
};

/* =========================
   Logout
========================= */
const logout = async () => {
  try {
    await AuthController.signOut();
  } catch (error) {
    console.error("Error al cerrar sesión", error);
  } finally {
    auth.clear();
    closeMobileMenu();
    router.push("/");
  }
};
</script>

<template>
  <header id="header">
    <!-- Logo -->
    <div class="header-logo">
      <RouterLink to="/" @click="closeMobileMenu">
        <img src="../assets/logo.png" alt="Logo" />
      </RouterLink>
    </div>

    <!-- Hamburger -->
    <button class="hamburger" @click="toggleMobileMenu">☰</button>

    <!-- Menu Desktop -->
    <nav class="header-menu" v-if="isLoaded">
      <!-- Guest -->
      <template v-if="role === 'guest'">
        <RouterLink to="/signin" class="btn btn-link"> Iniciar sesión </RouterLink>
        <RouterLink to="/signup" class="btn btn-primary"> Registrarse </RouterLink>
      </template>

      <!-- User -->
      <template v-else-if="role === 'user'">
        <div class="usermenu">
          <RouterLink to="/user/numeros" class="btn"> Mis números </RouterLink>
          <RouterLink to="/user/referidos" class="btn"> Referidos </RouterLink>
        </div>
        <span class="user-name"> Hola, {{ userName }} </span>
        <button class="btn btn-primary" @click="logout">Cerrar sesión</button>
      </template>

      <!-- Admin -->
      <template v-else-if="role === 'admin'">
        <div class="usermenu">
          <RouterLink to="/admin/panel" class="btn"> Panel </RouterLink>
          <RouterLink to="/admin/" class="btn"> Crear Rifas </RouterLink>
          <RouterLink to="/admin/" class="btn"> Campañas </RouterLink>
          <RouterLink to="/admin/" class="btn"> Cupones </RouterLink>
        </div>
        <span class="user-name"> Hola, {{ userName }} </span>
        <button class="btn btn-primary" @click="logout">Cerrar sesión</button>
      </template>
    </nav>

    <!-- Menu Mobile -->
    <nav class="mobile-menu" v-if="mobileOpen && isLoaded">
      <template v-if="role === 'guest'">
        <RouterLink to="/signin" @click="closeMobileMenu"> Iniciar sesión </RouterLink>
        <RouterLink to="/signup" @click="closeMobileMenu"> Registrarse </RouterLink>
      </template>

      <template v-else-if="role === 'user'">
        <RouterLink to="/user/numeros" @click="closeMobileMenu"> Mis números </RouterLink>
        <RouterLink to="/user/referidos" @click="closeMobileMenu"> Referidos </RouterLink>
        <button @click="logout">Cerrar sesión</button>
      </template>

      <template v-else-if="role === 'admin'">
        <RouterLink to="/admin/panel" @click="closeMobileMenu"> Panel </RouterLink>
        <RouterLink to="/admin/" @click="closeMobileMenu"> Crear Rifas </RouterLink>
        <RouterLink to="/admin/" @click="closeMobileMenu"> Campañas </RouterLink>
        <RouterLink to="/admin/" @click="closeMobileMenu"> Cupones </RouterLink>
        <button @click="logout">Cerrar sesión</button>
      </template>
    </nav>
  </header>
</template>

<style lang="scss">
#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  padding: 0 2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  background-color: #0e0e11;
}

.header-logo img {
  width: 120px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
}

.header-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.usermenu {
  display: flex;
  gap: 1rem;
}

.user-name {
  color: #fff;
  font-weight: 600;
  margin-right: 1rem;
}

/* Botones */
.btn {
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  transition: background 0.2s;

  &.btn-link {
    background: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &.btn-primary {
    background-color: #e63946;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #d62828;
    }
  }
}

/* Hamburger */
.hamburger {
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
}

/* Mobile menu */
.mobile-menu {
  display: none;
}

@media (max-width: 768px) {
  .header-menu {
    display: none;
  }

  .hamburger {
    display: block;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    background-color: #0e0e11;
    padding: 1rem;
    gap: 1rem;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);

    a,
    button {
      color: #fff;
      background: none;
      border: none;
      text-align: left;
      font-size: 1rem;
      cursor: pointer;
    }
  }
}
</style>
