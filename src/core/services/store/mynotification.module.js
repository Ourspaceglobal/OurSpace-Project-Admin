import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllMyNotifications";
export const READ = "readMyNotification";
export const READ_ALL = "readAllMyNotifications";

// mutation types
export const SET_MYNOTIFICATIONS = "setMyNotifications";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: []
};

const getters = {
  getMyNotifications(state) {
    return state.list;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/notifications" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_MYNOTIFICATIONS, response.data.data.notifications);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [READ](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.patch(`/admin/notifications/${id}`)
        .then(response => {
          context.dispatch("fetchAllStatistics");
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [READ_ALL](context) {
    return new Promise((resolve, reject) => {
      ApiService.post(`/admin/notifications/read-all`)
        .then(response => {
          context.dispatch("fetchAllStatistics");
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
  [SET_MYNOTIFICATIONS](state, myNotifications) {
    state.list = myNotifications;
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
