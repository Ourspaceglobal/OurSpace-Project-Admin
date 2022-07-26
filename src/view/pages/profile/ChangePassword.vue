<template>
  <!--begin::Card-->
  <div class="card card-custom">
    <!--begin::Header-->
    <div class="card-header py-3">
      <div class="card-title align-items-start flex-column">
        <h3 class="card-label font-weight-bolder text-dark">Change Password</h3>
        <span class="text-muted font-weight-bold font-size-sm mt-1">
          Change your account password
        </span>
      </div>
      <div class="card-toolbar">
        <button
          type="submit"
          class="btn btn-success mr-2"
          @click="save()"
          ref="kt_save_changes"
        >
          Save Changes
        </button>
        <button type="reset" class="btn btn-secondary" @click="cancel()">
          Cancel
        </button>
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Form-->
    <form
      class="form"
      @submit.stop.prevent="onSubmit"
      @keydown="form.onKeydown($event)"
    >
      <div class="card-body">
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-alert">
            Current Password
          </label>
          <div class="col-lg-9 col-xl-6">
            <input
              type="password"
              class="form-control form-control-lg form-control-solid mb-2"
              placeholder="Current password"
              name="old_password"
              v-model="form.old_password"
              :class="{ 'is-invalid': form.errors.has('old_password') }"
              required
            />
            <has-error :form="form" field="old_password"></has-error>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-alert">
            New Password
          </label>
          <div class="col-lg-9 col-xl-6">
            <input
              type="password"
              class="form-control form-control-lg form-control-solid"
              placeholder="New password"
              name="new_password"
              v-model="form.new_password"
              :class="{ 'is-invalid': form.errors.has('new_password') }"
              required
            />
            <has-error :form="form" field="new_password"></has-error>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-alert">
            Verify Password
          </label>
          <div class="col-lg-9 col-xl-6">
            <input
              type="password"
              class="form-control form-control-lg form-control-solid"
              placeholder="Verify password"
              name="verify_password"
              v-model="form.new_password_confirmation"
              :class="{
                'is-invalid': form.errors.has('new_password_confirmation')
              }"
              required
            />
            <has-error
              :form="form"
              field="new_password_confirmation"
            ></has-error>
          </div>
        </div>
      </div>
    </form>
    <!--end::Form-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { UPDATE_PASSWORD } from "@/core/services/store/profile.module";

export default {
  name: "ChangePassword",
  data() {
    return {
      form: new this.$Form({
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
        callbackUrl: ""
      })
    };
  },
  methods: {
    save() {
      this.form.callbackUrl = process.env.VUE_APP_APP_URL + "forgot-password";

      this.$store
        .dispatch(UPDATE_PASSWORD, this.form)
        .then(() => this.form.reset());
    },
    cancel() {
      this.form.reset();
    }
  },
  computed: {
    ...mapGetters({
      user: "currentUser"
    })
  }
};
</script>
