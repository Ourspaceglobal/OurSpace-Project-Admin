import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/core/services/store";
import ApiService from "@/core/services/api.service";
// import MockService from "@/core/mock/mock.service";

Vue.config.productionTip = false;

// Global 3rd party plugins
import "popper.js";
import "tooltip.js";
import PerfectScrollbar from "perfect-scrollbar";
window.PerfectScrollbar = PerfectScrollbar;
import ClipboardJS from "clipboard";
window.ClipboardJS = ClipboardJS;

// Vue 3rd party plugins
import i18n from "@/core/plugins/vue-i18n";
import vuetify from "@/core/plugins/vuetify";
import "@/core/plugins/portal-vue";
import "@/core/plugins/bootstrap-vue";
import "@/core/plugins/perfect-scrollbar";
import "@/core/plugins/highlight-js";
import "@/core/plugins/inline-svg";
import "@/core/plugins/apexcharts";
import "@/core/plugins/treeselect";
import "@/core/plugins/metronic";
import "@mdi/font/css/materialdesignicons.css";
import "@/core/plugins/formvalidation";
import "@/core/plugins/vform";
import "@/core/plugins/sweetalert2";
Vue.use(require("vue-moment"));

// Filters
import "@/core/filters";

// NProgress
import NProgress from "vue-nprogress";
Vue.use(NProgress);
const nprogress = new NProgress({
  showSpinner: true
});

// Styles
import "@/assets/css/main.css";

// API service init
ApiService.init();

import permission from "@/core/mixins/permission";

new Vue({
  mixins: [permission],
  router,
  store,
  i18n,
  vuetify,
  nprogress,
  render: h => h(App),
  methods: {
    bTableRowClass(item, type) {
      if (!item || type !== "row") return;
      if (item?.deleted_at) return "table-warning";
      if (item?.read_at) return "faint";
    },
    pagination(route, goToPage) {
      if (route.query.page) {
        goToPage(route.query.page);
      } else {
        goToPage(1);
      }
    },
    getReadableDate(date, format = null) {
      return date
        ? this.$moment(date).format(
            format ? format : "dddd, MMMM Do YYYY, h:mm:ss a"
          )
        : "nil";
    },
    convertToSlug(text, separator) {
      return text
        .toLowerCase()
        .replace(/ /g, separator ? separator : "_")
        .replace(/[^\w-]+/g, "");
    }
  }
}).$mount("#app");
