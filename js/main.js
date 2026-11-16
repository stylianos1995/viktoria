const i18n = window.ViktoriaI18n;
if (i18n) i18n.initLanguage();

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const year = document.querySelector("[data-year]");
const form = document.querySelector("form[data-inquire]");
const success = document.querySelector(".form-success");
const who = document.querySelector("#who");
const childField = document.querySelector("[data-child-field]");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    if (i18n) toggle.setAttribute("aria-label", i18n.t(open ? "nav.close" : "nav.open"));
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

function syncChildField() {
  if (!who || !childField) return;
  childField.hidden = who.value !== "child";
}

if (who) {
  who.addEventListener("change", syncChildField);
  syncChildField();
}

if (form && success) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.hidden = true;
    success.classList.add("is-visible");
  });
}
