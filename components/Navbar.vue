<script setup>
const router = useRouter()

const goTo = (address)  => {
    router.push({ path: address })
}
</script>

<template>
    <div>
        <div class="container">
            <nav class="flex justify-between py-2 items-center">
                <img src="logo.png" alt="logo" class="w-15 cursor-pointer" @click="() => goTo('/')">
                <div class="links">
                    <ul class="flex text-lg font-medium">
                        <li class="mr-8 cursor-pointer" @click="() => goTo('/')">Home</li>
                        <li>Random Quiz</li>
                    </ul>
                </div>
                <img src="profile.svg" alt="profile" class="w-8">
            </nav>
        </div>
        <hr class="border-0 h-1 bg-slate-200 drop-shadow-md">
    </div>    
</template>

