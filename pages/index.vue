<script setup>
    const { data, pending, error, refresh } = await useAsyncData(
        'category',
        () => $fetch('https://opentdb.com/api_category.php')
    )
    const router = useRouter()
    const formData = useState('fData', () => {
        return {
            category: 'any',
            difficulty: 'any',
            amount: 10
        }
    })

    const toQuiz = () => {
        return navigateTo({
            path: '/quiz',
            query: {
            category: formData.value.category,
            difficulty: formData.value.difficulty,
            amount: formData.value.amount,
            type: "multiple"
            }
        })
    }
</script>

<template>
    <div class="homepageWrapper">
        <form>
            <div class="section mx-5">
                <label for="category" class="mb-3 block">Choose a Category</label>
                <select name="name" id="category" class="mb-1 block" v-model="formData.category">
                    <option value="any" selected>Any</option>
                    <GivOption v-for="cato in data.trivia_categories" :key="cato.id" :selectid="cato.id"
                        :name="cato.name" />
                </select>
            </div>
            <div class="section mx-5">
                <label for="category" class="mb-3 block">Choose number of Questions</label>
                <select name="name" id="category" class="mb-1 block" v-model="formData.amount">
                    <option value="5">5</option>
                    <option value="10" selected>10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
            <div class="section mx-5">
                <label for="difficulty" class="mb-3 block">Choose difficulty</label>
                <select name="name" id="difficulty" class="mb-1 block" v-model="formData.difficulty">
                    <option value="any" selected>Any</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>
            <button @click.prevent="toQuiz">Start</button>
        </form>
    </div>
</template>

<style scoped>
.section {
    margin: 30px 0;
}
.homepageWrapper {
    margin: 70px 0;
}
select {
    padding: 5px 10px;
    background-color: #d2e9ff;
    border-radius: 10px;
}
select:focus {
    outline: none;
}
button {
        padding: 10px 40px;
        background-image: linear-gradient(to right, #4baeff, #ae85d8);
        font-weight: 500;
        border-radius: 10px;
        color: white;
}
/* label {
        margin-bottom: 20px;
    } */
</style>