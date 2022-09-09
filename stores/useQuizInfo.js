import { defineStore } from "pinia";

export const useQuizStore = defineStore("counter", {
  state: () => ({
    ready: false,
    allData: null,
    catogery: "Mixed",
    difficulty: null,
    totalquestion: 0,
    currentQuestionNo: null,
    currentOptions: null,
    currentAnswer: null,
    score: 0,
    disablebtn: false
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
    onQuizStart: function (alldata, catogery, difficulty, noOfQes) {
      this.allData = alldata
      this.catogery = catogery
      this.difficulty = difficulty
      this.currentQuestionNo = 0
      this.currentOptions
      this.ready = true
      this.score = 0
      this.totalquestion = noOfQes
      this.UpdateCurrentOptions()
    },
    onAnswerSubmit: function (ans) {
      if (ans === this.allData[this.currentQuestionNo].correct_answer) {
        this.score ++
      }
      this.disablebtn = true
      setTimeout(() => {
        console.log(this.currentQuestionNo, this.totalquestion)
        this.disablebtn = false
        if (this.currentQuestionNo >= this.totalquestion) return
        else {
          this.currentQuestionNo ++
          this.UpdateCurrentOptions()
        }
      }, 2000)
    }
  },
});
