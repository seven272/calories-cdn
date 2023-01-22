// import  questions  from "./questions.js"
const App = {
 data () {
  return {
   titleSection: 'calculation',
   startImage: './assets/images/calc-calories.jpg',
   allData: {
    gender: '',
    activity: '',
    parametrs: {
      age: 0,
      height: 0,
      weight: 0
    }
  },
  dictionaryActivities: {
    min: 1.2,
    low: 1.375,
    medium: 1.55,
    high: 1.725,
    max: 1.9
  },
  isShow: false,
  calories: {
    normaWeight: 0,
    minusWeight: 0,
    plusWeight: 0
  },
  disabledCountBtn: true,
  disabledClearBtn: true,
  notes: [],
  indexPage: 1
  }
 },
 mounted () {
  this.notes = JSON.parse(localStorage.getItem("calories")) || []
 },
 computed: {
  getYear () {
   const dateObj = new Date()
   const year = dateObj.getUTCFullYear()
   return year
  }
 },
 methods: {
  switchSection (ind) {
    const arrTitleSection = ['start', 'calculation', 'result']
    this.titleSection = arrTitleSection[ind]
    this.indexPage = ind
  },
  testClick () {
    console.log(this.allData.parametrs.age)
  },
  disableButtons () {
    const values = Object.values(this.allData).splice(0, 2)
    const parametrsValues = Object.values(this.allData.parametrs)
    // для кнопки расчитать
    if (values.includes('') || parametrsValues.includes(0)) {
      this.disabledCountBtn = true
    } else {
      this.disabledCountBtn = false
    }
    // для кнопки очистить
    const sumArr = parametrsValues.reduce((sum, b) => {
      return sum + b
    }, 0)
  
    if (values[0] !== '' || values[1] !== '' || sumArr > 0) {
      this.disabledClearBtn = false
    } else if (values[0] === '' && values[1] === '' && sumArr === 0) {
      this.disabledClearBtn = true
    }
  },
  countCalories () {
    this.isShow = true
    let activity = 0
    switch (this.allData.activity) {
      case 'min':
        activity = this.dictionaryActivities.min
        break
      case 'low':
        activity = this.dictionaryActivities.low
        break
      case 'medium':
        activity = this.dictionaryActivities.medium
        break
      case 'high':
        activity = this.dictionaryActivities.high
        break
      case 'max':
        activity = this.dictionaryActivities.max
        break
      default:
        activity = 0
    }
    let formula = 0
    if (this.allData.gender === 'female') {
      // (10 × вес в килограммах) + (6,25 × рост в сантиметрах) − (5 × возраст в годах) − 161
      formula = (10 * this.allData.parametrs.weight) + (6.25 * this.allData.parametrs.height) - (5 * this.allData.parametrs.age) - 161
    } else if (this.allData.gender === 'male') {
      // (10 × вес в килограммах) + (6,25 × рост в сантиметрах) − (5 × возраст в годах) + 5
      formula = (10 * this.allData.parametrs.weight) + (6.25 * this.allData.parametrs.height) - (5 * this.allData.parametrs.age) + 5
    }
    const normCalories = Math.round(formula * activity)
    const procent = 15
    const caloriesInProcent = normCalories / 100 * procent
    const minusCalories = Math.round(normCalories - caloriesInProcent)
    const plusCalories = Math.round(normCalories + caloriesInProcent)

    this.calories.normaWeight = normCalories
    this.calories.minusWeight = minusCalories
    this.calories.plusWeight = plusCalories
    this.formingArrayResult()
  },
  formingArrayResult () {
    const obj1 = this.allData
    const obj2 = this.calories
    const totalData = {}

    totalData.date = new Date().toLocaleDateString()

    if (obj1.gender === 'female') {
      totalData.gender = 'женщина'
    } else if (obj1.gender === 'male') {
      totalData.gender = 'мужчина'
    }

    switch (obj1.activity) {
      case 'min':
        totalData.activity = 'очень низкая'
        break
      case 'low':
        totalData.activity = 'низкая'
        break
      case 'medium':
        totalData.activity = 'умеренная'
        break
      case 'high':
        totalData.activity = 'высокая'
        break
      case 'max':
        totalData.activity = 'очень высокая'
        break
      default:
        totalData.activity = 'еще не определил'
    }
    totalData.age = obj1.parametrs.age
    totalData.height = obj1.parametrs.height
    totalData.weight = obj1.parametrs.weight

    totalData.norma = obj2.normaWeight
    totalData.decrease = obj2.minusWeight
    totalData.increase = obj2.plusWeight

    this.notes.push(totalData)
  },
  clearForm () {
    this.isShow = false
    this.allData.gender = ''
    this.allData.activity = ''
    for (const key in this.allData.parametrs) {
      this.allData.parametrs[key] = 0
    }
    for (const key in this.calories) {
      this.calories[key] = 0
    }
  },
  clearResult () {
    this.notes = []
    localStorage.removeItem('calories')
  }
 },
 watch: {
  'allData': {
    handler (newVal, oldval) {
      this.disableButtons()
    },
    deep: true,
    immediate: true
  },
  'notes': {
    handler (newVal, oldVal) {
      localStorage.setItem("calories", JSON.stringify(newVal))
    },
    deep: true
  } 
 }

}
const app = Vue.createApp(App)
app.mount('#app')