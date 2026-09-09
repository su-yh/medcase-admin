<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  to: {
    type: [String, Object],
    required: true
  }
})

const type = 'router-link'

function linkProps() {
  return { to: props.to }
}
</script>
