<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>我们的小日历 ♡</title>
  <style>
    body {
      background-color: #ffeaf3;
      font-family: "Arial Rounded MT Bold", "PingFang SC", sans-serif;
      text-align: center;
      color: #d63384;
    }
    .calendar {
      max-width: 400px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }
    .btn {
      background-color: #f9cce2;
      border: none;
      border-radius: 5px;
      padding: 8px 12px;
      color: #d63384;
      font-weight: bold;
      cursor: pointer;
    }
    .month-year {
      font-size: 1.5em;
      margin-bottom: 10px;
    }
    .days {
display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 5px;
    }
    .day {
      background-color: #ffe0eb;
      border-radius: 10px;
      padding: 15px 0;
      min-height: 60px;
      position: relative;
    }
    .day.holiday {
      background-color: #f8d7e3;
      font-weight: bold;
    }
    .day span {
      display: block;
    }
    .menstruation {
      margin-top: 20px;
      font-size: 0.95em;
      color: #dc3545;
    }
    .footer-note {
      margin-top: 20px;
      font-size: 0.9em;
      background-color: white;
      border-radius: 10px;
      padding: 10px;
      display: inline-block;
    }
    .holiday-name {
      position: absolute;
      bottom: 4px;
      left: 4px;
      font-size: 0.65em;
      color: #c2185b;
    }
    .letter-button {
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 0.7em;
      background: #ffc4d6;
      border: none;
      padding: 2px 6px;
      border-radius: 6px;
      cursor: pointer;
    }
    .letter-popup {
      display: none;
      position: fixed;
      left: 50%;
      top: 20%;
      transform: translateX(-50%);
      background: #fff;
      padding: 20px;
      border: 2px solid #d63384;
      border-radius: 10px;
      max-width: 300px;
      z-index: 999;
    }
  </style>
</head>
<body>
  <h2>我们的小日历 ♡</h2>
<div class="calendar">
    <div class="header">
      <button class="btn" onclick="changeMonth(-1)">← 上个月</button>
      <button class="btn" onclick="changeMonth(1)">下个月 →</button>
    </div>
    <div class="month-year" id="monthYear"></div>
    <div class="days" id="calendarDays"></div>

    <div class="menstruation">
      <label>🩸 上次姨妈日：</label>
      <input type="date" id="lastPeriod" />
      <button class="btn" onclick="savePeriod()">保存</button>
    </div>

    <div class="footer-note" id="footerNote"></div>
  </div>

  <div class="letter-popup" id="letterPopup">
    <p id="letterContent"></p>
    <button class="btn" onclick="closeLetter()">关闭信</button>
  </div>

  <script>
    const holidays = {
      "2-14": "情人节",
      "3-8": "妇女节",
      "5-1": "劳动节",
      "6-1": "儿童节",
      "10-1": "国庆节",
      "12-25": "圣诞节",
      "8-23": "宝宝生日",
      "7-22": "哥哥生日",
      "5-20": "520告白日",
      "2-15": "我们第一次写信"
    };

    const letters = {
      "2-14": "亲爱的宝贝，今天是我们的情人节，哥哥好爱你，今天也要抱抱亲亲哦 ♡",
      "2-15": "2026年2月15日 ♡ 哥哥在这一天也会给你写信。",
      "8-23": "小祖宗生日快乐 🎂 哥哥永远记得你的愿望。",
      "7-22": "今天是哥哥的生日，但你就是我最好的礼物 ♡"
    };

    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function renderCalendar() {
      const daysContainer = document.getElementById("calendarDays");
      daysContainer.innerHTML = "";
      const monthYearText = document.getElementById("monthYear");
      const date = new Date(currentYear, currentMonth, 1);
      const firstDay = date.getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      monthYearText.textContent = `${currentYear}年 ${currentMonth + 1}月`;

      for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        daysContainer.appendChild(emptyCell);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement("div");
        cell.className = "day";
        cell.innerHTML = `<span>${d}</span>`;

        const key = `${currentMonth + 1}-${d}`;
        if (holidays[key]) {
          cell.classList.add("holiday");
          const label = document.createElement("div");
          label.className = "holiday-name";
          label.textContent = holidays[key];
          cell.appendChild(label);
        }

        if (letters[key]) {
          const btn = document.createElement("button");
          btn.className = "letter-button";
          btn.textContent = "信";
          btn.onclick = () => showLetter(letters[key]);
          cell.appendChild(btn);
        }

        daysContainer.appendChild(cell);
      }

      updateFooter();
    }

    function changeMonth(offset) {
      currentMonth += offset;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    }

    function savePeriod() {
      const val = document.getElementById("lastPeriod").value;
      localStorage.setItem("lastPeriod", val);
      renderCalendar();
    }

    function updateFooter() {
      const note = document.getElementById("footerNote");
      const last = localStorage.getItem("lastPeriod");
      if (!last) {
        note.textContent = "还没记录过姨妈期哦～";
        return;
      }
      const lastDate = new Date(last);
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 28);
      const nextStr = `${nextDate.getFullYear()}年${nextDate.getMonth() + 1}月${nextDate.getDate()}日`;
      note.textContent = `预计下次姨妈：${nextStr} ♡ 记得注意身体，哥哥会陪你一起～`;
    }

    function showLetter(content) {
      document.getElementById("letterContent").textContent = content;
      document.getElementById("letterPopup").style.display = "block";
    }

    function closeLetter() {
      document.getElementById("letterPopup").style.display = "none";
    }

    window.onload = () => {
      const saved = localStorage.getItem("lastPeriod");
      if (saved) document.getElementById("lastPeriod").value = saved;
      renderCalendar();
    };
  </script>
</body>
</html>
