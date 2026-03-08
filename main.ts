import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useAuthStore } from "./core/stores/auth.store";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(router);

const authStorage = useAuthStore(pinia);
await authStorage.loadSession();

await router.isReady();

authStorage.syncSession();

app.mount("#app");
