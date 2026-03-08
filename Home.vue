<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RifasController } from "@/core/controllers/rifas.controller";

const rifas = ref<any[]>([]);
const loading = ref(true);

const selectedRifa = ref<any | null>(null);
const showModal = ref(false);

onMounted(async () => {
  loading.value = true;

  try {
    rifas.value = await RifasController.getRifas();
  } catch (error) {
    console.error("Error cargando rifas", error);
  } finally {
    loading.value = false;
  }
});

function openModal(rifa: any) {
  selectedRifa.value = rifa;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedRifa.value = null;
}
</script>

<template>
  <div class="home">
    <section class="title">
      <h2>Rifas disponibles</h2>

      <section class="content" v-if="!loading">
        <div v-if="rifas.length === 0">No hay rifas disponibles</div>

        <div
          v-for="rifa in rifas"
          :key="rifa.id"
          class="fondo"
          :style="{ backgroundImage: `url(${rifa.image})` }"
        >
          <div class="contenido">
            <h2 class="titl">{{ rifa.title }}</h2>
            <p class="description">{{ rifa.description }}</p>
            <p class="price">Precio: {{ rifa.price }}</p>
          </div>

          <button class="button" @click="openModal(rifa)">Ver más detalles</button>
        </div>
      </section>

      <div v-else>Cargando rifas...</div>
    </section>
  </div>

  <div class="modal-overlay" v-if="!loading && showModal && selectedRifa">
    <div class="modal">
      <span class="close" @click="closeModal">×</span>

      <img :src="selectedRifa.image" alt="image" />
      <h2>{{ selectedRifa.title }}</h2>
      <p>{{ selectedRifa.description }}</p>

      <div class="date">
        <p>Inicia el día: {{ selectedRifa.start }}</p>
        <p>Finaliza el día: {{ selectedRifa.end }}</p>
      </div>

      <p>Precio: {{ selectedRifa.price }}</p>

      <router-link :to="{ name: 'rifas', params: { id: selectedRifa.id } }" class="button">
        Participar
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
.home {
  min-height: 100vh;
  height: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  text-align: center;
  .title {
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .content {
    padding-top: 30px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;

    .fondo {
      position: relative;
      width: 440px;
      height: 340px;
      background-position: center;
      background-size: cover;
      border-radius: 9px;
      overflow: hidden;
      margin: 10px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

      // overlay para el texto
      .contenido {
        position: absolute;
        bottom: 0; // pegado abajo
        left: 0;
        width: 100%;
        background: rgba(0, 0, 0, 0.8); // semitransparente
        color: #fff;
        padding: 15px;
        text-align: start;

        .titl {
          margin: 0;
          font-size: 1.2rem;
        }

        .description {
          font-size: 0.75rem;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.3);
        }

        .price {
          font-weight: bold;
          margin-top: 10px;
        }
      }

      .button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #aa1717;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        z-index: 2;

        &:hover {
          background: #e68900;
        }
      }
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  .modal {
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    background: rgb(0, 0, 0, 0.8);
    border-radius: 8px;
    padding: 15px;
    width: 650px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    img {
      padding: 15px;
      width: 100%;
      height: 16rem;
      border-radius: 30px;
    }
    h2 {
      font-size: 1.5rem;
      text-align: start;
      font-weight: bold;
    }
    p {
      padding: 5px 0;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.3);
      padding-bottom: 10px;
    }
    .date {
      display: flex;
      justify-content: space-between;
    }
    .close {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 1.2rem;
      cursor: pointer;
    }
    .button {
      cursor: pointer;
      color: #fff;
      background-color: #aa1717;
      font-size: 1rem;
      font-weight: 600;
      padding: 5px 15px;
      border-radius: 5px;
      text-decoration: none;
    }
  }
}
</style>
