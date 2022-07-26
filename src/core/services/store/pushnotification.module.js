import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllPushNotifications";
export const STORE = "storePushNotification";
export const SHOW = "showPushNotification";
export const UPDATE = "updatePushNotification";
export const DESTROY = "destroyPushNotification";
export const RESTORE = "restorePushNotification";

// mutation types
export const SET_PUSHNOTIFICATIONS = "setPushNotifications";
export const SET_PUSHNOTIFICATION = "setPushNotification";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  push_notification: null
};

const getters = {
  getPushNotifications(state) {
    return state.list;
  },
  getPushNotification(state) {
    return state.push_notification;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/push-notifications" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(
            SET_PUSHNOTIFICATIONS,
            response.data.data.push_notifications
          );
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
        .post("/admin/push-notifications")
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
      ApiService.get(`/admin/push-notifications/${id}`)
        .then(response => {
          context.commit(
            SET_PUSHNOTIFICATION,
            response.data.data.push_notification
          );
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
        .put(`/admin/push-notifications/${form.id}`)
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
      ApiService.delete(`/admin/push-notifications/${id}`)
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
      ApiService.patch(`/admin/push-notifications/${id}/restore`)
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
  [SET_PUSHNOTIFICATIONS](state, data) {
    state.list = data;
  },
  [SET_PUSHNOTIFICATION](state, data) {
    state.push_notification = data;
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
