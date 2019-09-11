// Here we just store all needed DOM elements
let dom = {
  startTime: document.getElementById('start-time-input'),
  endDate: document.getElementById('end-date-input'),
  calculate: document.getElementById('calculate'),
  businessDays: document.querySelector('#business-days .output'),

  // array of 4 boxes where we display [dd, hh, mm, ss]
  liveCountdownBoxes: Array.from(
    document.querySelectorAll('#live-countdown > div > div')
  )
}

/* 
  we are setting the initial values for the startTime & endDate inputs
  not 100% necessary but a little nicer. 
*/
dom.startTime.value = new Date().toString().substr(16, 5) // takes current date & cuts out only the time (e.g. "20:30")
dom.endDate.value = new Date().toLocaleDateString('en-CA') // takes current date & cuts out only the date part in way that is acceptable for the input (e.g. "2019-09-11")

let interval = null // keeps track of the interval used later for the live countdown

// takes a date object & increases it for n number of days
const addDays = (d, n) => new Date(d.getTime() + 1000 * 60 * 60 * 24 * n)

// takes a date and resets it to 00:00, for example "Wed Sep 11 2019 20:35:55" becomes "Wed Sep 11 2019 00:00:00"
const startOfDay = d => new Date(new Date(d).setHours(0, 0, 0, 0))

/*
  we iterate over days between start & end and count the weekdays
*/
const getBusinessDaysBetween = (startDate, endDate) => {
  var count = 0
  var currentDate = startOfDay(startDate)
  while (currentDate <= startOfDay(endDate)) {
    var dayOfWeek = currentDate.getDay() // sunday = 0, monday = 1 etc...
    var isWeekend = dayOfWeek == 6 || dayOfWeek == 0 // if saturday or sunday

    if (!isWeekend) count++
    currentDate = addDays(currentDate, 1) // increment currentDate for 1 day
  }
  return count
}

/*
  Probably the most complicated part to understand. The function calculates the number of seconds between 2 dates.
  Then we take a date (not important which one), reset it to 00:00 time & add seconds to it. For example, 86400 seconds is 1 day. Adding 
  86400 seconds to a date will increase it for one day. Reseting today's date & adding 86410 seconds to it would give us 2019-09-11T00:00:10.
  Then I can extract the last 8 digits "00:00:10". Then I only need to calculate the days between by dividing secsBetween with 86400 (60 * 60 * 24)
*/
const timeBetween = (start, end) => {
  const secsBetween = Math.floor((end.getTime() - start.getTime()) / 1000) // getTime gives us the difference in miliseconds

  const hhmmss = new Date(
    // take a date, reset it and add miliseconds (secsBetween * 1000) to it. Passing a number of miliseconds to new Date() creates a new date
    startOfDay(new Date()).getTime() + secsBetween * 1000
  )
    .toString() // Wed Sep 11 2019 20:35:55 GMT+0200 (Central European Summer Time)
    .substr(16, 8) // take only "20:35:55"
    .split(':') // ["20", "35", "55"]

  // calculate the difference in days. The '0' & slice(-2) is just a little trick to get a "02" for example, instead of 2
  let days = ('0' + Math.floor(secsBetween / (60 * 60 * 24))).slice(-2)

  return [days, ...hhmmss]
}

// runs every time the button "calculate" is pressed
const onCalculate = () => {
  // here we are combining today's date but instead of the current time we take the time from the first input
  let startTime = new Date(
    new Date().toLocaleDateString('en-CA') + 'T' + dom.startTime.value // e.g. "2019-09-11T20:40" is a string that is parsable by new Date()
  )

  let endDate = startOfDay(new Date(dom.endDate.value))

  if (startTime > endDate) {
    // we are doing a little check
    alert('Choosen end time has already passed!')
    return
  }

  dom.businessDays.innerText = getBusinessDaysBetween(startTime, endDate)

  // update the dom
  const updateLiveCountdown = () => {
    const ddhhmmss = timeBetween(new Date(), startOfDay(endDate))
    dom.liveCountdownBoxes.forEach((div, i) => (div.innerText = ddhhmmss[i]))
  }

  updateLiveCountdown()
  // the "onCalculate" function is called on every "calculate" button click so if we don't clear the interval every time many intervals
  // could be running at the same time
  clearInterval(interval) // stop the interval
  interval = setInterval(updateLiveCountdown, 1000) // every 1000 miliseconds run the provided function
}

// registeres the event handler for click on "calculate"
dom.calculate.addEventListener('click', onCalculate)
