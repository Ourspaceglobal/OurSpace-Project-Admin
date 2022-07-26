<template>
  <div class="topbar-item">
    <div
      id="kt_quick_user_toggle"
      class="btn btn-icon btn-hover-transparent-white d-flex align-items-center btn-lg px-md-2 w-md-auto"
    >
      <div class="d-flex flex-column text-right pr-3">
        <span
          class="text-white opacity-50 font-weight-bold font-size-sm d-none d-md-inline"
        >
          {{ user.full_name }}
        </span>
        <span
          class="text-white font-weight-bolder font-size-sm d-none d-md-inline"
        >
          {{ user.email }}
        </span>
      </div>
      <span class="symbol symbol-35">
        <span
          class="symbol-label font-size-h5 font-weight-bold text-white bg-white-o-30"
        >
          {{ user.first_name[0] }}
        </span>
      </span>
    </div>

    <div
      id="kt_quick_user"
      ref="kt_quick_user"
      class="offcanvas offcanvas-right p-10"
    >
      <!--begin::Header-->
      <div
        class="offcanvas-header d-flex align-items-center justify-content-between pb-5"
      >
        <h3 class="font-weight-bold m-0">
          User Profile
        </h3>
        <a
          href="#"
          class="btn btn-xs btn-icon btn-light btn-hover-primary"
          id="kt_quick_user_close"
        >
          <i class="ki ki-close icon-xs text-muted"></i>
        </a>
      </div>

      <perfect-scrollbar
        class="offcanvas-content pr-5 mr-n5 scroll"
        style="max-height: 90vh; position: relative;"
      >
        <div class="d-flex align-items-center mt-5">
          <div class="symbol symbol-100 mr-5">
            <img class="symbol-label" :src="picture" alt="avatar" />
            <i class="symbol-badge bg-success"></i>
          </div>
          <div class="d-flex flex-column">
            <span class="font-weight-bold font-size-h5 text-dark-75">
              {{ user.full_name }}
            </span>
            <div class="text-muted mt-1">{{ user.phone_number }}</div>
            <div class="mt-2 mb-2">
              <span class="p-0 pb-2">
                <span class="mr-1">
                  <b-icon icon="envelope"></b-icon>
                </span>
                <span class="text-muted">
                  {{ user.email }}
                </span>
              </span>
            </div>
            <button class="btn btn-light-primary btn-bold" @click="onLogout">
              Sign out
            </button>
          </div>
        </div>

        <div class="separator separator-dashed mt-8 mb-5"></div>

        <div class="navi navi-spacer-x-0 p-0">
          <router-link :to="{ name: 'profile' }" class="navi-item">
            <div class="navi-link">
              <div class="symbol symbol-40 bg-light mr-3">
                <div class="symbol-label">
                  <b-icon
                    icon="person"
                    font-scale="1.5"
                    variant="primary"
                  ></b-icon>
                </div>
              </div>
              <div class="navi-text">
                <div class="font-weight-bold">My Profile</div>
                <div class="text-muted">
                  Account settings and more
                </div>
              </div>
            </div>
          </router-link>

          <router-link :to="{ name: 'my-notifications' }" class="navi-item">
            <div class="navi-link">
              <div class="symbol symbol-40 bg-light mr-3">
                <div class="symbol-label">
                  <b-icon
                    icon="envelope"
                    font-scale="1.5"
                    variant="warning"
                  ></b-icon>
                </div>
              </div>
              <div class="navi-text">
                <div class="font-weight-bold">My Notifications</div>
                <div class="text-muted">Inbox and tasks</div>
              </div>
            </div>
          </router-link>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/core/services/store/auth.module";
import KTLayoutQuickUser from "@/assets/js/layout/extended/quick-user.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";

export default {
  name: "KTQuickUser",
  mounted() {
    KTLayoutQuickUser.init(this.$refs["kt_quick_user"]);
  },
  watch: {
    $route() {
      this.closeOffcanvas();
    }
  },
  methods: {
    onLogout() {
      this.$store
        .dispatch(LOGOUT)
        .then(() => this.$router.push({ name: "login" }));
    },
    closeOffcanvas() {
      new KTOffcanvas(KTLayoutQuickUser.getElement()).hide();
    }
  },
  computed: {
    picture() {
      return this.user.avatar;
    },
    ...mapGetters({
      user: "currentUser"
    })
  }
};
</script>

<style lang="scss" scoped>
#kt_quick_user {
  overflow: hidden;
}
</style>
