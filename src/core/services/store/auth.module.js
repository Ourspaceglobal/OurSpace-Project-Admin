import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const VERIFY_2FA = "verifyTwofa";
export const REQUEST_2FA_CODE = "requestTwofaCode";
export const LOGOUT = "logout";
export const FORGOTPASSWORD = "forgotPassword";
export const RESETPASSWORD = "resetPassword";
export const SENDEMAILVERIFICATIONLINK = "sendEmailVerificationLink";
export const VERIFY_EMAIL = "verifyEmail";
export const FETCH_MY_PERMISSIONS = "fetchMyPermissions";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setAuthUser";
export const SET_ERROR = "setError";
export const SET_MY_PERMISSIONS = "setMyPermissions";

const state = {
  errors: null,
  user: null,
  isAuthenticated: !!JwtService.getToken(),
  permissions: []
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
  getMyPermissions(state) {
    return state.permissions;
  }
};

const actions = {
  [LOGIN](context, form) {
    return new Promise((resolve, reject) => {
      form
        .post("/admin/login")
        .then(response => {
          context.commit(SET_AUTH, response.data.data);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [VERIFY_2FA](context, form) {
    return new Promise((resolve, reject) => {
      form
        .post("/admin/verify")
        .then(response => {
          context.commit(SET_AUTH, response.data.data);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [LOGOUT](context) {
    return new Promise((resolve, reject) => {
      ApiService.post("admin/logout")
        .then(response => {
          context.commit(PURGE_AUTH);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [VERIFY_AUTH](context, forTwoFa = false) {
    return new Promise((resolve, reject) => {
      ApiService.get("admin" + (forTwoFa ? "/verify" : ""))
        .then(response => {
          context.commit(SET_AUTH, response.data.data);

          context.dispatch(FETCH_MY_PERMISSIONS).finally(() => {
            resolve(response);
          });
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [FORGOTPASSWORD](context, form) {
    return new Promise((resolve, reject) => {
      return form
        .post("admin/password/forgot")
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [RESETPASSWORD](context, form) {
    return new Promise((resolve, reject) => {
      return form
        .post("admin/password/reset")
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [REQUEST_2FA_CODE]() {
    return new Promise((resolve, reject) => {
      ApiService.post("admin/verify/resend")
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [VERIFY_EMAIL](context, query) {
    return new Promise((resolve, reject) => {
      let url = `/admin/email/verify
					?expires=${query.expires}&hash=${query.hash}&id=${query.id}&signature=${query.signature}`;

      ApiService.get(url)
        .then(response => {
          context.dispatch(VERIFY_AUTH);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [SENDEMAILVERIFICATIONLINK](context, form) {
    return new Promise((resolve, reject) => {
      form
        .post("admin/email/resend")
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [FETCH_MY_PERMISSIONS](context) {
    return new Promise((resolve, reject) => {
      ApiService.get("admin/my-permissions")
        .then(response => {
          context.commit(SET_MY_PERMISSIONS, response.data.data.permissions);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_MY_PERMISSIONS](state, permissions) {
    state.permissions = permissions;
  },
  [SET_AUTH](state, data) {
    state.isAuthenticated = true;
    state.user = data.admin;
    state.errors = {};

    if (data.token) {
      JwtService.saveToken(data.token);
    }
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = null;
    state.errors = null;
    JwtService.destroyToken();
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
