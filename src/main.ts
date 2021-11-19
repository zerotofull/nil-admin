import {createApp} from 'vue'
import App from './App.vue'
import router, {setupRouter} from './router'
import {pinia} from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './styles/main.scss'

async function bootstrsp() {
    let app = createApp(App)

    app.use(ElementPlus)

    app.use(pinia)

    await setupRouter(app);

    await router.isReady();

    app.mount('#app', true);
}

void bootstrsp()
