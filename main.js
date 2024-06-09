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

const payForm = document.getElementById("payform");
const ccnum = document.getElementById("ccnum");
const expiry = document.getElementById("expiry");
const cvc = document.getElementById("cvc");
const email = document.getElementById("email");
const submit = document.getElementById("submit-btn");

payForm.addEventListener("keyup", (e) => {
  const validCardNumber = payform.validateCardNumber(ccnum.value);
  const validCvcNumber = payform.validateCardCVC(cvc.value);
  const parseCard = payform.parseCardExpiry(expiry.value);
  const validCardExpiry = payform.validateCardExpiry(
    parseCard.month,
    parseCard.year
  );

  const validEmail = approve.value(email.value, {
    required: true,
    email: true,
  });

  if (
    validCardExpiry &&
    validCardNumber &&
    validCvcNumber &&
    validEmail.approved
  ) {
    submit.classList.remove("disabled");
    return;
  }

  submit.classList.add("disabled");
});

ccnum.addEventListener("input", (e) => {
  updateType(e);
});

expiry.addEventListener("input", (e) => {
  const parseCard = payform.parseCardExpiry(e.target.value);
  const validateCard = payform.validateCardExpiry(
    parseCard.month,
    parseCard.year
  );
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
    return;
  }
  email.style.textDecoration = "none";

  return result.approved;
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
