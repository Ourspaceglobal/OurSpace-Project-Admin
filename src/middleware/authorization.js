import store from "@/core/services/store";
import { FETCH_MY_PERMISSIONS } from "@/core/services/store/auth.module";

const PERMISSION = function(to, from, next) {
  let permissions = to.meta.permissions;
  let myPermissions = store.getters["getMyPermissions"];

  if (permissions) {
    if (myPermissions.length > 0) {
      validatePermissions(permissions, myPermissions)
        ? next()
        : next({
            name: "unauthorized",
            query: {
              redirect: to.fullPath
            }
          });
    } else {
      store
        .dispatch(FETCH_MY_PERMISSIONS)
        .then(() => {
          validatePermissions(permissions, myPermissions)
            ? next()
            : next({
                name: "unauthorized",
                query: {
                  redirect: to.fullPath
                }
              });
        })
        .catch(() => {
          next({
            name: "dashboard",
            query: {
              redirect: to.fullPath
            }
          });
        });
    }
  } else {
    next();
  }
};

const UNAUTHORIZEDPAGE = function(to, from, next) {
  if (to.query.redirect) {
    next();
  } else {
    next({
      name: "dashboard"
    });
  }
};

/**
 * Validate the route permissions against the admin's permissions.
 *
 * @param {array} permissions Route permissions
 * @param {array} myPermissions My permissions
 * @returns bool
 */
function validatePermissions(permissions, myPermissions) {
  let userPermissions = myPermissions.map(permission =>
    permission.name.toLowerCase()
  );

  let permissionsList = permissions.includes(",")
    ? permissions.split(",")
    : permissions;
  let permitted = 0;

  for (var i = 0; i < permissionsList.length; i++) {
    if (userPermissions.includes(permissionsList[i])) {
      permitted++;
    }
  }

  return permitted > 0;
}

export { PERMISSION, UNAUTHORIZEDPAGE };
