<template>
  <div
    class="card card-custom bgi-no-repeat gutter-b card-stretch"
    style="background-position: right top; background-size: 30% auto; background-image: url(/media/svg/shapes/abstract-2.svg)"
  >
    <div class="card-body">
      <router-link
        :to="{ name: 'new-post', params: { post: post.slug } }"
        class="card-title font-weight-bold text-muted text-hover-primary font-size-h5"
      >
        {{ title }}
      </router-link>
      <div class="font-weight-bold text-success mt-9 mb-5">
        {{ $root.getReadableDate(post.created_at) }}
      </div>
      <p class="text-dark-75 font-weight-bolder font-size-h5 m-0">
        {{ post.title }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "detail-post",
  props: {
    title: {
      required: true
    },
    post: {
      required: true
    }
  }
};
</script>
