import Vue from 'vue'
import App from './App.vue'

import TimeEditor from './components/TimeEditor'

import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);
Vue.component('time-editor', TimeEditor);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
