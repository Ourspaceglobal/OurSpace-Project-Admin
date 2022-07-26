import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllRoles";
export const STORE = "storeRole";
export const SHOW = "showRole";
export const UPDATE = "updateRole";
export const DESTROY = "destroyRole";
export const GET_PERMISSIONS = "getPermissions";

// mutation types
export const SET_ROLES = "setRoles";
export const SET_ROLE = "setRole";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  role: null
};

const getters = {
  getRoles(state) {
    return state.list;
  },
  getRole(state) {
    return state.role;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/roles" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_ROLES, response.data.data.roles);
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
        .post("/admin/roles")
        .then(response => {
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
      ApiService.get(`/admin/roles/${id}`)
        .then(response => {
          context.commit(SET_ROLE, response.data.data.role);
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
        .put(`/admin/roles/${form.id}`)
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
      ApiService.delete(`/admin/roles/${id}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [GET_PERMISSIONS](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/permissions" + (query ? `?${query}` : ""))
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
  [SET_ROLES](state, roles) {
    state.list = roles;
  },
  [SET_ROLE](state, data) {
    state.role = data;
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
