<script setup>
import Profile from './components/Profile.vue';
</script>

<template>
 
  <Profile></Profile>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.logo.blocklet:hover {
  filter: drop-shadow(0 0 2em #22cdcdaa);
}
</style>
