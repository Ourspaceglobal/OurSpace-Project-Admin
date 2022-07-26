<template>
  <!--begin::Card-->
  <div class="card card-custom">
    <!--begin::Header-->
    <div class="card-header py-3">
      <div class="card-title align-items-start flex-column">
        <h3 class="card-label font-weight-bolder text-dark">
          Personal Information
        </h3>
        <span class="text-muted font-weight-bold font-size-sm mt-1">
          Update your personal informaiton
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
      <!--begin::Body-->
      <div class="card-body">
        <alert-error :form="form" :message="form.errors.error"></alert-error>

        <div class="row">
          <label class="col-xl-3"></label>
          <div class="col-lg-9 col-xl-6">
            <h5 class="font-weight-bold mb-6">User Info</h5>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            Avatar
          </label>
          <div class="col-lg-9 col-xl-6">
            <div class="image-input image-input-outline" id="kt_profile_avatar">
              <div
                class="image-input-wrapper"
                :style="{ backgroundImage: `url(${current_photo})` }"
              ></div>
              <label
                class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                data-action="change"
                data-toggle="tooltip"
                title=""
                data-original-title="Change avatar"
              >
                <i class="fa fa-pen icon-sm text-muted"></i>
                <input
                  type="file"
                  name="avatar"
                  accept=".png, .jpg, .jpeg"
                  @change="onFileChange($event)"
                />
              </label>
            </div>
            <span class="form-text text-muted">
              Allowed file types: png, jpg, jpeg.
            </span>
            <div v-if="avatarForm.progress">
              Progress: {{ avatarForm.progress.percentage }}%
            </div>
            <has-error :form="avatarForm" field="avatar"></has-error>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            First Name
          </label>
          <div class="col-lg-9 col-xl-6">
            <input
              class="form-control form-control-lg form-control-solid"
              type="text"
              v-model="form.first_name"
              :class="{ 'is-invalid': form.errors.has('first_name') }"
              required
            />
            <has-error :form="form" field="first_name"></has-error>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            Last Name
          </label>
          <div class="col-lg-9 col-xl-6">
            <input
              class="form-control form-control-lg form-control-solid"
              type="text"
              v-model="form.last_name"
              :class="{ 'is-invalid': form.errors.has('last_name') }"
              required
            />
            <has-error :form="form" field="last_name"></has-error>
          </div>
        </div>
        <div class="row">
          <label class="col-xl-3"></label>
          <div class="col-lg-9 col-xl-6">
            <h5 class="font-weight-bold mt-10 mb-6">Contact Info</h5>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            Contact Phone
          </label>
          <div class="col-lg-9 col-xl-6">
            <div class="input-group input-group-lg input-group-solid">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="la la-phone"></i>
                </span>
              </div>
              <input
                type="tel"
                class="form-control form-control-lg form-control-solid"
                placeholder="Phone"
                v-model="form.phone_number"
                :class="{ 'is-invalid': form.errors.has('phone_number') }"
                required
              />
            </div>
            <has-error :form="form" field="phone_number"></has-error>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label text-right">
            Email Address
          </label>
          <div class="col-lg-9 col-xl-6">
            <div class="input-group input-group-lg input-group-solid">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="la la-at"></i>
                </span>
              </div>
              <input
                type="email"
                class="form-control form-control-lg form-control-solid"
                placeholder="Email"
                v-model="form.email"
                :class="{ 'is-invalid': form.errors.has('email') }"
                required
              />
            </div>
            <has-error :form="form" field="email"></has-error>
          </div>
        </div>
      </div>
      <!--end::Body-->
    </form>
    <!--end::Form-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { UPDATE_PERSONAL_INFO } from "@/core/services/store/profile.module";
import { UPDATE_PERSONAL_AVATAR } from "@/core/services/store/profile.module";

export default {
  name: "PersonalInformation",
  data() {
    return {
      current_photo: null,
      form: new this.$Form({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        callbackUrl: ""
      }),
      avatarForm: new this.$Form({
        avatar: null
      })
    };
  },
  mounted() {
    this.setupProfile();
  },
  methods: {
    save() {
      this.form.callbackUrl = process.env.VUE_APP_APP_URL + "dashboard";

      this.$store.dispatch(UPDATE_PERSONAL_INFO, this.form).then(() => {
        this.form.reset();

        setTimeout(() => this.setupProfile(), 500);
      });
    },
    cancel() {
      this.form.reset();
      this.setupProfile();
    },
    onFileChange(e) {
      const file = e.target.files[0];

      if (typeof FileReader === "function") {
        const reader = new FileReader();

        reader.onload = event => {
          this.current_photo = event.target.result;
        };

        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }

      this.avatarForm.avatar = file;

      this.$store.dispatch(UPDATE_PERSONAL_AVATAR, this.avatarForm).then(() => {
        this.avatarForm.reset();

        setTimeout(() => this.setupProfile(), 500);
      });
    },
    setupProfile() {
      this.current_photo = this.user.avatar;
      this.form.fill(this.user);
    }
  },
  computed: {
    ...mapGetters({
      user: "currentUser"
    })
  }
};
</script>
