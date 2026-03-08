<script setup lang="ts">
import { RifasController } from "@/core/controllers/rifas.controller";
import { ref, onMounted, computed } from "vue";

const rifas = ref<any[]>([]);
const rifaSeleccionada = ref<any | null>(null);
const numerosVendidos = ref<number[]>([]);
const cargando = ref(false);

const cargarRifas = async () => {
  cargando.value = true;
  try {
    rifas.value = await RifasController.getRifas();
  } catch (error) {
    console.error("Error cargando rifas", error);
  } finally {
    cargando.value = false;
  }
};

const seleccionarRifa = async (rifa: any) => {
  if (rifaSeleccionada.value?.id === rifa.id) {
    rifaSeleccionada.value = null;
    numerosVendidos.value = [];
    return;
  }

  rifaSeleccionada.value = rifa;

  try {
    numerosVendidos.value = await RifasController.getNumberSelections(rifa.id);
  } catch (error) {
    console.error("Error obteniendo números vendidos", error);
  }
};

const eliminarRifa = async () => {
  if (!rifaSeleccionada.value) return;

  try {
    //await RifasController.deleteRifa(rifaSeleccionada.value.id);
    rifaSeleccionada.value = null;
    numerosVendidos.value = [];
    await cargarRifas();
  } catch (error) {
    console.error("Error eliminando rifa", error);
  }
};

const totalBoletos = computed(() => {
  return rifaSeleccionada.value?.total_numbers ?? 0;
});

const vendidos = computed(() => {
  return numerosVendidos.value.length;
});

const disponibles = computed(() => {
  return totalBoletos.value - vendidos.value;
});

const progreso = computed(() => {
  if (!totalBoletos.value) return 0;
  return Math.round((vendidos.value / totalBoletos.value) * 100);
});

onMounted(() => {
  cargarRifas();
});
</script>

<template>
  <div id="panel">
    <h3>Panel de Administración</h3>

    <!-- Historial de rifas -->
    <section>
      <div class="content-title">
        <h4>Historial de rifas</h4>
      </div>

      <div
        v-for="rifa in rifas"
        :key="rifa.id"
        class="content"
        :class="{ active: rifaSeleccionada?.id === rifa.id }"
      >
        <div class="content-description">
          <h5>{{ rifa.name }}</h5>
          <p>{{ rifa.description }}</p>
        </div>

        <input
          type="checkbox"
          :checked="rifaSeleccionada?.id === rifa.id"
          @change="seleccionarRifa(rifa)"
        />
      </div>
    </section>

    <!-- Resumen y acciones -->
    <section class="cants">
      <div class="cant-content">
        <h4>Resumen boletos</h4>
        <p>Progreso de ventas: {{ progreso }}%</p>
        <p>Total de boletos: {{ rifaSeleccionada?.number_tikects ?? 0 }}</p>
        <p>Vendidos: {{ vendidos }}</p>
        <p>Disponibles: {{ disponibles }}</p>
      </div>

      <div class="cant-content">
        <h4>Eliminar rifa</h4>
        <p>Selecciona una rifa del historial para habilitar la eliminación</p>
        <button :disabled="!rifaSeleccionada" @click="eliminarRifa">Eliminar rifa</button>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
#panel {
  min-height: 100dvh;
  background: #0f1115;
  color: #eaeaea;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    font-size: 2rem;
    margin-bottom: 24px;
  }

  section {
    width: 100%;
    max-width: 960px;
    margin-bottom: 24px;
  }

  .content-title {
    background: #1f2937;
    padding: 12px;
    border-radius: 12px 12px 0 0;
    text-align: center;
  }

  .content {
    background: #161a22;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #2a2f3a;

    &.active {
      background: #1e293b;
      border-left: 4px solid #3b82f6;
    }

    .content-description {
      display: flex;
      flex-direction: column;
      gap: 4px;

      h5 {
        font-weight: 600;
      }

      p {
        font-size: 0.9rem;
        color: #b5b5b5;
      }
    }

    input {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #3b82f6;
    }
  }

  .cants {
    display: flex;
    gap: 20px;

    .cant-content {
      flex: 1;
      background: #161a22;
      padding: 20px;
      border-radius: 12px;
      text-align: center;

      h4 {
        margin-bottom: 12px;
      }

      p {
        margin-bottom: 6px;
        font-size: 0.9rem;
      }

      button {
        margin-top: 12px;
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 8px;
        background: #ef4444;
        color: #fff;
        font-weight: 600;
        cursor: pointer;

        &:hover {
          background: #dc2626;
        }

        &:disabled {
          background: #555;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
