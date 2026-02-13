const gregorianFestivals = {
  "1-1": "元旦节",
  "2-14": "情人节",
  "3-8": "妇女节",
  "5-1": "劳动节",
  "6-1": "儿童节",
  "10-1": "国庆节",
  "12-25": "圣诞节",
};

const lunarFestivals = {
  "1-1": "春节",
  "1-15": "元宵节",
  "5-5": "端午节",
  "7-7": "七夕节",
  "8-15": "中秋节",
  "9-9": "重阳节",
  "12-30": "除夕", // 可被替换为农历当年最后一天
};

const birthdayDates = {
  "10-23": "宝宝生日",
  "7-22": "哥哥生日"
};

let currentDate = new Date();
let lastPeriod = localStorage.getItem("lastPeriod") || "";

document.getElementById("savePeriodBtn").addEventListener("click", () => {
  const input = document.getElementById("lastPeriodInput").value;
  if (input) {
    localStorage.setItem("lastPeriod", input);
    lastPeriod = input;
    renderCalendar(currentDate);
  }
});

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const title = document.getElementById("calendar-title");
  title.textContent = `${year}年 ${month + 1}月`;

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    calendar.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const day = document.createElement("div");
    day.className = "day";
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const today = new Date();
    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      d === today.getDate()
    ) {
      day.classList.add("today");
    }

    const dateLabel = document.createElement("div");
    dateLabel.textContent = d;

    const festivalLabel = document.createElement("div");
    festivalLabel.className = "festival";

    const lunarDate = solarToLunar(year, month + 1, d);
    const gregKey = `${month + 1}-${d}`;
    const lunarKey = `${lunarDate.lunarMonth}-${lunarDate.lunarDay}`;
    const birthKey = `${month + 1}-${d}`;

    if (gregorianFestivals[gregKey]) {
      festivalLabel.textContent = gregorianFestivals[gregKey];
      day.classList.add("festival-day");
    } else if (lunarFestivals[lunarKey]) {
      festivalLabel.textContent = lunarFestivals[lunarKey];
      day.classList.add("festival-day");
    } else if (birthdayDates[birthKey]) {
      festivalLabel.textContent = birthdayDates[birthKey];
      day.classList.add("birthday");
    }

    // 姨妈期预测（28天周期，标注7天）
    if (lastPeriod) {
      const periodDate = new Date(lastPeriod);
      const diff = Math.floor(
        (new Date(year, month, d) - periodDate) / (1000 * 3600 * 24)
      );
      if (diff % 28 >= 0 && diff % 28 < 6) {
        day.classList.add("period");
        const blood = document.createElement("div");
        blood.className = "blood";
        blood.textContent = "💧";
        day.appendChild(blood);
      }
    }

    day.appendChild(dateLabel);
    day.appendChild(festivalLabel);
    calendar.appendChild(day);
  }
}

document.getElementById("prev-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

document.getElementById("next-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

window.onload = () => {
  renderCalendar(currentDate);
};
