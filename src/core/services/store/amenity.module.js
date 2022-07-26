import { serialize } from "object-to-formdata";
import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllAmenities";
export const STORE = "storeAmenity";
export const SHOW = "showAmenity";
export const UPDATE = "updateAmenity";
export const TOGGLE_ACTIVE_STATUS = "toggleActiveStatusAmenity";
export const DESTROY = "destroyAmenity";
export const RESTORE = "restoreAmenity";

// mutation types
export const SET_AMENITIES = "setAmenities";
export const SET_AMENITY = "setAmenity";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  amenity: null
};

const getters = {
  getAmenities(state) {
    return state.list;
  },
  getAmenity(state) {
    return state.amenity;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/amenities" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_AMENITIES, response.data.data.amenities);
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
        .post("/admin/amenities", {
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
      ApiService.get(`/admin/amenities/${id}`)
        .then(response => {
          context.commit(SET_AMENITY, response.data.data.amenity);
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
        .post(`/admin/amenities/${form.id}`, {
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
      ApiService.patch(`/admin/amenities/${id}/active`)
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
      ApiService.delete(`/admin/amenities/${id}`)
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
      ApiService.patch(`/admin/amenities/${id}/restore`)
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
  [SET_AMENITIES](state, amenities) {
    state.list = amenities;
  },
  [SET_AMENITY](state, data) {
    state.amenity = data;
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
