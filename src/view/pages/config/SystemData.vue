<template>
  <div class="d-flex flex-row">
    <b-modal id="system-data-form" @hide="reset()" centered>
      <template #modal-header="{ close }">
        <h5>{{ (!form.id ? "New" : "Update") + " System Data" }}</h5>
        <b-button
          type="button"
          aria-label="Close"
          class="close"
          @click="
            close();
            reset();
          "
        >
          ×
        </b-button>
      </template>

      <alert-success :form="form">
        System Data saved successfully!
      </alert-success>

      <form
        class="form"
        @submit.stop.prevent="update()"
        @keydown="form.onKeydown($event)"
      >
        <b-form-group :label="form.hint">
          <b-form-checkbox
            v-model="form.content"
            :class="{ 'is-invalid': form.errors.has('content') }"
            :unchecked-value="0"
            :value="1"
            v-if="current_datatype && current_datatype.name === 'boolean'"
            switch
          ></b-form-checkbox>
          <b-form-datepicker
            v-model="form.content"
            v-if="current_datatype && current_datatype.name === 'date'"
          ></b-form-datepicker>
          <b-form-datepicker
            v-model="form.content"
            :min="dateAfterToday"
            v-if="
              current_datatype && current_datatype.name === 'date_after_today'
            "
          ></b-form-datepicker>
          <b-form-datepicker
            v-model="form.content"
            :max="dateBeforeToday"
            v-if="
              current_datatype && current_datatype.name === 'date_before_today'
            "
          ></b-form-datepicker>
          <b-form-input
            v-model="form.content"
            type="datetime-local"
            v-if="current_datatype && current_datatype.name === 'datetime'"
          ></b-form-input>
          <input
            type="file"
            @change="onFileChange($event)"
            v-if="current_datatype && current_datatype.name === 'file'"
          />
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            @change="onFileChange($event)"
            v-if="current_datatype && current_datatype.name === 'image'"
          />
          <b-form-input
            v-model="form.content"
            type="number"
            v-if="current_datatype && current_datatype.name === 'integer'"
          ></b-form-input>
          <b-form-textarea
            v-model="form.content"
            placeholder="Enter something..."
            rows="10"
            max-rows="10"
            v-if="current_datatype && current_datatype.name === 'longtext'"
          ></b-form-textarea>
          <b-form-input
            v-model="form.content"
            type="number"
            min="0"
            max="100"
            v-if="current_datatype && current_datatype.name === 'percentage'"
          ></b-form-input>
          <b-form-input
            v-model="form.content"
            type="text"
            v-if="current_datatype && current_datatype.name === 'string'"
          ></b-form-input>
          <b-form-textarea
            v-model="form.content"
            placeholder="Enter something..."
            rows="3"
            max-rows="6"
            maxlength="2000"
            v-if="current_datatype && current_datatype.name === 'text'"
          ></b-form-textarea>
          <b-form-timepicker
            v-model="form.content"
            locale="en"
            show-seconds
            v-if="current_datatype && current_datatype.name === 'time'"
          ></b-form-timepicker>
          <b-form-input
            v-model="form.content"
            type="url"
            v-if="current_datatype && current_datatype.name === 'url'"
          ></b-form-input>
          <has-error :form="form" field="content"></has-error>
        </b-form-group>
      </form>

      <template #modal-footer="{ cancel }">
        <b-button
          size="sm"
          variant="danger"
          @click="
            cancel();
            reset();
          "
        >
          Cancel
        </b-button>
        <b-button
          size="sm"
          :variant="!form.id ? 'primary' : 'success'"
          :disabled="form.busy"
          @click="!form.id ? save() : update()"
        >
          {{ !form.id ? "Save" : "Update" }}
        </b-button>
      </template>
    </b-modal>

    <!--begin::Content-->
    <div class="flex-row-fluid">
      <b-card>
        <b-table
          id="system-data-table"
          :items="systemData"
          :fields="fields"
          :busy="isBusy"
          :tbody-tr-class="$root.bTableRowClass"
          bordered
          hover
          responsive
        >
          <template #table-busy>
            <div class="text-center text-info my-2">
              <b-spinner class="align-middle mr-3"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>

          <template #cell(index)="data">
            {{ data.index + 1 }}
          </template>

          <template #cell(title)="data">
            {{ data.item.title }}<br />
            <small class="text-primary">{{ data.item.hint }}</small>
          </template>

          <template #cell(actions)="data">
            <button
              class="btn btn-sm btn-clean btn-icon mr-2"
              title="Edit details"
              @click="edit(data.item)"
            >
              <b-icon icon="pencil" variant="primary"></b-icon>
            </button>
          </template>
        </b-table>
      </b-card>
    </div>
    <!--end::Content-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { FETCH_ALL, UPDATE } from "@/core/services/store/systemdata.module";

export default {
  name: "system-data",
  data() {
    return {
      isBusy: false,
      fields: [
        {
          key: "index",
          label: "#"
        },
        {
          key: "title",
          label: "Title"
        },
        {
          key: "content",
          label: "Content"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      form: new this.$Form({
        id: "",
        hint: "",
        content: null
      }),
      current_datatype: null
    };
  },
  methods: {
    fetchAll() {
      this.isBusy = true;
      this.$store.dispatch(FETCH_ALL).finally(() => (this.isBusy = false));
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.form.content = file;
    },
    edit(systemDatum) {
      this.form.fill(systemDatum);
      this.current_datatype = systemDatum.datatype;
      this.$bvModal.show("system-data-form");
    },
    update() {
      this.$store.dispatch(UPDATE, this.form).then(() => {
        this.reset();
        this.$bvModal.hide("system-data-form");
        this.fetchAll();
      });
    },
    reset() {
      this.form.reset();
      this.form.clear();
      this.current_datatype = null;
    }
  },
  computed: {
    ...mapGetters({
      systemData: "getSystemData"
    }),
    now() {
      return new Date();
    },
    today() {
      return new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        this.now.getDate()
      );
    },
    dateAfterToday() {
      let date = new Date(this.today);
      date.setDate(date.getDate() + 1);

      return date;
    },
    dateBeforeToday() {
      let date = new Date(this.today);
      date.setDate(date.getDate() - 1);

      return date;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "System Data" }]);
    this.fetchAll();
  }
};
</script>
