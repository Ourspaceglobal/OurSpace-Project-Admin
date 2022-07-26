import store from "@/core/services/store";
import { VERIFY_AUTH } from "@/core/services/store/auth.module";

const AUTHENTICATED = function(to, from, next) {
  store
    .dispatch(VERIFY_AUTH)
    .then(() => {
      next();
    })
    .catch(error => {
      if (error?.response?.data?.code === 101) {
        next({
          name: "verify"
        });
        return;
      }

      if (error?.response?.data?.code === 102) {
        next({
          name: "blocked"
        });
        return;
      }

      next({
        name: "login",
        query: {
          redirect: to.fullPath
        }
      });
    });
};

const SEMI_AUTHENTICATED = function(to, from, next) {
  store
    .dispatch(VERIFY_AUTH, true)
    .then(() => {
      next();
    })
    .catch(() => {
      next({
        name: "login",
        query: {
          redirect: to.fullPath
        }
      });
    });
};

const NOT_AUTHENTICATED = function(to, from, next) {
  store
    .dispatch(VERIFY_AUTH)
    .then(() => {
      next({
        name: "dashboard"
      });
    })
    .catch(error => {
      if (error?.response?.data?.code === 101) {
        next({
          name: "verify"
        });
        return;
      }

      next();
    });
};

export { AUTHENTICATED, SEMI_AUTHENTICATED, NOT_AUTHENTICATED };
