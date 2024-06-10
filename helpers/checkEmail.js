import approve from "approvejs";

export default function checkEmail(e, rules) {
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
