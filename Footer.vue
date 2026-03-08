<script setup lang="ts">
import { computed } from "vue";
import { FacebookIcon, InstagramIcon } from "vue3-simple-icons";

const currentYear = computed(() => new Date().getFullYear());

const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/14TWwqZMhqs/?mibextid=wwXIfr",
    icon: FacebookIcon,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/twinsrifas?igsh=MTJ2MWRxZDJsM3V3dQ==",
    icon: InstagramIcon,
  },
];
</script>

<template>
  <footer class="main-footer">
    <div class="footer-container">
      <section class="footer-top">
        <div class="brand">
          <h1>Twins <span class="highlight">Rifas</span></h1>
          <p class="copyright">© {{ currentYear }} Todos los derechos reservados.</p>
        </div>

        <nav class="social-nav">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="link.name"
          >
            <component :is="link.icon" class="social-icon" />
          </a>
        </nav>
      </section>

      <section class="footer-bottom">
        <div class="credits">
          <p>By <strong>@DvAndresGT</strong></p>
          <p class="dev-tag">Desarrollador Multiplataforma</p>
        </div>
      </section>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.main-footer {
  // CAMBIO A ROJO: Degradado de un rojo intenso a un negro profundo
  background: linear-gradient(180deg, #d32f2f 0%, #0a0000 100%);
  color: #ffffff;
  padding: 2.5rem 1.5rem 1.5rem;
  border-top: 2px solid #ff5252; // Línea sutil de brillo rojo arriba

  .footer-container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 600px) {
      flex-direction: column;
      gap: 1.5rem;
      text-align: center;
    }
  }

  .brand {
    h1 {
      font-size: 1.8rem;
      font-weight: 900;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;

      .highlight {
        color: #ffeb3b; // Un toque de amarillo/dorado (común en rifas) o déjalo blanco
      }
    }
    .copyright {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.8rem;
      margin-top: 0.3rem;
    }
  }

  .social-nav {
    display: flex;
    gap: 1.5rem;

    a {
      color: #ffffff;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.2);
        color: #ff5252; // Brillo rojo claro al pasar el mouse
        filter: drop-shadow(0 0 8px rgba(255, 82, 82, 0.6));
      }

      .social-icon {
        width: 28px;
        height: 28px;
        fill: currentColor;
      }
    }
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1.5rem;
    text-align: center;

    .credits {
      p {
        margin: 0;
        font-size: 0.6rem;
        color: rgba(255, 255, 255, 0.4);

        strong {
          color: rgba(255, 255, 255, 0.7);
        }
      }
      .dev-tag {
        font-size: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-top: 4px;
        color: #d32f2f; // Tu firma en rojo
      }
    }
  }
}
</style>
