<template>
  <div>
    <!-- begin::Sticky Toolbar -->
    <ul class="sticky-toolbar nav flex-column pl-2 pr-2 pt-3 pb-3 mt-4">
      <li v-b-tooltip.hover.left="'Dashboard'" class="mb-2 nav-item">
        <router-link
          :to="{ name: 'dashboard' }"
          class="btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary"
        >
          <i class="flaticon2-gear"></i>
        </router-link>
      </li>
      <li v-b-tooltip.hover.left="'My Notifications'" class="nav-item">
        <router-link
          :to="{ name: 'my-notifications' }"
          class="btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary"
        >
          <i class="flaticon2-bell"></i>
        </router-link>
      </li>
    </ul>
    <!-- end::Sticky Toolbar -->
  </div>
</template>

<script>
export default {
  name: "KTStickyToolbar"
};
</script>
