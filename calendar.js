const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const dropdown = document.getElementById("dropdown");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const goToBtn = document.getElementById("goTo");

let currentDate = new Date();
let events = {}; // { "YYYY-MM-DD": [ {title}, ... ] }

function renderCalendar(date) {
  calendar.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const today = new Date();
  monthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });
  const totalDays = lastDay.getDate();

  for (let i = 0; i < startDay; i++) {
    const emptyCell = document.createElement("div");
    calendar.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement("div");
    cell.className = "day";

    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    ) {
      cell.classList.add("today");
    }

    cell.innerHTML = `<div class="day-number">${day}</div>`;

    if (events[fullDate]) {
      events[fullDate].forEach((event, index) => {
        const evDiv = document.createElement("div");
        evDiv.className = "event";
        evDiv.textContent = event.title;

          evDiv.addEventListener("click", () => {
          const form = document.createElement("form");
          const input = document.createElement("input");
          input.type = "text";
          input.value = event.title;
          input.className = "event-input";

          const saveBtn = document.createElement("button");
          saveBtn.textContent = "Save";
          saveBtn.className = "save-btn";

          form.appendChild(input);
          form.appendChild(saveBtn);

          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const newTitle = input.value.trim();
            if (newTitle) {
              events[fullDate][index].title = newTitle;
            } else {
              events[fullDate].splice(index, 1);
              if (events[fullDate].length === 0) delete events[fullDate];
            }
            renderCalendar(currentDate);
          });

          evDiv.replaceWith(form);
          input.focus();
        });

        cell.appendChild(evDiv);
      });
    }

    cell.addEventListener("click", (e) => {
      if (
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "FORM" ||
        e.target.tagName === "INPUT" ||
        e.target.className === "event"
      ) return;

      if (cell.querySelector("form")) return;

      const form = document.createElement("form");
      form.innerHTML = `
        <input type="text" class="event-input" placeholder="Event title" required />
        <button type="submit" class="save-btn">Save</button>
      `;
      form.addEventListener("submit", e => {
        e.preventDefault();
        const title = form.querySelector("input").value.trim();
        if (title) {
          if (!events[fullDate]) events[fullDate] = [];
          events[fullDate].push({ title });
          renderCalendar(currentDate);
        }
      });

      cell.appendChild(form);
      form.querySelector("input").focus();
    });

    calendar.appendChild(cell);
  }
}

monthYear.onclick = () => {
  populateDropdown();
  dropdown.classList.toggle("hidden");
};

function populateDropdown() {
  monthSelect.innerHTML = "";
  yearSelect.innerHTML = "";

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  months.forEach((m, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = m;
    if (i === currentDate.getMonth()) option.selected = true;
    monthSelect.appendChild(option);
  });

  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 50; y <= currentYear + 50; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    if (y === currentDate.getFullYear()) option.selected = true;
    yearSelect.appendChild(option);
  }
}

goToBtn.onclick = () => {
  const selectedMonth = parseInt(monthSelect.value);
  const selectedYear = parseInt(yearSelect.value);
  currentDate.setMonth(selectedMonth);
  currentDate.setFullYear(selectedYear);
  dropdown.classList.add("hidden");
  renderCalendar(currentDate);
};

prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};

document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target) && e.target !== monthYear) {
    dropdown.classList.add("hidden");
  }
});

renderCalendar(currentDate);
