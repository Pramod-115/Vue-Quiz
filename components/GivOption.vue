<script setup>
    
    const props = defineProps(['selectid', 'name'])
</script>

<template>
    <option :value="selectid">{{name}}</option>
</template>