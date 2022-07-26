<template>
  <form
    class="form"
    @submit.stop.prevent="!form.id ? save() : update()"
    @keydown="form.onKeydown($event)"
  >
    <b-alert variant="primary" v-if="myPost">
      You are editing {{ myPost.title }}
    </b-alert>

    <alert-success :form="form">Post saved successfully!</alert-success>

    <div class="row">
      <div class="col-md-4">
        <b-form-group label="Featured Image">
          <div class="image-input image-input-outline">
            <div
              class="image-input-wrapper"
              :style="{ backgroundImage: `url(${current_featured_image})` }"
            ></div>
            <label
              class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
              data-action="change"
              data-toggle="tooltip"
              data-original-title="Change featured image"
            >
              <i class="fa fa-pen icon-sm text-muted"></i>
              <input
                type="file"
                name="featured_image"
                accept=".png, .jpg, .jpeg"
                @change="onFileChange($event)"
              />
            </label>
          </div>
          <span class="form-text text-muted">
            Allowed file types: png, jpg, jpeg.
          </span>
          <has-error :form="form" field="featured_image"></has-error>
        </b-form-group>
      </div>
      <div class="col-md-8">
        <b-form-group label="Title">
          <b-form-input
            type="text"
            v-model="form.title"
            placeholder="Enter the title of the post"
            :class="{ 'is-invalid': form.errors.has('title') }"
            required
          ></b-form-input>
          <has-error :form="form" field="title"></has-error>
        </b-form-group>

        <b-form-group label="Highlight">
          <b-form-textarea
            v-model="form.highlight"
            placeholder="Enter a brief highlight of this post"
            rows="3"
            max-rows="6"
            maxlength="500"
            :class="{ 'is-invalid': form.errors.has('highlight') }"
            trim
            required
          ></b-form-textarea>
          <has-error :form="form" field="highlight"></has-error>
          <small class="text-muted">Max: 500 characters</small>
        </b-form-group>

        <b-form-group label="Body">
          <editor
            :api-key="apiKey"
            :init="editorInit"
            v-model="form.body"
          ></editor>
          <has-error :form="form" field="body"></has-error>
        </b-form-group>

        <b-form-group label="Tags">
          <b-form-tags
            v-model="form.tags"
            separator=";"
            tag-variant="primary"
            size="lg"
            placeholder="Enter new tags separated by semicolon"
            tag-pills
          ></b-form-tags>
          <has-error :form="form" field="tags"></has-error>
        </b-form-group>
      </div>
    </div>

    <b-button
      :variant="!form.id ? 'primary' : 'success'"
      :disabled="form.busy"
      @click="!form.id ? save() : update()"
      block
    >
      {{ !form.id ? "Save" : "Update" }}
    </b-button>
  </form>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { STORE, SHOW, UPDATE } from "@/core/services/store/blog/post.module";
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "Post",
  props: ["post"],
  data() {
    return {
      current_featured_image: null,
      form: new this.$Form({
        id: "",
        title: "",
        highlight: "",
        body: "",
        featured_image: null,
        tags: []
      }),
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
      apiKey: process.env.VUE_APP_TINYMCE_API_KEY
    };
  },
  components: {
    editor: Editor
  },
  computed: {
    ...mapGetters({
      myPost: "getPost"
    })
  },
  methods: {
    preparePostForUpdate() {
      if (this.myPost) {
        this.fillForm();
      }

      this.$store.dispatch(SHOW, this.post).then(() => this.fillForm());
    },
    fillForm() {
      this.form.fill({
        id: this.myPost.id,
        title: this.myPost.title,
        highlight: this.myPost.highlight,
        body: this.myPost.body,
        tags: this.myPost.tags.map(tag => tag.name)
      });
      this.current_featured_image = this.myPost.featured_image;
    },
    onFileChange(event) {
      const file = event.target.files[0];

      if (typeof FileReader === "function") {
        const reader = new FileReader();

        reader.onload = event => {
          this.current_featured_image = event.target.result;
        };

        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }

      this.form.featured_image = file;
    },
    save() {
      this.$store.dispatch(STORE, this.form).then(response => {
        this.$router
          .push({
            name: "new-post",
            params: { post: response.data.data.post.slug }
          })
          .catch(() => this.preparePostForUpdate());
      });
    },
    update() {
      this.$store.dispatch(UPDATE, this.form).then(response => {
        this.$router
          .push({
            name: "new-post",
            params: { post: response.data.data.post.slug }
          })
          .catch(() => this.preparePostForUpdate());
      });
    },
    reset() {
      this.form.reset();
      this.current_featured_image = null;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: this.post ? "Update Post" : "Create Post" }
    ]);

    if (this.post) {
      this.preparePostForUpdate();
    }
  }
};
</script>

<style lang="scss">
.image-input .image-input-wrapper {
  width: 250px;
  height: 350px;
}
</style>
