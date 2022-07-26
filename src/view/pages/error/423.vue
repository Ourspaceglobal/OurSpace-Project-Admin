<template>
  <div class="d-flex flex-column flex-root">
    <div
      class="d-flex flex-row-fluid flex-column bgi-size-cover bgi-position-center bgi-no-repeat p-10 p-sm-30"
      :style="{
        backgroundImage: `url(${backgroundImage})`
      }"
    >
      <h1
        class="font-size-sm-100 font-weight-boldest text-dark-75 mt-15"
        style="font-size: 150px;"
      >
        423
      </h1>
      <p class="font-size-h3 font-weight-light">
        Oops! Your account is blocked.<br />
        Please contact your super-admin.<br />
        <b-button
          variant="outline-dark"
          class="mt-1"
          :to="{ name: 'dashboard' }"
          size="sm"
        >
          Try Again
        </b-button>
        <b-button
          variant="outline-warning"
          class="mt-1 ml-3"
          size="sm"
          @click="onLogout"
        >
          Logout
        </b-button>
      </p>
    </div>
  </div>
</template>

<script>
import { LOGOUT } from "@/core/services/store/auth.module";

export default {
  name: "423",
  methods: {
    onLogout() {
      this.$store
        .dispatch(LOGOUT)
        .then(() => this.$router.push({ name: "login" }));
    }
  },
  computed: {
    backgroundImage() {
      return process.env.BASE_URL + "media/error/bg1.jpg";
    }
  }
};
</script>
