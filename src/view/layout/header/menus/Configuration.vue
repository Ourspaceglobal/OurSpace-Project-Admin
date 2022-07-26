<template>
  <ul class="menu-nav">
    <li
      aria-haspopup="true"
      data-menu-toggle="click"
      class="menu-item menu-item-submenu menu-item-open-dropdown"
      v-bind:class="{ 'menu-item-active': hasActiveChildren('/locations') }"
      v-if="
        $root.permitted('manage states') ||
          $root.permitted('manage cities') ||
          $root.permitted('manage local governments')
      "
    >
      <a href="#" class="menu-link menu-toggle">
        <span class="menu-text"> Locations </span>
        <i class="menu-arrow"></i>
      </a>
      <div class="menu-submenu menu-submenu-classic">
        <ul class="menu-subnav">
          <router-link
            :to="{ name: 'config-states' }"
            v-slot="{ href, navigate, isActive, isExactActive }"
            v-if="$root.permitted('manage states')"
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
                <i class="menu-bullet menu-bullet-line"><span></span></i>
                <span class="menu-text"> States </span>
              </a>
            </li>
          </router-link>

          <router-link
            :to="{ name: 'config-cities' }"
            v-slot="{ href, navigate, isActive, isExactActive }"
            v-if="$root.permitted('manage cities')"
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
                <i class="menu-bullet menu-bullet-line"><span></span></i>
                <span class="menu-text"> Cities </span>
              </a>
            </li>
          </router-link>

          <router-link
            :to="{ name: 'config-local-governments' }"
            v-slot="{ href, navigate, isActive, isExactActive }"
            v-if="$root.permitted('manage local governments')"
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
                <i class="menu-bullet menu-bullet-line"><span></span></i>
                <span class="menu-text"> Local Governments </span>
              </a>
            </li>
          </router-link>
        </ul>
      </div>
    </li>

    <router-link
      :to="{ name: 'config-categories' }"
      v-slot="{ href, navigate, isActive, isExactActive }"
      v-if="$root.permitted('manage categories')"
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
          <span class="menu-text"> Categories </span>
        </a>
      </li>
    </router-link>

    <router-link
      :to="{ name: 'config-sub-categories' }"
      v-slot="{ href, navigate, isActive, isExactActive }"
      v-if="$root.permitted('manage sub-categories')"
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
          <span class="menu-text"> Sub-categories </span>
        </a>
      </li>
    </router-link>

    <router-link
      :to="{ name: 'config-amenities' }"
      v-slot="{ href, navigate, isActive, isExactActive }"
      v-if="$root.permitted('manage amenities')"
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
          <span class="menu-text"> Amenities </span>
        </a>
      </li>
    </router-link>

    <router-link
      :to="{ name: 'config-system-data' }"
      v-slot="{ href, navigate, isActive, isExactActive }"
      v-if="$root.permitted('manage system data')"
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
          <span class="menu-text"> System Data </span>
        </a>
      </li>
    </router-link>

    <li
      aria-haspopup="true"
      data-menu-toggle="click"
      class="menu-item menu-item-submenu menu-item-open-dropdown"
      v-bind:class="{
        'menu-item-active': hasActiveChildren('/apartment-settings')
      }"
      v-if="
        $root.permitted('manage system apartment kycs') ||
          $root.permitted('manage apartment durations')
      "
    >
      <a href="#" class="menu-link menu-toggle">
        <span class="menu-text"> Apartment Settings </span>
        <i class="menu-arrow"></i>
      </a>
      <div class="menu-submenu menu-submenu-classic">
        <ul class="menu-subnav">
          <router-link
            :to="{ name: 'config-system-apartment-kycs' }"
            v-slot="{ href, navigate, isActive, isExactActive }"
            v-if="$root.permitted('manage system apartment kycs')"
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
                <i class="menu-bullet menu-bullet-line"><span></span></i>
                <span class="menu-text"> System Apartment KYCs </span>
              </a>
            </li>
          </router-link>

          <router-link
            :to="{ name: 'config-apartment-durations' }"
            v-slot="{ href, navigate, isActive, isExactActive }"
            v-if="$root.permitted('manage apartment durations')"
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
                <i class="menu-bullet menu-bullet-line"><span></span></i>
                <span class="menu-text"> Apartment Duration </span>
              </a>
            </li>
          </router-link>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "KTMenuConfiguration",
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    }
  }
};
</script>
