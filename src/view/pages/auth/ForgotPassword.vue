<template>
  <div>
    <!--begin::Signin-->
    <div class="login-form login-signin">
      <div class="text-center mb-10 mb-lg-20">
        <h3 class="font-size-h1">Forgot password</h3>
        <p class="text-muted font-weight-semi-bold">
          Enter your email and we will send a reset link to you.
        </p>
      </div>

      <!--begin::Form-->
      <b-form
        class="form"
        @submit.stop.prevent="onSubmit"
        @keydown="form.onKeydown($event)"
      >
        <alert-success :form="form"
          >We have emailed your password reset link!</alert-success
        >

        <b-form-group label="" label-for="email">
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6"
            id="email"
            name="email"
            type="email"
            v-model="form.email"
            :class="{ 'is-invalid': form.errors.has('email') }"
            placeholder="Enter your email address"
            autofocus
          ></b-form-input>

          <has-error :form="form" field="email"></has-error>
        </b-form-group>

        <!--begin::Action-->
        <div
          class="form-group d-flex flex-wrap justify-content-between align-items-center"
        >
          <router-link
            :to="{ name: 'login' }"
            class="text-dark-60 text-hover-primary my-3 mr-2"
          >
            Sign In?
          </router-link>
          <FormButton
            :form="form"
            class="btn btn-primary font-weight-bold px-9 py-4 my-3 font-size-3"
          >
            Send me a link
          </FormButton>
        </div>
        <!--end::Action-->
      </b-form>
      <!--end::Form-->
    </div>
    <!--end::Signin-->
  </div>
</template>

<script>
import { FORGOTPASSWORD } from "@/core/services/store/auth.module";

export default {
  name: "forgot-password",
  data() {
    return {
      form: new this.$Form({
        email: "",
        callbackUrl: process.env.VUE_APP_APP_URL + "reset-password"
      })
    };
  },
  methods: {
    onSubmit() {
      this.$store.dispatch(FORGOTPASSWORD, this.form).then(() => {
        this.form.reset();
      });
    }
  }
};
</script>
