<template>
  <div class="card card-custom card-stretch gutter-b" :class="extraClasses">
    <div class="card-body">
      <b-icon :icon="icon" font-scale="3x" variant="light"></b-icon>
      <span
        class="card-title font-weight-bolder text-white font-size-h2 mb-0 mt-6 d-block"
      >
        {{ value }}
      </span>
      <span class="font-weight-bold text-white font-size-sm">
        {{ title }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "simple-stat",
  props: {
    icon: {
      type: String,
      required: true
    },
    value: {
      required: true
    },
    title: {
      type: String,
      required: true
    },
    extraClasses: {
      type: String,
      required: false
    }
  }
};
</script>
