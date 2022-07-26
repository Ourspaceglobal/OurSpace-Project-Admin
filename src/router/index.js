import Vue from "vue";
import Router from "vue-router";
import multiguard from "vue-router-multiguard";

import {
  AUTHENTICATED,
  SEMI_AUTHENTICATED,
  NOT_AUTHENTICATED
} from "@/middleware/authentication";

import { PERMISSION } from "@/middleware/authorization";

Vue.use(Router);

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/view/layout/Layout"),
    beforeEnter: multiguard([AUTHENTICATED]),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/view/pages/Dashboard.vue")
      },
      {
        path: "/profile",
        name: "profile",
        component: () => import("@/view/pages/profile/Overview.vue")
      },
      {
        path: "/support-tickets",
        name: "support-tickets",
        component: () => import("@/view/pages/SupportTicket.vue"),
        meta: {
          permissions: ["manage support tickets"]
        },
        beforeEnter: multiguard([PERMISSION])
      },
      {
        path: "/apartments",
        component: () => import("@/view/pages/apartment/Index.vue"),
        children: [
          {
            path: "",
            redirect: "all"
          },
          {
            path: "all",
            name: "apartments",
            component: () => import("@/view/pages/apartment/Manage.vue"),
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage apartments"]
            }
          },
          {
            path: "bookings",
            name: "apartment-bookings",
            component: () => import("@/view/pages/apartment/Booking.vue"),
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage apartment bookings"]
            }
          },
          {
            path: "rentals",
            name: "apartment-rentals",
            component: () => import("@/view/pages/apartment/Rental.vue"),
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage apartment rentals"]
            }
          },
          {
            path: ":apartment",
            name: "single-apartment",
            component: () => import("@/view/pages/apartment/Apartment.vue"),
            props: true,
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage apartments"]
            }
          }
        ]
      },
      {
        path: "/config",
        component: () => import("@/view/pages/config/Index.vue"),
        children: [
          {
            path: "locations",
            component: () => import("@/view/pages/config/locations/Index.vue"),
            children: [
              {
                path: "states",
                name: "config-states",
                component: () =>
                  import("@/view/pages/config/locations/State.vue"),
                beforeEnter: multiguard([PERMISSION]),
                meta: {
                  permissions: ["manage states"]
                }
              },
              {
                path: "cities",
                name: "config-cities",
                component: () =>
                  import("@/view/pages/config/locations/City.vue"),
                beforeEnter: multiguard([PERMISSION]),
                meta: {
                  permissions: ["manage cities"]
                }
              },
              {
                path: "local-governments",
                name: "config-local-governments",
                component: () =>
                  import("@/view/pages/config/locations/LocalGovernment.vue"),
                beforeEnter: multiguard([PERMISSION]),
                meta: {
                  permissions: ["manage local governments"]
                }
              }
            ]
          },
          {
            path: "categories",
            name: "config-categories",
            component: () => import("@/view/pages/config/Category.vue"),
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage categories"]
            }
          },
          {
            path: "sub-categories",
            name: "config-sub-categories",
            component: () => import("@/view/pages/config/SubCategory.vue"),
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage sub-categories"]
            }
          },
          {
            path: "amenities",
            name: "config-amenities",
            component: () => import("@/view/pages/config/Amenity.vue"),
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage amenities"]
            }
          },
          {
            path: "system-data",
            name: "config-system-data",
            component: () => import("@/view/pages/config/SystemData.vue"),
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage system data"]
            }
          },
          {
            path: "apartment-settings",
            component: () => import("@/view/pages/config/apartment/Index.vue"),
            children: [
              {
                path: "system-apartment-kycs",
                name: "config-system-apartment-kycs",
                component: () =>
                  import(
                    "@/view/pages/config/apartment/SystemApartmentKyc.vue"
                  ),
                beforeEnter: multiguard([PERMISSION]),
                meta: {
                  permissions: ["manage system apartment kycs"]
                }
              },
              {
                path: "apartment-durations",
                name: "config-apartment-durations",
                component: () =>
                  import("@/view/pages/config/apartment/ApartmentDuration.vue"),
                beforeEnter: multiguard([PERMISSION]),
                meta: {
                  permissions: ["manage apartment durations"]
                }
              }
            ]
          }
        ]
      },
      {
        path: "/blog",
        component: () => import("@/view/pages/blog/Blog.vue"),
        children: [
          {
            path: "post/:post?",
            name: "new-post",
            component: () => import("@/view/pages/blog/Post.vue"),
            props: true,
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage posts"]
            }
          },
          {
            path: "manage",
            alias: "",
            name: "manage-post",
            component: () => import("@/view/pages/blog/Manage.vue"),
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage posts"]
            }
          }
        ]
      },
      {
        path: "/management",
        component: () => import("@/view/pages/management/Management.vue"),
        children: [
          {
            path: "withdrawal-requests",
            name: "withdrawal-requests",
            component: () =>
              import("@/view/pages/management/WithdrawalRequest.vue"),
            props: true,
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage withdrawal requests"]
            }
          },
          {
            path: "wallet-funding-requests",
            name: "wallet-funding-requests",
            component: () =>
              import("@/view/pages/management/WalletFundingRequest.vue"),
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage wallet funding requests"]
            }
          },
          {
            path: "users",
            component: () => import("@/view/pages/management/users/User.vue"),
            children: [
              {
                path: "landlords",
                name: "landlords",
                component: () =>
                  import("@/view/pages/management/users/Landlord.vue"),
                beforeEnter: multiguard([PERMISSION]),
                meta: {
                  permissions: ["manage users"]
                }
              },
              {
                path: "tenants",
                name: "tenants",
                component: () =>
                  import("@/view/pages/management/users/Tenant.vue"),
                beforeEnter: multiguard([PERMISSION]),
                meta: {
                  permissions: ["manage users"]
                }
              },
              {
                path: "landlord-requests",
                name: "landlord-requests",
                component: () =>
                  import("@/view/pages/management/users/LandlordRequest.vue"),
                beforeEnter: multiguard([PERMISSION]),
                meta: {
                  permissions: ["manage landlord requests"]
                }
              }
            ]
          },
          {
            path: "roles",
            name: "roles",
            component: () => import("@/view/pages/management/Role.vue"),
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage access control list"]
            }
          },
          {
            path: "admins",
            name: "admins",
            component: () => import("@/view/pages/management/Admin.vue"),
            beforeEnter: multiguard([PERMISSION]),
            meta: {
              permissions: ["manage admins"]
            }
          },
          {
            path: "my-notifications",
            name: "my-notifications",
            component: () =>
              import("@/view/pages/management/MyNotification.vue")
          },
          {
            path: "push-notifications",
            component: () =>
              import("@/view/pages/management/push-notification/Index.vue"),
            children: [
              {
                path: "",
                name: "manage-push-notifications",
                component: () =>
                  import(
                    "@/view/pages/management/push-notification/Manage.vue"
                  ),
                beforeEnter: multiguard([PERMISSION]),
                meta: {
                  permissions: ["manage push notifications"]
                }
              },
              {
                path: "form/:push_notification?",
                name: "new-push-notification",
                component: () =>
                  import(
                    "@/view/pages/management/push-notification/PushNotification.vue"
                  ),
                props: true,
                beforeEnter: multiguard([PERMISSION]),
                meta: {
                  permissions: ["manage push notifications"]
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "/",
    component: () => import("@/view/pages/auth/Auth"),
    children: [
      {
        name: "login",
        path: "/login",
        component: () => import("@/view/pages/auth/Login"),
        beforeEnter: multiguard([NOT_AUTHENTICATED])
      },
      {
        name: "verify",
        path: "/verify",
        component: () => import("@/view/pages/auth/Verify"),
        beforeEnter: multiguard([SEMI_AUTHENTICATED])
      },
      {
        name: "forgot-password",
        path: "/forgot-password",
        component: () => import("@/view/pages/auth/ForgotPassword"),
        beforeEnter: multiguard([NOT_AUTHENTICATED])
      },
      {
        name: "reset-password",
        path: "/reset-password",
        component: () => import("@/view/pages/auth/ResetPassword"),
        beforeEnter: multiguard([NOT_AUTHENTICATED])
      }
    ]
  },
  {
    path: "/unauthorized",
    name: "unauthorized",
    component: () => import("@/view/pages/error/403.vue")
  },
  {
    path: "/blocked",
    name: "blocked",
    component: () => import("@/view/pages/error/423.vue")
  },
  {
    path: "*",
    name: "404",
    component: () => import("@/view/pages/error/404.vue")
  }
];

export default new Router({
  mode: "history",
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});
