<template>
  <ul class="menu-nav">
    <router-link
      :to="{ name: 'new-post' }"
      v-slot="{ href, navigate, isActive, isExactActive }"
      custom
    >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active'
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <span class="menu-text"> Add New Post </span>
        </a>
      </li>
    </router-link>

    <router-link
      :to="{ name: 'manage-post' }"
      v-slot="{ href, navigate, isActive, isExactActive }"
      custom
    >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active'
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <span class="menu-text"> Manage Posts </span>
        </a>
      </li>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: "KTMenuBlog"
};
</script>
