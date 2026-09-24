const themeToggle = document.getElementById("themeToggle");
const matchTiles = document.querySelectorAll(".match-tile");
const filterButtons = document.querySelectorAll(".filter-btn");
const countdownElement = document.getElementById("countdown");
const infoButton = document.getElementById("infoButton");
const infoModal = document.getElementById("infoModal");
const closeModal = document.getElementById("closeModal");
const modalAction = document.getElementById("modalAction");
const shareButton = document.getElementById("shareButton");
const textButtons = document.querySelectorAll(".text-btn");

const firstMatchDate = new Date("2026-12-07T21:00:00+02:00");

function setTheme(theme) {
  document.body.classList.toggle("light-mode", theme === "light");
  themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
  localStorage.setItem("football-theme", theme);
}

const savedTheme = localStorage.getItem("football-theme");
setTheme(savedTheme || "dark");

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.contains("light-mode");
  setTheme(isLight ? "dark" : "light");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");

    matchTiles.forEach(tile => {
      const isVisible = filter === "all" || tile.dataset.type === filter;
      tile.classList.toggle("hidden", !isVisible);
    });
  });
});

function updateCountdown() {
  const now = new Date();
  const diff = firstMatchDate - now;

  if (diff <= 0) {
    countdownElement.textContent = "המשחק כבר התחיל";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownElement.textContent = `${days} ימים · ${hours} שעות · ${minutes} דקות · ${seconds} שניות`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

function openModal() {
  infoModal.classList.add("open");
  infoModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeInfoModal() {
  infoModal.classList.remove("open");
  infoModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

infoButton.addEventListener("click", openModal);
closeModal.addEventListener("click", closeInfoModal);
modalAction.addEventListener("click", closeInfoModal);

infoModal.addEventListener("click", (event) => {
  if (event.target === infoModal) closeInfoModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeInfoModal();
});

textButtons.forEach(button => {
  button.addEventListener("click", () => {
    const place = button.dataset.place;
    alert(`${place}\n\nפרטי הכניסה, שעות פעילות ומחירים יתווספו בקרוב.`);
  });
});

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: "Football Journey 2026",
    text: "טיול כדורגל ושמירת שבת במדריד וברצלונה",
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      shareButton.textContent = "הקישור הועתק ✓";
      setTimeout(() => {
        shareButton.textContent = "שתף את המסלול ↗";
      }, 2200);
    }
  } catch (err) {
    console.log("שיתוף בוטל");
  }
});
