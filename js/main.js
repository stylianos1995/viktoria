const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const year = document.querySelector("[data-year]");
const form = document.querySelector("form[data-inquire]");
const success = document.querySelector(".form-success");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

document.querySelectorAll(".accordion-item").forEach((item) => {
  const button = item.querySelector("button");
  const mark = button?.querySelector("span:last-child");
  if (!button || !mark) return;

  button.addEventListener("click", () => {
    const open = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
    mark.textContent = open ? "−" : "+";
  });
});

if (form && success) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.hidden = true;
    success.classList.add("is-visible");
  });
}
