import { el, mount } from "redom";
import payform from "payform";
import approve from "approvejs";
import IMask from "imask";

const app = document.getElementById("app");

const cardTypeImage = el("img.card-image", { src: "/default-card.jpg" });

const formCaption = el("h1.form-caption", "Форма для заполнения данных карты");

const payForm = el("form#payform", { action: "" });
const ccnumLabel = el("label.input-label", "Номер карты");
const ccnum = el("input#ccnum", {
  type: "tel",
  size: 16,
  inputmode: "numeric",
  autocomplete: "ccnum",
  placeholder: "---- ---- ---- ----",
});
const experyLabel = el("label.input-label", "Дата окончания действия карты");
const expiry = el("input#expiry", {
  placeholder: "-- / --",
  size: "7",
  type: "tel",
  name: "expiry",
  value: "",
});
const cvcLabel = el("label.input-label", "CVV/CVC");
const cvc = el("input#cvc", {
  placeholder: "---",
  //size: "3",
  type: "tel",
  name: "cvc",
  value: "",
});
const emailLabel = el("label.input-label", "E-mail");
const email = el("input#email", {
  type: "email",
  placeholder: "username@domain.ru",
});
const submit = el(
  "button#submit-btn.btn.submit-btn.disabled",
  { type: "submit", disabled: "disabled" },
  "Оплатить"
);

mount(app, formCaption);
mount(app, cardTypeImage);
mount(app, payForm);
mount(payForm, ccnumLabel);
mount(payForm, ccnum);
mount(payForm, experyLabel);
mount(payForm, expiry);
mount(payForm, cvcLabel);
mount(payForm, cvc);
mount(payForm, emailLabel);
mount(payForm, email);
mount(payForm, submit);

const cardMask = { mask: "0000 0000 0000 0000" };
const cardExpire = { mask: "00/00" };
const cardCvc = { mask: "000" };

const ccnumMask = IMask(ccnum, cardMask);
const expiryMask = IMask(expiry, cardExpire);
const cvcMask = IMask(cvc, cardCvc);

let validCardNumber, validCardExpiry, validCvcNumber, validEmailResult;

ccnum.addEventListener("input", (e) => {
  validCardNumber = payform.validateCardNumber(ccnumMask.value);
  updateType(e);
  checkInput(validCardNumber, ccnum);
});

expiry.addEventListener("input", (e) => {
  const parseCard = payform.parseCardExpiry(expiryMask.value);
  validCardExpiry = payform.validateCardExpiry(parseCard.month, parseCard.year);
  checkInput(validCardExpiry, expiry);
});

cvc.addEventListener("input", () => {
  validCvcNumber = payform.validateCardCVC(cvcMask.value);
  checkInput(validCvcNumber, cvc);
});

email.addEventListener("input", (e) => {
  validEmailResult = checkEmail(e, {
    required: true,
    email: true,
  });

  checkInput(validEmailResult, email);
});

payForm.addEventListener("input", (e) => {
  if (
    validCardExpiry &&
    validCardNumber &&
    validCvcNumber &&
    validEmailResult
  ) {
    submit.classList.remove("disabled");
    submit.removeAttribute("disabled");
  } else {
    submit.classList.add("disabled");
  }
});

function checkEmail(e, rules) {
  const result = approve.value(e.target.value, rules);

  if (result.approved == false) {
    email.classList.add("email-error");
    return;
  }
  email.classList.remove("email-error");

  return result.approved;
}

function checkInput(validInputType, input) {
  if (!validInputType) {
    input.classList.add("input-error");
    return;
  }

  input.classList.remove("input-error");
}

function updateType(e) {
  let cardType = payform.parseCardType(e.target.value);
  if (cardType == null) {
    cardTypeImage.src = "/default-card.jpg";
    return;
  }

  cardTypeImage.src = `${cardType}.jpg`;
}
