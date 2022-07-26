<template>
  <div class="d-flex flex-row">
    <b-modal id="post-data" v-if="myPost" size="xl" scrollable centered>
      <template #modal-header="{ close }">
        <h5>
          <b-button
            :href="
              blogsUrl + myPost.slug + '?secret=' + myPost.secret_key
            "
            target="_blank"
          >
            <b-icon icon="arrow-up-right-circle" class="mr-2"></b-icon>
            View Post on Main Website
          </b-button>
        </h5>
        <b-button
          type="button"
          aria-label="Close"
          class="close"
          @click="close()"
        >
          ×
        </b-button>
      </template>

      <h2>{{ myPost.title }}</h2>
      <p>{{ myPost.highlight }}</p>

      <div class="mt-5" v-if="myPost.comments.length">
        <h5 class="mb-3">Comments</h5>

        <div
          class="comment"
          :id="'comment' + comment.id"
          v-for="comment in myPost.comments"
          :key="comment.id"
        >
          <post-comments :comment="comment"></post-comments>
        </div>
      </div>
      <p class="text-info" v-else>There are no comments at the moment.</p>
    </b-modal>

    <!--begin::Content-->
    <div class="flex-row-fluid">
      <div class="card card-custom">
        <div class="card-body">
          <b-table
            id="posts-table"
            :items="posts"
            :fields="fields"
            :busy="isBusy"
            :tbody-tr-class="$root.bTableRowClass"
            @sort-changed="sortingChanged"
            no-local-sorting
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

            <template #cell(is_published)="data">
              <b-form-checkbox
                :checked="data.item.is_published"
                @change="togglePublicationStatus(data.item.id)"
                :disabled="data.item.deleted_at !== null"
                switch
              ></b-form-checkbox>
            </template>

            <template #cell(actions)="data">
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="View post"
                v-if="!data.item.deleted_at"
                @click="show(data.item)"
              >
                <b-icon icon="eye" variant="dark"></b-icon>
              </button>
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="Edit details"
                v-if="!data.item.deleted_at"
                @click="edit(data.item)"
              >
                <b-icon icon="pencil" variant="primary"></b-icon>
              </button>
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="Delete"
                v-if="!data.item.deleted_at"
                @click="destroy(data.item.id)"
              >
                <b-icon icon="trash" variant="danger"></b-icon>
              </button>
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="Restore"
                v-if="data.item.deleted_at"
                @click="restore(data.item.id)"
              >
                <b-icon icon="bootstrap-reboot" variant="success"></b-icon>
              </button>
            </template>
          </b-table>

          <b-pagination-nav
            v-if="postList && postList.data"
            :link-gen="linkGen"
            :number-of-pages="postList.last_page"
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
    </div>
    <!--end::Content-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import {
  FETCH_ALL,
  SHOW,
  SET_POST,
  TOGGLE_PUBLICATION_STATUS,
  DESTROY,
  RESTORE
} from "@/core/services/store/blog/post.module";
import pagination from "@/core/mixins/pagination";
import sorting from "@/core/mixins/sorting";

export default {
  name: "posts",
  mixins: [pagination, sorting],
  components: {
    "post-comments": () => import("@/view/pages/blog/components/PostComment")
  },
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
          label: "Title",
          sortable: true
        },
        {
          key: "admin.full_name",
          label: "Writer"
        },
        {
          key: "is_published",
          label: "Publication Status",
          sortable: true
        },
        {
          key: "comments_count",
          label: "Comments"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      query: "filter[trashed]=with&include=admin,commentsCount",
      blogsUrl: process.env.VUE_APP_WEB_BLOG_URL
    };
  },
  methods: {
    fetchAll() {
      this.isBusy = true;
      this.$store
        .dispatch(FETCH_ALL, this.query)
        .finally(() => (this.isBusy = false));
    },
    edit(post) {
      this.$store.commit(SET_POST, post);
      this.$router.push({ name: "new-post", params: { post: post.slug } });
    },
    show(post) {
      this.$store
        .dispatch(SHOW, post.slug)
        .then(() => this.$bvModal.show("post-data"));
    },
    togglePublicationStatus(id) {
      this.$store.dispatch(TOGGLE_PUBLICATION_STATUS, id).then(() => {
        this.fetchAll();
      });
    },
    destroy(id) {
      this.$store.dispatch(DESTROY, id).then(() => {
        this.fetchAll();
      });
    },
    restore(id) {
      this.$store.dispatch(RESTORE, id).then(() => {
        this.fetchAll();
      });
    }
  },
  computed: {
    ...mapGetters({
      postList: "getPosts",
      myPost: "getPost"
    }),
    posts() {
      return this.postList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Posts" }]);
  }
};
</script>

<style lang="scss">
.comment {
  border-left: 2px solid #bf0000;
  padding: 10px 0 5px 10px;
  border-bottom: 1px solid #000 !important;
}
</style>
