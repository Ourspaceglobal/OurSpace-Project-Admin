<template>
  <div class="mb-2" v-if="comment">
    <div
      class="
        mb-1
        font-weight-bold
        d-flex
        align-items-center
        justify-content-between
      "
    >
      <div>
        <img
          :src="comment.user.avatar"
          :alt="comment.user.first_name"
          width="30"
        />
        {{ comment.user.full_name }}

        <span class="mt-1 mb-0 text-gray small" style="font-weight: normal">
          {{ $root.getReadableDate(comment.updated_at) }}
        </span>
      </div>

      <div>
        <a
          href="javascript:void(0);"
          @click.prevent="toggleApproval(comment)"
          class="badge"
          :class="comment.is_approved ? 'badge-danger' : 'badge-primary'"
        >
          {{ comment.is_approved ? "disa" : "a" }}pprove
        </a>
      </div>
    </div>

    <div class="mb-3">
      <p class="mb-2">{{ comment.comment }}</p>

      <div v-if="comment.replies_count">
        <a
          href="javascript:void(0);"
          @click.prevent="loadReplies(comment.id)"
          v-if="replies.length < 1"
          class="small text-gray text-danger"
        >
          Load ({{ comment.replies_count }}) repl{{
            comment.replies_count > 1 ? "ies" : "y"
          }}
        </a>

        <div class="comment" v-for="comment in replies" :key="comment.id">
          <post-comments :comment="comment"></post-comments>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { SET_ERROR, SHOW } from "@/core/services/store/blog/post.module";

export default {
  name: "PostComment",
  props: {
    comment: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      replies: []
    };
  },
  components: {
    "post-comments": () => import("@/view/pages/blog/components/PostComment")
  },
  methods: {
    loadReplies(commentId) {
      ApiService.get(`/admin/comments/${commentId}/replies`)
        .then(response => {
          this.replies = response.data.data.comments;
        })
        .catch(error => {
          this.$store.commit(SET_ERROR, {
            error: error.response
          });
        });
    },
    toggleApproval(comment) {
      ApiService.patch(`/admin/comments/${comment.id}/approval`)
        .then(response => {
          if (comment.parent_id) {
            this.$parent.loadReplies(comment.parent_id);
          } else {
            this.$store.dispatch(SHOW, comment.model_id);
          }

          this.$bvModal.msgBoxOk(response.data.message, {
            title: "Confirmation",
            size: "sm",
            buttonSize: "sm",
            okVariant: "success",
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            centered: true
          });
        })
        .catch(error => {
          this.$store.commit(SET_ERROR, {
            error: error.response
          });
        });
    }
  }
};
</script>
