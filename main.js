import { el, mount } from "redom";
import payform from "payform";
import approve from "approvejs";
import IMask from "imask";

const app = document.getElementById("app");

const cardTypeImage = el("img.card-image", { src: "/default-card.jpg" });

const formCaption = el("h1.form-caption", "Форма для заполнения данных карты");

const form = el("form#payform", { action: "" }, [
  el("label.input-label", "Номер карты"),
  el("input#ccnum", {
    type: "tel",
    size: 16,
    inputmode: "numeric",
    autocomplete: "ccnum",
    placeholder: "---- ---- ---- ----",
  }),

  el("label.input-label", "Дата окончания действия карты"),
  el("input#expiry", {
    placeholder: "-- / --",
    size: "7",
    type: "tel",
    name: "expiry",
    value: "",
  }),

  el("label.input-label", "CVV/CVC"),
  el("input#cvc", {
    placeholder: "---",
    size: "4",
    type: "tel",
    name: "cvc",
    value: "",
  }),

  el("label.input-label", "E-mail"),
  el("input#email", { type: "email", placeholder: "username@domain.ru" }),

  el(
    "button#submit-btn.btn.submit-btn.disabled",
    { type: "submit" },
    "Оплатить"
  ),
]);

mount(app, formCaption);
mount(app, cardTypeImage);
mount(app, form);

const ccnum = document.getElementById("ccnum");
const expiry = document.getElementById("expiry");
const cvc = document.getElementById("cvc");
const email = document.getElementById("email");
const submit = document.getElementById("submit-btn");

ccnum.addEventListener("input", (e) => {
  updateType(e);
});

expiry.addEventListener("input", (e) => {
  console.log(e.target.value);
  const test2 = payform.parseCardExpiry(e.target.value);
  const test = payform.validateCardExpiry("05", "25");
  console.log(test2);
  console.log(test);
});

email.addEventListener("input", (e) => {
  let rules = {
    required: true,
    email: true,
  };
  checkEmail(e, rules);
});

function checkEmail(e, rules) {
  const result = approve.value(e.target.value, rules);

  if (result.approved == false && email.value.length >= 0) {
    email.style.textDecoration = "underline";
    email.style.textDecorationColor = "red";
    email.style.textDecorationStyle = "wavy";
    submit.classList.add("disabled");
    return;
  }
  email.style.textDecoration = "none";
  submit.classList.remove("disabled");
}

function updateType(e) {
  let cardType = payform.parseCardType(e.target.value);
  if (cardType == null) {
    cardTypeImage.src = "/default-card.jpg";
    return;
  }

  cardTypeImage.src = `${cardType}.jpg`;
}

const cardMask = { mask: "0000 0000 0000 0000" };
const cardExpire = { mask: "00/00" };
const cardCvc = { mask: "000", lazy: false };

IMask(ccnum, cardMask);
IMask(expiry, cardExpire);
IMask(cvc, cardCvc);
