//Глобални променливи
const calendar = document.querySelector(".calendar"),
      date = document.querySelector(".date"),
      daysContainer = document.querySelector(".days"),
      prev = document.querySelector(".prev"),
      next = document.querySelector(".next"),
      todayBtn = document.querySelector(".today-btn"),
      gotoBtn = document.querySelector(".goto-btn"),
      dateInput = document.querySelector(".date-input"),
      eventDay = document.querySelector(".event-day"),
      eventDate = document.querySelector(".event-date"),
      eventsContainer = document.querySelector(".events"),
      addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "Януари",
    "Февруари",
    "Март",
    "Април",
    "Май",
    "Юни",
    "Юли",
    "Август",
    "Септември",
    "Октомври",
    "Ноевмри",
    "Декември",
];

//Създаваме празен масив за бележките
let eventsArr = []

getEvents();

//фунцкия за добавяне на дните в календара

function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;
    
    //update на датата в заглавната част на календара 
    date.innerHTML = months[month] + " " + year;

    //добавяне на дните в календара
    let days = "";

    //дните от предишния месец
    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    //дните от сегашния месец
    for(let i = 1; i <= lastDate; i++) {
        //проверяваме дали дадена бележка присъства в даден ден
        let event = false;
        eventsArr.forEach((eventObj) => {
        if (
            eventObj.day === i &&
            eventObj.month === month + 1 &&
            eventObj.year === year
            ) {
            //Ако бележката е намерена
            event = true;
            }
        }); 
        //добавяме клас "today" за днескашния ден
        if(
            i === new Date().getDate() && 
            year === new Date().getFullYear() && 
            month === new Date().getMonth()
        ) {
            activeDay = i;
            getActiveDay(i);
            updateEvents(i);

            //Ако бележката е намерена, довави клас "event" + добавянане на клас "active"(избран) на днескашния ден
            if (event) {
                days += `<div class="day today active event">${i}</div>`;
            } else {
                days += `<div class="day today active">${i}</div>`;
            }
        }

        //добавяне на останалите дни от месеца
        else {
            if (event) {
                days += `<div class="day event">${i}</div>`;
            } else {
                days += `<div class="day">${i}</div>`;
            }
        }
    }

    //добавяне на дните от следващия месец
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }

    daysContainer.innerHTML = days;

    addListener();
};

initCalendar();

//предходен месец от сегашния
function prevMonth() {
    month--;
    if(month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
};

//следващ месец от сегашния
function nextMonth() {
    month++;
    if(month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
};

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

dateInput.addEventListener("input", (e) => {

    // позволяваме само числa да бъдат нанасяни
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");

    //разделяме месеците и годините с черта
    if(dateInput.value.length === 2) {
        dateInput.value += "/";
    }

    //не позволяваме повече от 7 символа
    if(dateInput.value.length > 7) {
        dateInput.value = dateInput.value.slice(0, 7);
    }

    if(e.inputType === "deleteContentBackward") {
        if(dateInput.value.length === 3) {
          dateInput.value = dateInput.value.slice(0, 2);
        }
    }
});

gotoBtn.addEventListener("click", gotoDate);

//функция за намиране на желаната(написаната) дата
function gotoDate() {
    const dateArr = dateInput.value.split("/");

    //валидиране на датата
    if(dateArr.length === 2) {
        if(dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }

    //съобщение за грешка при грешно въведена дата
    alert("Въведената дата е невалидна.")
};

//Функционалности на бележника към календара
const addEventBtn = document.querySelector(".add-event"),
      addEventContainer = document.querySelector(".add-event-wrapper"),
      addEventCloseBtn = document.querySelector(".close"),
      addEventTitle = document.querySelector(".event-name"),
      addEventTimeFrom = document.querySelector(".event-time-from"),
      addEventTimeTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click", () => {
    addEventContainer.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
    addEventContainer.classList.remove("active");
});

//Затваряне при клик извън полето за добавяне на бележка
document.addEventListener("click", (e) => {
    if (e.target !== addEventBtn && !addEventContainer.contains(e.target)) {
      addEventContainer.classList.remove("active");
    }
});

//Позволяваме само 50 символа за заглавие на бележката
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 50);
});

//Форматиране на зададения час
addEventTimeFrom.addEventListener("input", (e) => {
    //Премахваме възможността за въвеждане на всичко освен числа
    addEventTimeFrom.value = addEventTimeFrom.value.replace(/[^0-9:]/g, "");
    //Автоматично добавяне на двуеточие при написване на две числа
    if(addEventTimeFrom.value.length === 2) {
        addEventTimeFrom.value += ":";
    }
    //Отнемаме възможността да се въведат повече от 5 символа, за да поддържаме валиден формат на времето
    if(addEventTimeFrom.value.length > 5) {
        addEventTimeFrom.value = addEventTimeFrom.value.slice(0, 5);
    }
});

addEventTimeTo.addEventListener("input", (e) => {
    //Премахваме възможността за въвеждане на всичко освен числа
    addEventTimeTo.value = addEventTimeTo.value.replace(/[^0-9:]/g, "");
    //Автоматично добавяне на двуеточие при написване на две числа
    if(addEventTimeTo.value.length === 2) {
        addEventTimeTo.value += ":";
    }
    //Отнемаме възможността да се въведат повече от 5 символа, за да поддържаме валиден формат на времето
    if(addEventTimeTo.value.length > 5) {
        addEventTimeTo.value = addEventTimeTo.value.slice(0, 5);
    }
});

//Фунционалност за следене на дни след визуализация
function addListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            //set-ваме днескашния ден като "active" ден (избран)
            activeDay = Number(e.target.innerHTML);

            //извикваме getActiveDay() след клик
            getActiveDay(e.target.innerHTML);
            updateEvents(Number(e.target.innerHTML));

            days.forEach((day) => {
                day.classList.remove("active");
            });

            //Функционалност за добавяне на "active"(избран) клас, ако ден от предходен месец е кликнат
            if (e.target.classList.contains("prev-date")) {
                prevMonth();

                setTimeout(() => {
                    //Избираме всички дни от избрания месец
                    const days = document.querySelectorAll(".day");

                    //След като отидем на предходен месец, даваме клас "active"(избран) на кликнатия ден
                    days.forEach((day) => {
                        if (!day.classList.contains("prev-date") && day.innerHTML === e.target.innerHTML) {
                          day.classList.add("active");
                        }
                    });
                }, 100);

            //Функционалност за добавяне на "active"(избран) клас, ако ден от следващ месец е кликнат
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();

                setTimeout(() => {
                    //Избираме всички дни от избрания месец
                    const days = document.querySelectorAll(".day");

                    //След като отидем на следващ месец, даваме клас "active"(избран) на кликнатия ден
                    days.forEach((day) => {
                        if (!day.classList.contains("next-date") && day.innerHTML === e.target.innerHTML) {
                          day.classList.add("active");
                        }
                    });
                }, 100);

            //Функционалност за добавяне на "active"(избран) клас, ако ден от месеца на който сме в момента е кликнат
            } else {
                e.target.classList.add("active");
            }
        });
    });
};

//Функционалност за изписване на името и датата на деня в заглавната част на календара
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//Функционалност за показване на бележките да даден/избран ден
function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
        if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {
            event.events.forEach((event) => {
                events += `
                    <div class="event">
                        <div class="title">
                            <i class="fas fa-circle"></i>
                            <h3 class="event-title">${event.title}</h3>
                        </div>
                        <div class="event-time">
                            <span class="event-time">${event.time}</span>
                        </div>
                    </div>
                `;
            });
        }
    });

    //Ако бележка не е намерена
    if (events === "") {
        events = `
            <div class="no-event">
                <h3>Няма запазени бележки</h3>
            </div>
        `;
    }

    eventsContainer.innerHTML = events;

    //Запазване на бележките
    saveEvents();
};

// Функционалност за добавяне на бележки
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventTimeFrom.value;
    const eventTimeTo = addEventTimeTo.value;

    //Проверка за непопълнено поле на бележка
    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Моля попълнете всички полета");
        return;
    }

    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");

    if (
        timeFromArr.length !== 2 ||
        timeToArr.length !== 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] > 59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59
    ) {
        alert("Зададения час е невалидно форматиран");
        return;
    }

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeTo,
    };

    //проверка дали масива с бележки не е празен
    let eventAdded = false;
    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (
                item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent],
        });
    }

    addEventContainer.classList.remove("active");

    //Изчистване на полетата
    addEventTitle.value = "";
    addEventTimeFrom.value = "";
    addEventTimeTo.value = "";

    //добавяне на създадената бележка
    updateEvents(activeDay);

    const activeDayElement = document.querySelector(".day.active");
    if (!activeDayElement.classList.contains("event")) {
        activeDayElement.classList.add("event");
    }
});

//Функционалност за конвертиране в 24-часов формат
function convertTime(time) {
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";

    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
};

//Функционалност за изтриване на бележките при клик
eventsContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("event")) {
        const eventTitle = e.target.children[0].children[1].innerHTML;

        eventsArr.forEach((event) => {
            if (
                event.day === activeDay &&
                event.month === month + 1 &&
                event.year === year
            ) {
                event.events.forEach((item, index) => {
                    if (item.title === eventTitle) {
                        event.events.splice(index, 1);
                    }
                });

                //Премаhване на клас "active" от даден ден, ако в него липсват бележки
                if (event.events.length === 0) {
                    eventsArr.splice(eventsArr.indexOf(event), 1);

                    const activeDayElement = document.querySelector(".day.active");
                    if (activeDayElement.classList.contains("event")) {
                        activeDayElement.classList.remove("event");
                    }
                }
            }
        });
        //Update след премахване на бележка
        updateEvents(activeDay);
    }
});

//Функционалност за запазване на бележките в Local Storage
function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
};

function getEvents() {
    if (localStorage.getItem("events") === null) {
      return;
    }
    eventsArr.push( ... JSON.parse(localStorage.getItem("events")));
  }