<template>
  <div class="card card-custom card-stretch gutter-b card-shadowless">
    <div class="card-header border-0">
      <h3 class="card-title font-weight-bolder text-dark">{{ title }}</h3>
      <!-- <div class="card-toolbar">
        <Dropdown5></Dropdown5>
      </div> -->
    </div>

    <div class="card-body pt-0" v-if="list && list.length">
      <template v-for="(item, i) in list">
        <div class="d-flex align-items-center flex-wrap mb-10" :key="i">
          <div class="symbol symbol-50 symbol-light mr-5">
            <span class="symbol-label">
              <img
                :src="item.avatar"
                class="h-50 align-self-center"
                alt="avatar"
              />
            </span>
          </div>

          <div class="d-flex flex-column flex-grow-1 mr-2">
            <span class="font-weight-bold text-dark-75 font-size-lg mb-1">
              {{ item.full_name }}
            </span>
            <span class="small text-muted font-weight-bold">{{
              item.email
            }}</span>
          </div>
          <span
            class="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder"
          >
            ₦{{ item.wallet_balance }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// import Dropdown5 from "@/view/content/dropdown/Dropdown5.vue";

export default {
  name: "user-trends",
  props: {
    title: {
      required: true,
      type: String
    },
    list: {
      required: true,
      type: Array
    }
  },
  components: {
    // Dropdown5
  }
};
</script>
