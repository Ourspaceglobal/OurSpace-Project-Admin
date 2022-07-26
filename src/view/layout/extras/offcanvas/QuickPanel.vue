<template>
  <div class="topbar-item">
    <div
      class="btn btn-icon btn-hover-transparent-white btn-lg mr-1"
      id="kt_quick_panel_toggle"
    >
      <b-icon icon="grid"></b-icon>
    </div>

    <div
      id="kt_quick_panel"
      ref="kt_quick_panel"
      class="offcanvas offcanvas-right pt-5 pb-10"
      style="overflow: hidden;"
    >
      <div
        class="offcanvas-header offcanvas-header-navs d-flex align-items-center justify-content-between mb-5"
      >
        <ul
          class="nav nav-bold nav-tabs nav-tabs-line nav-tabs-line-3x nav-tabs-primary flex-grow-1 px-10"
          role="tablist"
        >
          <li class="nav-item">
            <a
              class="nav-link active"
              v-on:click="setActiveTab"
              data-tab="0"
              data-toggle="tab"
              href="#"
              role="tab"
              aria-selected="false"
            >
              Settings
            </a>
          </li>
        </ul>
        <div class="offcanvas-close mt-n1 pr-5">
          <a
            href="#"
            class="btn btn-xs btn-icon btn-light btn-hover-primary"
            id="kt_quick_panel_close"
          >
            <i class="ki ki-close icon-xs text-muted"></i>
          </a>
        </div>
      </div>

      <div class="offcanvas-content px-10">
        <div class="tab-content">
          <b-tabs class="hide-tabs" v-model="tabIndex">
            <b-tab active>
              <div class="scroll pr-7 mr-n7" id="kt_quick_panel_settings">
                <form class="form">
                  <div>
                    <h5 class="font-weight-bold mb-3">Security</h5>
                    <div class="form-group mb-0 row">
                      <label class="col-8 col-form-label">
                        Two-Factor Authentication
                      </label>
                      <div class="col-4 text-right">
                        <span
                          class="switch switch-sm"
                          :class="
                            is_2fa_active ? 'switch-success' : 'switch-danger'
                          "
                        >
                          <label>
                            <input type="checkbox" v-model="is_2fa_active" />
                            <span></span>
                          </label>
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KTLayoutQuickPanel from "@/assets/js/layout/extended/quick-panel.js";
import { mapGetters } from "vuex";
import { UPDATE_TWOFA_STATUS } from "@/core/services/store/profile.module";

export default {
  name: "KTQuickPanel",
  data() {
    return {
      tabIndex: 0
    };
  },
  mounted() {
    // Init Quick Offcanvas Panel
    KTLayoutQuickPanel.init(this.$refs["kt_quick_panel"]);
  },
  methods: {
    setActiveTab(event) {
      const tab = event.target.closest('[role="tablist"]');
      const links = tab.querySelectorAll(".nav-link");
      // remove active tab links
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
      }

      // set clicked tab index to bootstrap tab
      this.tabIndex = parseInt(event.target.getAttribute("data-tab"));

      // set current active tab
      event.target.classList.add("active");
    },
    updateTwofaStatus() {
      this.$store.dispatch(UPDATE_TWOFA_STATUS);
    }
  },
  computed: {
    is_2fa_active: {
      get() {
        return this.user.is_2fa_active;
      },
      set() {
        this.updateTwofaStatus();
      }
    },
    ...mapGetters({
      user: "currentUser"
    })
  }
};
</script>
