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

let socialNote;
let socialTimer;

document.querySelectorAll(".socials a").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") !== "#") return;
    event.preventDefault();
    if (!socialNote) {
      socialNote = document.createElement("p");
      socialNote.className = "social-note";
      socialNote.setAttribute("role", "status");
      socialNote.hidden = true;
      document.body.appendChild(socialNote);
    }
    socialNote.textContent = i18n ? i18n.t("social.soon") : "Ссылка скоро появится";
    const rect = link.getBoundingClientRect();
    socialNote.hidden = false;
    socialNote.style.left = `${rect.left + rect.width / 2}px`;
    socialNote.style.top = `${rect.top}px`;
    clearTimeout(socialTimer);
    socialTimer = setTimeout(() => {
      socialNote.hidden = true;
    }, 2200);
  });
});

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

const inquireEndpoint = "https://formsubmit.co/ajax/vikadovga38@gmail.com";

if (form && success) {
  const error = form.querySelector(".form-error");
  const button = form.querySelector("[type='submit']");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const honey = form.querySelector("[name='_honey']");
    if (honey && honey.value) {
      form.hidden = true;
      success.classList.add("is-visible");
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const goals = String(data.get("goals") || "").trim();
    const forChild = data.get("who") === "child";
    const payload = {
      "Name / Имя": name,
      Email: email,
      "Contact / Способ связи": contact || "—",
      "Lessons for / Для кого занятия": forChild ? "For my child / Для моего ребёнка" : "For me / Для меня",
      "Goals / Цели": goals || "—",
      _subject: `New lesson enquiry / Новая заявка — ${name}`,
      _replyto: email,
      _template: "table",
      _captcha: "false",
    };
    if (forChild) {
      payload["Child's age / Возраст ребёнка"] = String(data.get("childAge") || "").trim() || "—";
    }

    if (button) {
      button.disabled = true;
      button.textContent = i18n ? i18n.t("form.sending") : "Отправляем…";
    }
    if (error) error.hidden = true;

    try {
      const response = await fetch(inquireEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false || result.success === "false") {
        throw new Error("send failed");
      }
      form.hidden = true;
      success.classList.add("is-visible");
    } catch (sendError) {
      if (error) error.hidden = false;
      if (button) {
        button.disabled = false;
        button.textContent = i18n ? i18n.t("form.submit") : "Отправить заявку";
      }
    }
  });
}
