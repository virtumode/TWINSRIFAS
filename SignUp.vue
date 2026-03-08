<script setup lang="ts">
import { AuthController } from "@/core/controllers/auth.controller";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);

/* Validaciones */
const emailTouched = ref(false);

const emailErrors = computed(() => {
  if (!emailTouched.value) return [];

  const errors: string[] = [];

  if (!email.value) {
    errors.push("El correo es obligatorio.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.push("Formato de correo inválido.");
  }

  return errors;
});

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value;
});

const onSignUp = async () => {
  emailTouched.value = true;

  if (emailErrors.value.length || !passwordsMatch.value) {
    return;
  }

  loading.value = true;

  try {
    await AuthController.signUp(
      email.value.trim().toLowerCase(),
      password.value,
      name.value.trim()
    );
    router.push("/");
  } catch (error) {
    console.error("Error al registrarse", error);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div id="container">
    <section class="content-form">
      <h3>Crear cuenta</h3>
      <p>Regístrate para participar en nuestras rifas</p>

      <form @submit.prevent="onSignUp">
        <div class="input-group">
          <label>Nombre Completo</label>
          <input type="text" v-model="name" placeholder="Tu Nombre" required />
        </div>

        <div class="input-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            v-model="email"
            placeholder="correo@ejemplo.com"
            @blur="emailTouched = true"
            required
          />

          <div v-if="emailErrors.length" class="error-message">
            <small v-for="(err, i) in emailErrors" :key="i">
              {{ err }}
            </small>
          </div>
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <input type="password" v-model="password" placeholder="***********" required />
        </div>

        <div class="input-group">
          <label>Confirmar Contraseña</label>
          <input type="password" v-model="confirmPassword" placeholder="***********" required />

          <div v-if="confirmPassword && !passwordsMatch" class="error-message">
            <small>Las contraseñas no coinciden.</small>
          </div>
        </div>

        <div class="buttons">
          <button type="submit" :disabled="loading">
            {{ loading ? "Procesando..." : "Registrarse" }}
          </button>
        </div>
      </form>

      <div class="divider">
        <span>¿Ya tienes cuenta?</span>
      </div>

      <RouterLink to="/signin" class="button-register"> Iniciar Sesión </RouterLink>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
