// Here we just store all needed DOM elements
let dom = {
  startDate: document.getElementById('start-date-input'),
  endDate: document.getElementById('end-date-input'),
  calculate: document.querySelector('.calculate'),
  businessDays: document.querySelector('.business-days .output')
}

// takes a date object & increases it for n number of days
const addDays = (d, n) => new Date(d.getTime() + 1000 * 60 * 60 * 24 * n)

/*
  we iterate over days between start & end and count the weekdays
*/
const getBusinessDaysBetween = (startDate, endDate) => {
  var count = 0
  var currentDate = startDate
  while (currentDate <= endDate) {
    var dayOfWeek = currentDate.getDay() // sunday = 0, monday = 1 etc...
    var isWeekend = dayOfWeek == 6 || dayOfWeek == 0 // if saturday or sunday

    if (!isWeekend) count++
    currentDate = addDays(currentDate, 1) // increment currentDate for 1 day
  }
  return count
}

// runs every time the button "calculate" is pressed
const onCalculate = () => {
  // checking if both dates are selected
  if (!dom.startDate.value || !dom.endDate.value) {
    alert('Please enter both an start & end date.')
  }

  // parsing the values from the date inputs into javascripts Date function
  let startDate = new Date(dom.startDate.value)
  let endDate = new Date(dom.endDate.value)

  // end date must be after start date
  if (startDate > endDate) {
    alert('Choosen end time has already passed!')
    return
  }

  dom.businessDays.innerText = getBusinessDaysBetween(startDate, endDate)
}

// registeres the event handler for click on "calculate"
dom.calculate.addEventListener('click', onCalculate)
