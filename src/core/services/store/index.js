import Vue from "vue";
import Vuex from "vuex";

// MODULES
import auth from "./auth.module";
import htmlClass from "./htmlclass.module";
import config from "./config.module";
import breadcrumbs from "./breadcrumbs.module";
import profile from "./profile.module";
import state from "./locations/state.module";
import city from "./locations/city.module";
import localGovernment from "./locations/local-government.module";
import category from "./category.module";
import subCategory from "./sub-category.module";
import amenity from "./amenity.module";
import systemdata from "./systemdata.module";
import systemapartmentkyc from "./systemapartmentkyc.module";
import landlordrequest from "./landlordrequest.module";
import supportticket from "./supportticket.module";
import post from "./blog/post.module";
import withdrawalrequest from "./withdrawalrequest.module";
import walletfundingrequest from "./walletfundingrequest.module";
import user from "./user.module";
import role from "./role.module";
import admin from "./admin.module";
import mynotification from "./mynotification.module";
import pushnotification from "./pushnotification.module";
import apartmentduration from "./apartmentduration.module";
import apartment from "./apartment.module";
import apartmentbooking from "./apartmentbooking.module";
import apartmentrental from "./apartmentrental.module";
import statistics from "./statistics.module";

// ACTION TYPES
export const TOAST = "showToast";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appName: process.env.VUE_APP_APP_NAME,
    appUrl: process.env.VUE_APP_APP_URL,
    apiUrl: process.env.VUE_APP_API_URL,
    webUrl: process.env.VUE_APP_WEB_URL
  },
  actions: {
    [TOAST](context, { icon, title }) {
      this._vm.$Toast.fire({
        icon: icon,
        title: title
      });
    }
  },
  modules: {
    auth,
    htmlClass,
    config,
    breadcrumbs,
    profile,
    state,
    city,
    localGovernment,
    category,
    subCategory,
    amenity,
    systemdata,
    systemapartmentkyc,
    landlordrequest,
    supportticket,
    post,
    withdrawalrequest,
    walletfundingrequest,
    user,
    role,
    admin,
    mynotification,
    pushnotification,
    apartmentduration,
    apartment,
    apartmentbooking,
    apartmentrental,
    statistics
  }
});
