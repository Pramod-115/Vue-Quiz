<script setup>
import { useQuizStore } from '@/stores/useQuizInfo.js'
const router = useRouter()
const route = useRoute()
const resultDom = ref(null)
const store = useQuizStore()

const { data, refresh } = await useAsyncData(
  `${route.query.category}+${route.query.difficulty}`,
  () => $fetch(`https://opentdb.com/api.php?${`amount=`+route.query.amount}&${'type=multiple'}${route.query.category == 'any' ? '' : `&category=${route.query.category}`}${route.query.difficulty === 'any' ? '' : `&difficulty=${route.query.difficulty}`}`)
)
const { data: categoryData } = await useAsyncData(
  `categoryData`,
  () => $fetch(`https://opentdb.com/api_category.php`)
)
store.onQuizStart(data.value.results, route.query.category, route.query.difficulty, route.query.amount)
const toHome = () => {
    router.push('/')
}
const onAnswerSubmit = (event, item) => {
    console.log(store.allData)
    if (store.disableOptions) return
    store.onAnswerSubmit(item)
    event.target.classList.add('selectedAns')
    if (item === store.currentAnswer) {
        resultDom.value.innerText = "Right Answer"
        resultDom.value.style.cssText = 'color:green;visibility:visible;'
    }
    else {
        resultDom.value.innerText = "Wrong Answer"
        resultDom.value.style.cssText = 'color:red;visibility:visible;'
    }
    const optionsDom = document.querySelectorAll('.option')
    let rightAnswerDom = null
    for (const option of optionsDom.entries()) {
        if (option[1].innerText === store.currentAnswer) {
            console.log("right ans", option[1].innerText)
            option[1].classList.add('rightAnswer')
            rightAnswerDom = option[1]
        }
    }

    setTimeout(() => {
        if (store.currentQuestionNo >= store.currentTotalQuestions) return
        else {
            event.target.classList.remove('selectedAns')
            rightAnswerDom.classList.remove('rightAnswer')
            resultDom.value.innerText = ""
            resultDom.value.style.cssText = 'color:inherit;visibility:hidden;'
        }
    }, 2000)
}
const playAgain = () => {
    refresh()
}
watch(data, (newData) => {
    console.log("newData",newData)
    store.onQuizStart(data.value.results, route.query.category, route.query.difficulty, route.query.amount)
})
onMounted(() => {
    console.log(data.value.results)
})

const computeCategoryName = computed(() => {
    for (const category of categoryData.value.trivia_categories) {
        if (category.id == store.currentCategory) {
            return category.name
        }
    }
})

</script>

<template>
    <div v-if="!(store.ready)">Loading
    </div>
    <div v-else>
        <main>
            <div class="topoptions flex justify-between">
                <div>
                    Selected category: <strong class="capitalize">{{store.currentCategory === "any"? 'Mixed':
                    computeCategoryName}}</strong>
                    <br>
                    Difficulty: <strong class="capitalize">{{store.currentDifficulty === "any"? 'Mixed':
                    store.currentDifficulty}}</strong>
                </div>
                <div class="font-medium flex items-center">Score: <span
                        class="font-bold text-lg score">{{store.score}}</span></div>
                <div>
                    <strong>{{store.currentTotalQuestions > store.currentQuestionNo ? store.currentQuestionNo + 1 :
                    store.currentTotalQuestions}}/{{store.currentTotalQuestions}}</strong>
                </div>
            </div>
            <div v-if="store.currentQuestionNo >= store.currentTotalQuestions" class="scoreBorad">
                <div class="scoreWrapper">
                    <div>Your Socre is: <span class="font-medium text-lg">{{store.score}}</span></div>
                    <div>On difficulty: <span class="font-medium text-lg">{{store.difficulty ? 'Mixed':
                    store.difficulty}}</span></div>
                    <button class="block" @click="playAgain">Play Again With Same Settigs</button>
                    <button @click="toHome">Play Again With Different Settigs</button>
                </div>
            </div>
            <div v-else class="questionArea">
                <div class="question text-xl font-medium" v-html="store.allData[store.currentQuestionNo].question">
                </div>
                <TransitionGroup name="options" tag="span">
                    <div
                        :class="store.disableOptions ? 'disabled options grid grid-cols-2 justify-between font-medium' : 'options grid grid-cols-2 justify-between font-medium'">
                        <span v-for="(item, index) in store.currentOptions" :key="index"
                            class="optionWrapper flex justify-center">
                            <span v-html="item" @click="(event) => onAnswerSubmit(event, item)" class="option drop-shadow-xl"></span>
                        </span>
                    </div>
                </TransitionGroup>
                <!-- <div class="timerBar w-100% bg-black"></div> -->
                <Transition name="resultDomTra">
                    <div ref="resultDom" class="resultDom"></div>
                </Transition>
            </div>
        </main>
        <div class="hint drop-shadow-lg"><span class="hintWrapper"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-question-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path
                        d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                </svg>
                <div>Hints</div>
                <div class="actualHint">{{store.currentAnswer}}</div>
            </span></div>
    </div>
</template>

<style scoped>
.questionArea {
    margin: 75px auto;
    max-width: 1000px;
    height: 500px;
}

.question {
    margin-bottom: 75px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.optionWrapper {
    margin-bottom: 50px;
}

.option {
    padding: 10px 40px;
    background-image: linear-gradient(to right, #7AC4FF, #D5AFFF);
    border-radius: 10px;
    cursor: pointer;
    transition: 0.075s;
}

.option:hover {
    transform: scale(1.1);
    transition: 0.2s;
}

.disabled .option:hover {
    transform: none;
}

.option:active {
    background-image: linear-gradient(to right, black, black);
    color: white;
    transition: 0.1s;
}

.disabled .option:active {
    background-image: linear-gradient(to right, #7AC4FF, #D5AFFF);
    color: black;
}

.score {
    margin-left: 5px;
}

.disabled .option {
    opacity: 0.5;
}

.disabled .option.selectedAns {
    opacity: 1;
    background-image: linear-gradient(rgb(247, 189, 82), rgb(247, 189, 82));
}

.disabled .option.selectedAns.rightAnswer,
.disabled .option.rightAnswer {
    opacity: 1;
    background-image: linear-gradient(rgb(23, 186, 23), rgb(23, 186, 23));
}

.resultDom {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 1.5rem;
    visibility: hidden;
    transition: 0.2s;
}

.scoreBorad {
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.scoreWrapper {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.scoreWrapper button {
    padding: 10px 30px;
    background-image: linear-gradient(to right, #7AC4FF, #D5AFFF);
    font-weight: 500;
    border-radius: 10px;
}

.scoreWrapper>* {
    margin: 10px 0;
}

.hint {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 75px;
    width: 75px;
    background-color: rgb(0, 203, 0);
    right: 40px;
    bottom: 40px;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0.75;
}
.hintWrapper {
    display: flex;
    flex-flow: column;
    align-items: center;
    color: white;
    position: relative;
}
.hint .actualHint {
    position: absolute;
    padding: 20px;
    background-color: lightgreen;
    border-radius: 10px;
    bottom: 80px;
    opacity: 0;
    height: none;
    visibility: hidden;
    transition: 0.2s;
}
.hint:hover .actualHint {
    opacity: 1;
    height: auto;
    visibility: visible;
}
.timerBar {
    border-radius: 50px;
    opacity: 0.25;
    background-color: green;
    height: 15px;
}
@keyframes timer {
    from {
        border-radius: 50px;
        opacity: 0.25;
        background-color: green;
    }
}
/* 
.options-enter-active, .options-leave-active {
  transition: all 0.5s ease;
}
.options-enter-from, .options-leave-to {
  opacity: 0;
  transform: translateX(30px);
} */


</style>