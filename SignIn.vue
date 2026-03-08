<script setup lang="ts">
import { AuthController } from "@/core/controllers/auth.controller";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const remember = ref(false);
const loading = ref(false);

const onSignIn = async () => {
  loading.value = true;

  try {
    await AuthController.signIn(email.value.trim().toLowerCase(), password.value);

    router.push("/");
  } catch (error) {
    console.error("Error al iniciar sesión", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div id="container">
    <section class="content-form">
      <h3>Iniciar sesión</h3>
      <p>Ingresa tus credenciales para acceder a tu cuenta</p>

      <form @submit.prevent="onSignIn">
        <div class="input-group">
          <label>Correo Electrónico</label>
          <input type="email" v-model="email" placeholder="correo@ejemplo.com" required />
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <input type="password" v-model="password" placeholder="***********" required />
        </div>

        <div class="inputs">
          <div class="input-remenber">
            <input type="checkbox" id="remember" v-model="remember" />
            <label for="remember">Recordarme</label>
          </div>

          <div class="olds">
            <RouterLink to=""> ¿Olvidaste tu Contraseña? </RouterLink>
          </div>
        </div>

        <div class="buttons">
          <button type="submit" :disabled="loading">
            {{ loading ? "Procesando..." : "Continuar" }}
          </button>
        </div>
      </form>

      <div class="divider">
        <span>¿No tienes una cuenta?</span>
      </div>

      <RouterLink to="/signup" class="button-register"> Registrarse </RouterLink>
    </section>
  </div>
</template>

<style lang="scss">
#container {
  min-height: 100dvh;
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)),
    url("https://wallpapers.com/images/hd/1920-x-1080-car-c2xel6pwka121er6.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  .content-form {
    border-radius: 15px;
    padding: 20px 10px;
    width: 100%;
    max-width: 400px;
    background-color: rgb(31, 31, 31);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    text-align: center;
    h3 {
      color: #fff;
      font-size: 2rem;
      margin-bottom: 3px;
    }
    p {
      font-size: 0.85rem;
      color: rgb(114, 123, 139);
      margin-bottom: 10px;
    }
    form {
      .input-group {
        padding: 8px 15px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        label {
          text-align: left;
          color: #fff;
          font-size: 0.85rem;
        }
        input {
          border-radius: 10px;
          border: 1px solid rgb(70, 70, 80);
          height: 45px;
          padding: 0 15px;
          background-color: rgb(14, 14, 17);
          color: #ccc;
          transition: border-color 0.3s ease;
          &:focus {
            outline: none;
            border-color: red;
          }
        }
      }
      .inputs {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 10px 15px;
        input {
          height: 11px;
          width: 11px;
        }
        label {
          padding-left: 5px;
          color: #fff;
          font-size: 0.8rem;
        }
        a {
          color: #fff;
          font-size: 0.8rem;
          text-decoration: none;
          transition: color 0.3s;
          &::hover {
            color: red;
            text-decoration: underline;
          }
        }
      }
      .buttons {
        margin-top: 10px;
        button {
          cursor: pointer;
          border: none;
          border-radius: 10px;
          background-color: red;
          color: #fff;
          width: 80%;
          height: 3rem;
          font-size: 1.1rem;
          font-weight: bold;
          transition: transform 0.2s active;
          &:hover {
            filter: brightness(1.1);
          }
          &:disabled {
            background-color: #555;
            cursor: not-allowed;
          }
        }
      }
    }
    .divider {
      margin: 25px 0;
      display: flex;
      align-items: center;
      &::before,
      &::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid #444;
      }
      span {
        padding: 0 10px;
        color: #888;
        font-size: 0.8rem;
      }
    }
    .button-register {
      background-color: rgb(14, 14, 17);
      cursor: pointer;
      width: 100%;
      height: 3rem;
      color: #ccc;
      border: 1px solid #444;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 700;
      transition: background 0.3s;
      text-decoration: none;
      padding: 10px;
      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        color: #fff;
      }
    }
  }
}
</style>
