import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllAdmins";
export const STORE = "storeAdmin";
export const SHOW = "showAdmin";
export const UPDATE = "updateAdmin";
export const TOGGLE_BLOCKED_STATUS = "toggleBlockedStatusForAdmin";
export const DESTROY = "destroyAdmin";
export const RESTORE = "restoreAdmin";
export const GET_ROLES = "getRoles";
export const TOGGLE_ROLE = "toggleRole";

// mutation types
export const SET_ADMINS = "setAdmins";
export const SET_ADMIN = "setAdmin";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  admin: null
};

const getters = {
  getAdmins(state) {
    return state.list;
  },
  getAdmin(state) {
    return state.admin;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/admins" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_ADMINS, response.data.data.admins);
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
        .post("/admin/admins")
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
      ApiService.get(`/admin/admins/${id}`)
        .then(response => {
          context.commit(SET_ADMIN, response.data.data.admin);
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
        .put(`/admin/admins/${form.id}`)
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
  [TOGGLE_BLOCKED_STATUS](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.patch(`/admin/admins/${id}/block`)
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
  [DESTROY](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/admin/admins/${id}`)
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
      ApiService.patch(`/admin/admins/${id}/restore`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [GET_ROLES](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/roles" + (query ? `?${query}` : ""))
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [TOGGLE_ROLE](context, form) {
    return new Promise((resolve, reject) => {
      form
        .patch(`/admin/admins/${form.id}/toggle-role`)
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
  }
};

const mutations = {
  [SET_ADMINS](state, admins) {
    state.list = admins;
  },
  [SET_ADMIN](state, data) {
    state.admin = data;
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
