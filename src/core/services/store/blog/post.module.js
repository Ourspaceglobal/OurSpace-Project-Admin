import { serialize } from "object-to-formdata";
import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllPosts";
export const STORE = "storePost";
export const SHOW = "showPost";
export const UPDATE = "updatePost";
export const TOGGLE_PUBLICATION_STATUS = "togglePublicationStatus";
export const DESTROY = "destroyPost";
export const RESTORE = "restorePost";

// mutation types
export const SET_POSTS = "setPosts";
export const SET_POST = "setPost";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  post: null
};

const getters = {
  getPosts(state) {
    return state.list;
  },
  getPost(state) {
    return state.post;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/posts" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_POSTS, response.data.data.posts);
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
        .post("/admin/posts", {
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
      ApiService.get(`/admin/posts/${id}`)
        .then(response => {
          context.commit(SET_POST, response.data.data.post);
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
        .post(`/admin/posts/${form.id}`, {
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
  [DESTROY](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/admin/posts/${id}`)
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
      ApiService.patch(`/admin/posts/${id}/restore`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [TOGGLE_PUBLICATION_STATUS](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.patch(`/admin/posts/${id}/publication`)
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
  [SET_POSTS](state, data) {
    state.list = data;
  },
  [SET_POST](state, data) {
    state.post = data;
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
