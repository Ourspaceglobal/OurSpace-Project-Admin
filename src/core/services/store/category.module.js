import { serialize } from "object-to-formdata";
import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllCategories";
export const STORE = "storeCategory";
export const SHOW = "showCategory";
export const UPDATE = "updateCategory";
export const TOGGLE_ACTIVE_STATUS = "toggleActiveStatusCategory";
export const DESTROY = "destroyCategory";
export const RESTORE = "restoreCategory";

// mutation types
export const SET_CATEGORIES = "setCategories";
export const SET_CATEGORY = "setCategory";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  category: null
};

const getters = {
  getCategories(state) {
    return state.list;
  },
  getCategory(state) {
    return state.category;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/categories" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_CATEGORIES, response.data.data.categories);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [STORE](context, form) {
    return new Promise((resolve, reject) => {
      form
        .post("/admin/categories", {
          // Transform form data to FormData
          transformRequest: [
            function(data) {
              return serialize(data);
            }
          ]
        })
        .then(response => {
          context.dispatch("showToast", {
            icon: "success",
            title: response.data.message
          });

          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [SHOW](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.get(`/admin/categories/${id}`)
        .then(response => {
          context.commit(SET_CATEGORY, response.data.data.category);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [UPDATE](context, form) {
    return new Promise((resolve, reject) => {
      form
        .post(`/admin/categories/${form.id}`, {
          // Transform form data to FormData
          transformRequest: [
            function(data) {
              data._method = "PUT";
              return serialize(data);
            }
          ]
        })
        .then(response => {
          context.dispatch("showToast", {
            icon: "success",
            title: response.data.message
          });

          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [TOGGLE_ACTIVE_STATUS](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.patch(`/admin/categories/${id}/active`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [DESTROY](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/admin/categories/${id}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [RESTORE](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.patch(`/admin/categories/${id}/restore`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  }
};

const mutations = {
  [SET_CATEGORIES](state, categories) {
    state.list = categories;
  },
  [SET_CATEGORY](state, data) {
    state.category = data;
  },
  [SET_ERROR](state, error) {
    state.errors = error;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
