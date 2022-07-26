<template>
  <transition name="fade-in-up">
    <router-view :key="this.$route.fullPath"></router-view>
  </transition>
</template>
