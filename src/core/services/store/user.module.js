import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllUsers";
export const SHOW = "showUser";
export const TOGGLE_BLOCKED_STATUS = "toggleBlockedStatusForUser";

// mutation types
export const SET_USERS = "setUsers";
export const SET_USER = "setUser";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  user: null
};

const getters = {
  getUsers(state) {
    return state.list;
  },
  getUser(state) {
    return state.user;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/users" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_USERS, response.data.data.users);
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
      ApiService.get(`/admin/users/${id}`)
        .then(response => {
          context.commit(SET_USER, response.data.data.user);
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
      ApiService.patch(`/admin/users/${id}/block`)
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
  [SET_USERS](state, data) {
    state.list = data;
  },
  [SET_USER](state, data) {
    state.user = data;
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
