import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllApartmentDurations";
export const STORE = "storeApartmentDuration";
export const SHOW = "showApartmentDuration";
export const UPDATE = "updateApartmentDuration";
export const DESTROY = "destroyApartmentDuration";
export const RESTORE = "restoreApartmentDuration";

// mutation types
export const SET_APARTMENTDURATIONS = "setApartmentDurations";
export const SET_APARTMENTDURATION = "setApartmentDuration";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  apartment_duration: null
};

const getters = {
  getApartmentDurations(state) {
    return state.list;
  },
  getApartmentDuration(state) {
    return state.apartment_duration;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/apartment-durations" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(
            SET_APARTMENTDURATIONS,
            response.data.data.apartment_durations
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
        .post("/admin/apartment-durations")
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
      ApiService.get(`/admin/apartment-durations/${id}`)
        .then(response => {
          context.commit(
            SET_APARTMENTDURATION,
            response.data.data.apartment_duration
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
        .put(`/admin/apartment-durations/${form.id}`)
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
      ApiService.delete(`/admin/apartment-durations/${id}`)
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
      ApiService.patch(`/admin/apartment-durations/${id}/restore`)
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
  [SET_APARTMENTDURATIONS](state, data) {
    state.list = data;
  },
  [SET_APARTMENTDURATION](state, data) {
    state.apartment_duration = data;
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
