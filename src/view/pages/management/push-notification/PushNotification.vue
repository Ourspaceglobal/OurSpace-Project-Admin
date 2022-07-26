<template>
  <div class="card card-custom">
    <div class="card-body p-0">
      <div class="mb-3">
        <b-alert variant="dark" v-if="pushNotification" show>
          <b>You are editing</b>
        </b-alert>
        <alert-errors :form="form">
          There were some problems with your input.
        </alert-errors>
      </div>

      <div
        class="wizard wizard-1"
        id="push_notification"
        data-wizard-state="step-first"
        data-wizard-clickable="true"
      >
        <div class="wizard-nav border-bottom">
          <div class="wizard-steps p-8 p-lg-10">
            <div
              class="wizard-step"
              data-wizard-type="step"
              data-wizard-state="current"
            >
              <div class="wizard-label">
                <b-icon icon="vector-pen" class="wizard-icon"></b-icon>
                <h3 class="wizard-title">1. Compose Message</h3>
              </div>
              <i class="wizard-arrow flaticon2-next"></i>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <b-icon icon="people" class="wizard-icon"></b-icon>
                <h3 class="wizard-title">2. Choose Users</h3>
              </div>
              <i class="wizard-arrow flaticon2-next"></i>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <b-icon icon="gear-wide-connected" class="wizard-icon"></b-icon>
                <h3 class="wizard-title">3. Configure Settings</h3>
              </div>
              <i class="wizard-arrow flaticon2-next"></i>
            </div>
            <div class="wizard-step" data-wizard-type="step">
              <div class="wizard-label">
                <b-icon icon="journal-album" class="wizard-icon"></b-icon>
                <h3 class="wizard-title">4. Review and Submit</h3>
              </div>
              <i class="wizard-arrow last flaticon2-next"></i>
            </div>
          </div>
        </div>

        <div class="row justify-content-center my-10 px-8 my-lg-15 px-lg-10">
          <div class="col-xl-12 col-xxl-7">
            <b-form
              @submit.stop.prevent="!form.id ? save() : update()"
              @keydown="form.onKeydown($event)"
            >
              <div
                class="pb-5"
                data-wizard-type="step-content"
                data-wizard-state="current"
              >
                <h3 class="mb-10 font-weight-bold text-dark">
                  Write the message
                </h3>
                <b-form-group label="Subject">
                  <b-form-input
                    type="text"
                    v-model="form.subject"
                    placeholder="Enter the subject"
                    :class="{ 'is-invalid': form.errors.has('reason') }"
                    required
                  ></b-form-input>
                  <has-error :form="form" field="reason"></has-error>
                </b-form-group>

                <b-form-group label="Body">
                  <editor
                    :api-key="apiKey"
                    :init="editorInit"
                    v-model="form.message"
                  ></editor>
                  <has-error :form="form" field="message"></has-error>
                </b-form-group>
              </div>

              <div class="pb-5" data-wizard-type="step-content">
                <h4 class="mb-10 font-weight-bold text-dark">
                  Choose the users to send to
                </h4>

                <b-form-checkbox
                  v-model="selectedAll"
                  @change="selectAllUsers"
                  size="lg"
                >
                  Select All
                </b-form-checkbox>

                <div v-if="form.user_ids[0] !== '*'">
                  <b-table
                    id="users-table"
                    :items="users"
                    :fields="userFields"
                    :busy="isUsersListBusy"
                    bordered
                    responsive
                  >
                    <template #table-busy>
                      <div class="text-center text-info my-2">
                        <b-spinner class="align-middle mr-3"></b-spinner>
                        <strong>Loading...</strong>
                      </div>
                    </template>

                    <template #cell(index)="data">
                      <b-form-checkbox
                        v-model="form.user_ids"
                        :value="data.item.id"
                        size="lg"
                      ></b-form-checkbox>
                    </template>
                  </b-table>

                  <b-pagination-nav
                    v-if="userList && userList.data"
                    :link-gen="linkGen"
                    :number-of-pages="userList.last_page"
                    first-text="First"
                    prev-text="Prev"
                    next-text="Next"
                    last-text="Last"
                    limit="10"
                    last-number
                    use-router
                  ></b-pagination-nav>
                </div>
              </div>

              <div class="pb-5" data-wizard-type="step-content">
                <h4 class="mb-10 font-weight-bold text-dark">
                  Configure the sending settings
                </h4>

                <b-form-group label="">
                  <b-form-checkbox
                    v-model="form.send_via_mail"
                    unchecked-value="0"
                    value="1"
                    switch
                  >
                    Send via Email
                  </b-form-checkbox>
                </b-form-group>

                <b-form-group label="">
                  <b-form-checkbox
                    v-model="form.send_via_system"
                    unchecked-value="0"
                    value="1"
                    switch
                  >
                    Send as system notification
                  </b-form-checkbox>
                </b-form-group>

                <b-form-group label="Send At">
                  <b-form-input
                    type="datetime-local"
                    v-model="form.send_at"
                    required
                  ></b-form-input>
                </b-form-group>
              </div>
              <!--end: Wizard Step 3-->

              <!--begin: Wizard Step 4-->
              <div class="pb-5" data-wizard-type="step-content">
                <h4 class="mb-10 font-weight-bold text-dark">
                  Review your Message and Submit
                </h4>
                <div class="border-bottom mb-5 pb-5">
                  <h5 class="mb-3">
                    Subject
                  </h5>
                  <div class="line-height-md">
                    {{ form.subject }}
                  </div>
                </div>
                <div class="border-bottom mb-5 pb-5">
                  <h5 class="mb-3">
                    Message
                  </h5>
                  <div class="line-height-md">
                    <span v-html="form.message"></span>
                  </div>
                </div>
                <div class="border-bottom mb-5 pb-5">
                  <h5 class="mb-3">
                    Users
                  </h5>
                  <div class="line-height-md">
                    {{
                      form.user_ids[0] === "*"
                        ? "All Tenants & Landlords"
                        : form.user_ids.length
                    }}
                  </div>
                </div>
                <div class="mb-5 pb-5">
                  <h5 class="mb-3">
                    Settings
                  </h5>
                  <div class="line-height-md">
                    <p>
                      Send via mail: {{ form.send_via_mail ? "Yes" : "No" }}
                    </p>
                    <p>
                      Send through system:
                      {{ form.send_via_system ? "Yes" : "No" }}
                    </p>
                    <p>
                      Send date &amp; time:
                      {{ $root.getReadableDate(form.send_at) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between border-top pt-10">
                <div class="mr-2">
                  <button
                    class="btn btn-light-primary font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-prev"
                  >
                    Previous
                  </button>
                </div>
                <div>
                  <button
                    @click="!form.id ? save() : update()"
                    class="btn btn-success font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-submit"
                  >
                    Submit
                  </button>
                  <button
                    class="btn btn-primary font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-next"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </b-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/sass/pages/wizard/wizard-1.scss";
</style>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import KTUtil from "@/assets/js/components/util";
import KTWizard from "@/assets/js/components/wizard";
import Editor from "@tinymce/tinymce-vue";
import {
  SHOW,
  STORE,
  UPDATE
} from "@/core/services/store/pushnotification.module";
import { FETCH_ALL as FETCH_USERS } from "@/core/services/store/user.module";
import { mapGetters } from "vuex";
import pagination from "@/core/mixins/pagination";

export default {
  name: "new-push-notifications",
  props: ["push_notification"],
  mixins: [pagination],
  data() {
    return {
      isUsersListBusy: false,
      editorInit: {
        height: 600,
        menubar: "file edit view insert format tools table help",
        plugins: [
          "print preview paste importcss searchreplace autolink autosave save directionality",
          "code visualblocks visualchars fullscreen image link media codesample table",
          "charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount",
          "imagetools textpattern noneditable help charmap emoticons"
        ],
        toolbar:
          "undo redo | bold italic underline strikethrough | fontselect fontsizeselect \
          formatselect | alignleft aligncenter alignright alignjustify | outdent indent | \
          numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | \
          fullscreen  preview save print | insertfile image media link anchor codesample \
          | ltr rtl",
        toolbar_sticky: true,
        image_advtab: true,
        image_caption: true,
        quickbars_selection_toolbar:
          "bold italic | quicklink h2 h3 blockquote quickimage quicktable"
      },
      apiKey: process.env.VUE_APP_TINYMCE_API_KEY,
      form: new this.$Form({
        id: "",
        subject: "",
        message: "",
        send_via_mail: 1,
        send_via_system: 0,
        send_at: "",
        user_ids: []
      }),
      selectedAll: false,
      userFields: [
        {
          key: "index",
          label: "#"
        },
        {
          key: "full_name",
          label: "Name"
        },
        {
          key: "email",
          label: "Email address"
        },
        {
          key: "phone_number",
          label: "Phone number"
        }
      ],
      query: "per_page=100"
    };
  },
  components: {
    editor: Editor
  },
  computed: {
    ...mapGetters({
      userList: "getUsers",
      pushNotification: "getPushNotification"
    }),
    users() {
      return this.userList.data;
    }
  },
  methods: {
    preparePushNotificationForUpdate() {
      if (this.pushNotification) {
        this.fillForm();
      }

      this.$store
        .dispatch(SHOW, this.push_notification)
        .then(() => this.fillForm());
    },
    fillForm() {
      this.form.fill({
        id: this.pushNotification.id,
        subject: this.pushNotification.subject,
        message: this.pushNotification.message,
        send_via_mail: this.pushNotification.send_via_mail ? 1 : 0,
        send_via_system: this.pushNotification.send_via_system ? 1 : 0,
        send_at: this.$root.getReadableDate(
          this.pushNotification.send_at,
          "YYYY-MM-DDTHH:mm"
        ),
        user_ids: this.pushNotification.user_ids
      });
      this.selectedAll = this.form.user_ids[0] === "*";
    },
    fetchAll() {
      this.isUsersListBusy = true;

      this.$store.dispatch(FETCH_USERS, this.query).finally(() => {
        this.isUsersListBusy = false;
      });
    },
    save() {
      this.$store.dispatch(STORE, this.form).then(response => {
        this.form.reset();
        this.$bvModal
          .msgBoxOk(response.data.message, {
            title: "",
            size: "sm",
            buttonSize: "sm",
            okVariant: "success",
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            centered: true
          })
          .then(() => {
            this.$router.push({ name: "manage-push-notifications" });
          });
      });
    },
    update() {
      this.$store.dispatch(UPDATE, this.form).then(response => {
        this.form.reset();
        this.$bvModal
          .msgBoxOk(response.data.message, {
            title: "",
            size: "sm",
            buttonSize: "sm",
            okVariant: "success",
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            centered: true
          })
          .then(() => {
            this.$router.push({ name: "manage-push-notifications" });
          });
      });
    },
    selectAllUsers() {
      if (this.selectedAll) {
        this.form.user_ids = ["*"];
      } else {
        this.form.user_ids = [];
      }
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      {
        title: "Push Notifications",
        route: {
          name: "manage-push-notifications"
        }
      },
      {
        title: this.push_notification
          ? "Update Push Notification"
          : "Create Push Notification"
      }
    ]);

    this.fetchAll();

    if (this.push_notification) {
      this.preparePushNotificationForUpdate();
    }

    // Initialize form wizard
    const wizard = new KTWizard("push_notification", {
      startStep: 1, // initial active step number
      clickableSteps: true // allow step clicking
    });

    // Validation before going to next page
    wizard.on("beforeNext", function(/*wizardObj*/) {
      // validate the form and use below function to stop the wizard's step
      // wizardObj.stop();
    });

    // Change event
    wizard.on("change", function(/*wizardObj*/) {
      setTimeout(() => {
        KTUtil.scrollTop();
      }, 500);
    });
  }
};
</script>
