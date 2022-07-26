<template>
  <div>
    <!--begin::Signin-->
    <div class="login-form login-signin">
      <div class="text-center mb-10 mb-lg-20">
        <h3 class="font-size-h1">Verify Two-Factor Authentication</h3>
        <p class="text-muted font-weight-semi-bold">
          Enter your 2FA code
        </p>
      </div>

      <!--begin::Form-->
      <div
        class="alert fade show"
        :class="
          requestAnotherTokenMessage.includes('wrong')
            ? 'alert-warning'
            : 'alert-success'
        "
        role="alert"
        v-if="requestAnotherTokenMessage !== ''"
      >
        {{ requestAnotherTokenMessage }}
      </div>

      <b-form
        class="form"
        @submit.stop.prevent="onSubmit"
        @keydown="form.onKeydown($event)"
      >
        <alert-error :form="form" :message="form.errors.error"></alert-error>

        <b-form-group label="" label-for="code">
          <b-form-input
            class="form-control form-control-solid h-auto py-5 px-6"
            id="code"
            name="code"
            type="text"
            v-model="form.code"
            :class="{ 'is-invalid': form.errors.has('code') }"
            placeholder="Enter the secure 2FA code you received"
            autofocus
          ></b-form-input>

          <has-error :form="form" field="code"></has-error>
        </b-form-group>

        <!--begin::Action-->
        <div
          class="form-group d-flex flex-wrap justify-content-between align-items-center"
        >
          <FormButton
            :form="form"
            class="btn btn-primary font-weight-bold px-9 py-4 my-3 font-size-3"
          >
            Continue
          </FormButton>
        </div>
        <!--end::Action-->
      </b-form>
      <!--end::Form-->

      <button
        type="button"
        class="btn btn-sm btn-link mb-2 mb-md-0"
        @click="logout"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-sm btn-link mb-2 mb-md-0"
        @click="requestAnotherToken"
        :disabled="!canRequestAnotherToken"
      >
        Request another token
      </button>
    </div>
    <!--end::Signin-->
  </div>
</template>

<script>
import {
  LOGOUT,
  VERIFY_2FA,
  REQUEST_2FA_CODE
} from "@/core/services/store/auth.module";

export default {
  name: "verify",
  data() {
    return {
      form: new this.$Form({
        code: ""
      }),
      canRequestAnotherToken: false,
      requestAnotherTokenMessage: ""
    };
  },
  methods: {
    onSubmit() {
      this.$store.dispatch(VERIFY_2FA, this.form).then(() => {
        this.$router.push({
          name: "dashboard"
        });
      });
    },
    requestAnotherToken() {
      this.$store
        .dispatch(REQUEST_2FA_CODE)
        .then(() => {
          // Reset button enablement
          this.canRequestAnotherToken = false;
          this.enableButtonForNewTokenRequest();

          this.requestAnotherTokenMessage =
            "We have emailed you another verification token.";
        })
        .catch(() => {
          this.requestAnotherTokenMessage =
            "Something went wrong while requesting for another token";
        });
    },
    enableButtonForNewTokenRequest() {
      setTimeout(() => {
        this.canRequestAnotherToken = true;
      }, 20000);
    },
    logout() {
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push({ name: "login" });
      });
    }
  },
  mounted() {
    this.enableButtonForNewTokenRequest();
  }
};
</script>
