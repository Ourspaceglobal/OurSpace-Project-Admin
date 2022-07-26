<template>
  <div>
    <!--begin::Signin-->
    <div class="login-form login-signin">
      <div class="text-center mb-10 mb-lg-20">
        <h3 class="font-size-h1">Sign In</h3>
        <p class="text-muted font-weight-semi-bold">
          Enter your email and password to complete your sign in.
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
            placeholder="Enter your email address"
            autofocus
          ></b-form-input>

          <has-error :form="form" field="email"></has-error>
        </b-form-group>

        <b-form-group label="" label-for="password">
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6"
            type="password"
            id="password"
            name="password"
            v-model="form.password"
            :class="{ 'is-invalid': form.errors.has('password') }"
            placeholder="Enter your password"
          ></b-form-input>

          <has-error :form="form" field="password"></has-error>
        </b-form-group>

        <!--begin::Action-->
        <div
          class="form-group d-flex flex-wrap justify-content-between align-items-center"
        >
          <router-link
            :to="{ name: 'forgot-password' }"
            class="text-dark-60 text-hover-primary my-3 mr-2"
          >
            Forgot Password?
          </router-link>
          <FormButton
            :form="form"
            class="btn btn-primary font-weight-bold px-9 py-4 my-3 font-size-3"
          >
            Sign In
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
import { LOGIN } from "@/core/services/store/auth.module";

export default {
  name: "login",
  data() {
    return {
      form: new this.$Form({
        email: "",
        password: ""
      })
    };
  },
  methods: {
    onSubmit() {
      this.$store.dispatch(LOGIN, this.form).then(response => {
        this.$router.push({
          name: response.data?.data?.admin.is_2fa_active
            ? "verify"
            : "dashboard"
        });
      });
    }
  }
};
</script>
