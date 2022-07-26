import { serialize } from "object-to-formdata";
import { VERIFY_AUTH } from "./auth.module";
import ApiService from "@/core/services/api.service";

// action types
export const UPDATE_PERSONAL_INFO = "updateUserPersonalInfo";
export const UPDATE_PERSONAL_AVATAR = "updateUserAvatar";
export const UPDATE_PASSWORD = "updateUserPassword";
export const UPDATE_TWOFA_STATUS = "updateUserTwofaStatus";

const state = {
  //
};

const getters = {
  //
};

const actions = {
  [UPDATE_PERSONAL_INFO](context, form) {
    return new Promise((resolve, reject) => {
      form
        .patch("admin/update")
        .then(response => {
          context.dispatch(VERIFY_AUTH);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [UPDATE_PERSONAL_AVATAR](context, form) {
    return new Promise((resolve, reject) => {
      form
        .post("admin/update/avatar", {
          // Transform form data to FormData
          transformRequest: [
            function(data) {
              return serialize(data);
            }
          ]
        })
        .then(response => {
          context.dispatch(VERIFY_AUTH);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [UPDATE_PASSWORD](context, form) {
    return new Promise((resolve, reject) => {
      form
        .post("admin/update/password")
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [UPDATE_TWOFA_STATUS](context) {
    return new Promise((resolve, reject) => {
      ApiService.post("admin/update/2fa")
        .then(response => {
          context.dispatch(VERIFY_AUTH);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

const mutations = {
  //
};

export default {
  state,
  actions,
  mutations,
  getters
};
