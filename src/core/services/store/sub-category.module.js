import { serialize } from "object-to-formdata";
import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllSubCategories";
export const STORE = "storeSubCategory";
export const SHOW = "showSubCategory";
export const UPDATE = "updateSubCategory";
export const TOGGLE_ACTIVE_STATUS = "toggleActiveStatusSubCategory";
export const DESTROY = "destroySubCategory";
export const RESTORE = "restoreSubCategory";

// mutation types
export const SET_SUB_CATEGORIES = "setSubCategories";
export const SET_SUB_CATEGORY = "setSubCategory";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  subCategory: null
};

const getters = {
  getSubCategories(state) {
    return state.list;
  },
  getSubCategory(state) {
    return state.sub_category;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/sub-categories" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_SUB_CATEGORIES, response.data.data.sub_categories);
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
        .post("/admin/sub-categories", {
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
      ApiService.get(`/admin/sub-categories/${id}`)
        .then(response => {
          context.commit(SET_SUB_CATEGORY, response.data.data.sub_category);
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
        .post(`/admin/sub-categories/${form.id}`, {
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
      ApiService.patch(`/admin/sub-categories/${id}/active`)
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
      ApiService.delete(`/admin/sub-categories/${id}`)
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
      ApiService.patch(`/admin/sub-categories/${id}/restore`)
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
  [SET_SUB_CATEGORIES](state, subCategories) {
    state.list = subCategories;
  },
  [SET_SUB_CATEGORY](state, data) {
    state.sub_category = data;
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
