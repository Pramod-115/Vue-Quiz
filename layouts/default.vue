<template>
    <div>
        <Navbar/>

        <div class="container maincon">
            <slot />
        </div>
    </div>
</template>

<style scoped>
    .maincon {
        margin: 25px auto;
    }
</style>