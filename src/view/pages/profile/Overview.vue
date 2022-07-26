<template>
  <transition name="fade-in-up">
    <div class="d-flex flex-row">
      <div
        class="flex-row-auto offcanvas-mobile w-300px w-xl-350px"
        id="kt_profile_aside"
      >
        <div class="card card-custom card-stretch">
          <div class="card-body pt-4">
            <div class="d-flex align-items-center">
              <div
                class="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center"
              >
                <div
                  class="symbol-label"
                  :style="{
                    backgroundImage: `url(${user.avatar})`
                  }"
                ></div>
                <i class="symbol-badge bg-success"></i>
              </div>
              <div>
                <a
                  class="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary"
                  >{{ user.full_name }}</a
                >
                <div class="text-muted"></div>
              </div>
            </div>
            <!--end::User-->
            <!--begin::Contact-->
            <div class="py-9">
              <div
                class="d-flex align-items-center justify-content-between mb-2"
              >
                <span class="font-weight-bold mr-2">Email:</span>
                <a class="text-muted text-hover-primary">
                  {{ user.email }}
                </a>
              </div>
              <div
                class="d-flex align-items-center justify-content-between mb-2"
              >
                <span class="font-weight-bold mr-2">Phone:</span>
                <span class="text-muted">
                  {{ user.phone_number }}
                </span>
              </div>
            </div>

            <div
              class="navi navi-bold navi-hover navi-active navi-link-rounded"
              role="tablist"
            >
              <div class="navi-item mb-2">
                <a
                  class="navi-link py-4 active"
                  @click="setActiveTab"
                  style="cursor:pointer"
                  data-tab="0"
                  data-toggle="tab"
                  role="tab"
                  aria-selected="false"
                >
                  <span class="navi-icon mr-2">
                    <span class="svg-icon">
                      <inline-svg src="media/svg/icons/General/User.svg" />
                    </span>
                  </span>
                  <span class="navi-text font-size-lg"
                    >Personal Information</span
                  >
                </a>
              </div>
              <div class="navi-item mb-2">
                <a
                  class="navi-link py-4"
                  @click="setActiveTab"
                  style="cursor:pointer"
                  data-tab="1"
                  data-toggle="tab"
                  role="tab"
                  aria-selected="false"
                >
                  <span class="navi-icon mr-2">
                    <span class="svg-icon">
                      <inline-svg
                        src="media/svg/icons/Communication/Shield-user.svg"
                      />
                    </span>
                  </span>
                  <span class="navi-text font-size-lg">Change Password</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--begin::Content-->
      <div class="flex-row-fluid ml-lg-8">
        <b-tabs class="hide-tabs" v-model="tabIndex">
          <b-tab active>
            <PersonalInformation></PersonalInformation>
          </b-tab>

          <b-tab>
            <ChangePassword></ChangePassword>
          </b-tab>
        </b-tabs>
      </div>
      <!--end::Content-->
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import PersonalInformation from "@/view/pages/profile/PersonalInformation";
import ChangePassword from "@/view/pages/profile/ChangePassword";

export default {
  name: "profile-overview",
  components: {
    PersonalInformation,
    ChangePassword
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Profile" }]);
  },
  methods: {
    /**
     * Set current active on click
     * @param event
     */
    setActiveTab(event) {
      let target = event.target;
      if (!event.target.classList.contains("navi-link")) {
        target = event.target.closest(".navi-link");
      }

      const tab = target.closest('[role="tablist"]');
      const links = tab.querySelectorAll(".navi-link");
      // remove active tab links
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
      }

      // set clicked tab index to bootstrap tab
      this.tabIndex = parseInt(target.getAttribute("data-tab"));

      // set current active tab
      target.classList.add("active");
    }
  },
  computed: {
    ...mapGetters({
      user: "currentUser"
    })
  }
};
</script>
