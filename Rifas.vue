<script setup lang="ts">
import { RifasController } from "@/core/controllers/rifas.controller";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router"; // Importado useRouter

const route = useRoute();
const router = useRouter(); // Instanciado el router

const rifa = ref<any>(null);
const numerosSeleccionados = ref<number[]>([]);
const numerosDisponibles = ref<number[]>([]);
const numerosElegidos = ref<number[]>([]);
const id = ref<string>("");

/* BUSCADOR */
const searchNumber = ref<number | null>(null);
const numberRefs = ref<Record<number, HTMLElement>>({});

onMounted(async () => {
  id.value = route.params.id as string;

  rifa.value = await RifasController.getRifaById(id.value);
  numerosSeleccionados.value = await RifasController.getNumberSelections(id.value);

  numerosDisponibles.value = Array.from({ length: rifa.value.number_tikects }, (_, i) => i + 1);
});

const seleccionarNumero = (numero: number) => {
  const index = numerosElegidos.value.indexOf(numero);

  if (index === -1) {
    numerosElegidos.value.push(numero);
  } else {
    numerosElegidos.value.splice(index, 1);
  }
};

const setNumberRef = (el: HTMLElement | null, numero: number) => {
  if (el) numberRefs.value[numero] = el;
};

const buscarNumero = () => {
  if (!searchNumber.value) return;

  const el = numberRefs.value[searchNumber.value];
  if (!el) return;

  el.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  el.classList.add("highlight");
  setTimeout(() => el.classList.remove("highlight"), 1500);
};

const total = computed(() => {
  return numerosElegidos.value.length * (rifa.value?.price ?? 0);
});

/**
 * Función para navegar al checkout pasando los datos
 * necesarios mediante query params.
 */
const irAlPago = () => {
  if (numerosElegidos.value.length === 0) return;

  router.push({
    name: "payment", // El nombre definido en router/index.ts dentro de children de /user
    query: {
      rifaId: id.value,
      numeros: numerosElegidos.value.join(","), // Convertimos el array [1,2] a string "1,2"
      total: total.value,
    },
  });
};
</script>

<template>
  <div class="rifa">
    <h2 class="title">
      Rifa a <strong>{{ rifa?.title }}</strong>
    </h2>

    <p class="description">{{ rifa?.description }}</p>

    <section class="container">
      <div>
        <h6>NÚMEROS SELECCIONADOS</h6>
        <p>{{ numerosElegidos.join(", ") || "-" }}</p>
      </div>

      <div>
        <h6>PRECIO</h6>
        <p>${{ rifa?.price }}</p>
      </div>

      <div>
        <h6>TOTAL</h6>
        <p>${{ total }}</p>
      </div>
    </section>

    <section class="search">
      <input
        type="number"
        v-model.number="searchNumber"
        placeholder="Buscar número"
        @keyup.enter="buscarNumero"
      />
      <button @click="buscarNumero">Buscar</button>
    </section>

    <section class="numbers">
      <h5>Selecciona tus números</h5>

      <div class="grid">
        <button
          v-for="numero in numerosDisponibles"
          :key="numero"
          :ref="(el) => setNumberRef(el as HTMLElement, numero)"
          :disabled="numerosSeleccionados.includes(numero)"
          :class="{
            active: numerosElegidos.includes(numero),
            disabled: numerosSeleccionados.includes(numero),
          }"
          @click="seleccionarNumero(numero)"
        >
          {{ numero }}
        </button>
      </div>
    </section>

    <button class="shop" v-if="numerosElegidos.length > 0" @click="irAlPago">
      {{
        numerosElegidos.length === 1
          ? `Comprar 1 número $${rifa?.price}`
          : `Comprar ${numerosElegidos.length} números $${total}`
      }}
    </button>
  </div>
</template>

<style lang="scss">
.rifa {
  width: 100%;
  min-height: 100dvh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #fff;

  .title {
    max-width: 800px;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    text-align: center;
    strong {
      color: red;
    }
  }

  .description {
    margin-top: 15px;
    max-width: 800px;
    text-align: center;
  }

  .container {
    margin: 20px 0;
    padding: 15px;
    border-radius: 15px;
    border: 2px solid rgba(255, 2, 2, 0.7);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    width: 100%;
    max-width: 800px;
    text-align: center;

    h6 {
      font-size: 0.85rem;
      color: #d9d7ff;
    }
  }

  .search {
    display: flex;
    gap: 10px;
    margin: 20px 0;

    input {
      width: 160px;
      padding: 8px;
      border-radius: 8px;
      border: none;
      outline: none;
    }

    button {
      padding: 8px 15px;
      border-radius: 8px;
      border: none;
      background: red;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }
  }

  .numbers {
    width: 100%;
    max-width: 800px;

    h5 {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 15px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
      gap: 10px;
    }

    button {
      height: 45px;
      border-radius: 50%;
      border: none;
      background: #272727;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s ease;

      &.active {
        background: #4caf50;
      }

      &.disabled {
        background: #ff5252;
        cursor: not-allowed;
      }

      &.highlight {
        box-shadow: 0 0 10px 4px yellow;
      }
    }
  }

  .shop {
    margin-top: 20px;
    padding: 12px 25px;
    background: rgb(245, 41, 41);
    border-radius: 15px;
    font-size: 1.3rem;
    font-weight: bold;
    color: #fff;
    border: none;
    position: sticky;
    bottom: 10px;
    cursor: pointer;
  }

  @media (max-width: 600px) {
    .container {
      grid-template-columns: 1fr;
    }
  }
}
</style>
