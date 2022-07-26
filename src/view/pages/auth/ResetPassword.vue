<template>
  <div>
    <div class="login-form login-signin">
      <div class="text-center mb-10 mb-lg-20">
        <h3 class="font-size-h1">Reset password</h3>
        <p class="text-muted font-weight-semi-bold">
          Reset your password
        </p>
      </div>

      <!--begin::Form-->
      <b-form
        class="form"
        @submit.stop.prevent="onSubmit"
        @keydown="form.onKeydown($event)"
      >
        <alert-error :form="form" :message="form.errors.error"></alert-error>

        <b-form-group label="" label-for="email">
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6"
            id="email"
            name="email"
            type="email"
            v-model="form.email"
            :class="{ 'is-invalid': form.errors.has('email') }"
            readonly
          ></b-form-input>
        </b-form-group>

        <b-form-group label="" label-for="password">
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6"
            id="password"
            name="password"
            type="password"
            v-model="form.password"
            :class="{ 'is-invalid': form.errors.has('password') }"
            placeholder="Enter your new password"
            required
          ></b-form-input>

          <has-error :form="form" field="password"></has-error>
        </b-form-group>

        <b-form-group label="" label-for="password_confirmation">
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6"
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            v-model="form.password_confirmation"
            :class="{ 'is-invalid': form.errors.has('password_confirmation') }"
            placeholder="Confirm your new password"
            required
          ></b-form-input>

          <has-error :form="form" field="password_confirmation"></has-error>
        </b-form-group>

        <!--begin::Action-->
        <div
          class="form-group d-flex flex-wrap justify-content-between align-items-center"
        >
          <router-link
            :to="{ name: 'login' }"
            class="text-dark-60 text-hover-primary my-3 mr-2"
          >
            Go to login
          </router-link>
          <FormButton
            :form="form"
            class="btn btn-primary font-weight-bold px-9 py-4 my-3 font-size-3"
          >
            Reset
          </FormButton>
        </div>
        <!--end::Action-->
      </b-form>
      <!--end::Form-->
    </div>
  </div>
</template>

<script>
import { RESETPASSWORD } from "@/core/services/store/auth.module";

export default {
  name: "reset-password",
  data() {
    return {
      form: new this.$Form({
        email: "",
        token: "",
        password: "",
        password_confirmation: "",
        callbackUrl: ""
      })
    };
  },
  methods: {
    onSubmit() {
      this.$store.dispatch(RESETPASSWORD, this.form).then(() => {
        this.$router.push({ name: "login" });
      });
    }
  },
  mounted() {
    let token = this.$route.query.token;
    let email = this.$route.query.email;

    if (token && email) {
      this.form.fill({
        token: token,
        email: email,
        callbackUrl: process.env.VUE_APP_APP_URL + "forgot-password"
      });
    } else {
      this.$router.push({
        name: "forgot-password"
      });
    }
  }
};
</script>
