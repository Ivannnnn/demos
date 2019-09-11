let dom = {
  startTime: document.getElementById('start-time-input'),
  endDate: document.getElementById('end-date-input'),
  calculate: document.getElementById('calculate'),
  businessDays: document.querySelector('#business-days .output'),
  liveCountdownBoxes: Array.from(
    document.querySelectorAll('#live-countdown > div > div')
  )
}

dom.startTime.value = new Date().toString().substr(16, 5)
dom.endDate.value = new Date().toLocaleDateString('en-CA')

let interval = null

const addDays = (d, days) => new Date(d.getTime() + 1000 * 60 * 60 * 24 * days)

const getBusinessDaysBetween = (startDate, endDate) => {
  var count = 0
  var currentDate = startOfDay(startDate)
  while (currentDate <= startOfDay(endDate)) {
    var dayOfWeek = currentDate.getDay()
    var isWeekend = dayOfWeek == 6 || dayOfWeek == 0

    if (!isWeekend) count++
    currentDate = addDays(currentDate, 1)
  }
  return count
}

const startOfDay = d => new Date(new Date(d).setHours(0, 0, 0, 0))

const timeBetween = (start, end) => {
  const secsBetween = Math.floor(
    (startOfDay(end.getTime()) - start.getTime()) / 1000
  )

  const hhmmss = new Date(startOfDay(new Date()).getTime() + secsBetween * 1000)
    .toString()
    .substr(16, 8)
    .split(':')

  let days = ('0' + Math.floor(secsBetween / (60 * 60 * 24))).slice(-2)

  return [days, ...hhmmss]
}

const onCalculate = () => {
  let startTime = new Date(
    new Date().toLocaleDateString('en-CA') + 'T' + dom.startTime.value
  )

  let endDate = startOfDay(new Date(dom.endDate.value))

  if (startTime > endDate) {
    alert('Choosen end time has already passed!')
    return
  }

  dom.businessDays.innerText = getBusinessDaysBetween(startTime, endDate)

  const updateLiveCountdown = () => {
    const ddhhmmss = timeBetween(new Date(), endDate)
    dom.liveCountdownBoxes.forEach((div, i) => (div.innerText = ddhhmmss[i]))
  }

  updateLiveCountdown()
  clearInterval(interval)
  interval = setInterval(updateLiveCountdown, 1000)
}

dom.calculate.addEventListener('click', onCalculate)
