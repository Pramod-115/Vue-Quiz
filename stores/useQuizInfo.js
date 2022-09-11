import { defineStore } from "pinia";

export const useQuizStore = defineStore("counter", {
  state: () => ({
    ready: false,
    allData: null,
    currentCategory: "Mixed",
    currentDifficulty: null,
    currentTotalQuestions: 0,
    currentQuestionNo: null,
    currentOptions: null,
    currentAnswer: null,
    score: 0,
    disableOptions: false
  }),

  actions: {
    UpdateCurrentOptions: function () {
      const rightOption = this.allData[this.currentQuestionNo].correct_answer
      const allcurrentOptions = this.allData[this.currentQuestionNo].incorrect_answers
      if (allcurrentOptions.length < 4) {
        allcurrentOptions.push(rightOption)
      }
      this.currentAnswer = rightOption
      let shuffled = allcurrentOptions.map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
      this.currentOptions = shuffled
    },
    onQuizStart: function (alldata, catogery, difficulty, noOfQuestions) {
      this.allData = alldata
      this.currentCategory = catogery
      this.currentDifficulty = difficulty
      this.currentQuestionNo = 0
      this.ready = true
      this.score = 0
      this.currentTotalQuestions = noOfQuestions
      this.UpdateCurrentOptions()
    },
    onAnswerSubmit: function (ans) {
      if (ans === this.allData[this.currentQuestionNo].correct_answer) {
        this.score ++
      }
      this.disableOptions = true
      setTimeout(() => {
        this.disableOptions = false
        if (this.currentQuestionNo >= this.currentTotalQuestions) return
        else {
          this.currentQuestionNo ++
          this.UpdateCurrentOptions()
        }
      }, 2000)
    }
  },
});
