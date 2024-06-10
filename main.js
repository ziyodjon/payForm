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
    size: "3",
    type: "tel",
    name: "cvc",
    value: "",
  }),

  el("label.input-label", "E-mail"),
  el("input#email", { type: "email", placeholder: "username@domain.ru" }),

  el(
    "button#submit-btn.btn.submit-btn.disabled",
    { type: "submit", disabled: "disabled" },
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

const cardMask = { mask: "0000 0000 0000 0000", min: 0, max: 17 };
const cardExpire = { mask: "00/00" };
const cardCvc = { mask: "000", lazy: false };

const ccnumMask = IMask(ccnum, cardMask);
const expiryMask = IMask(expiry, cardExpire);
const cvcMask = IMask(cvc, cardCvc);

payForm.addEventListener("input", (e) => {
  const validCardNumber = payform.validateCardNumber(ccnum.value);
  const validCvcNumber = payform.validateCardCVC(cvc.value);
  const parseCard = payform.parseCardExpiry(expiry.value);
  const validCardExpiry = payform.validateCardExpiry(
    parseCard.month,
    parseCard.year
  );

  //checkInput(validCardNumber, ccnum);

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
    submit.removeAttribute("disabled");

    return;
  }

  submit.classList.add("disabled");
});
submit.setAttribute("disabled", "disabled");

ccnum.addEventListener("input", (e) => {
  console.log(ccnum.value);
  const validCardNumber = payform.validateCardNumber(ccnumMask.value);
  updateType(e);
  checkInput(validCardNumber, ccnum);
});

expiry.addEventListener("input", (e) => {
  const parseCard = payform.parseCardExpiry(expiryMask.value);
  const validCardExpiry = payform.validateCardExpiry(
    parseCard.month,
    parseCard.year
  );
  checkInput(validCardExpiry, expiry);
});

cvc.addEventListener("input", () => {
  const validCvcNumber = payform.validateCardCVC(cvcMask.value);
  checkInput(validCvcNumber, cvc);
});

email.addEventListener("input", (e) => {
  let rules = {
    required: true,
    email: true,
  };
  const validEmailResult = checkEmail(e, rules);
  checkInput(validEmailResult, email);
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
