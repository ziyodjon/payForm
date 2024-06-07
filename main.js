import { el, mount } from "redom";

const app = document.getElementById('app');

const formCaption = el('h1.form-caption','Форма для заполнения данных карты');

const form = el("form#payform",{action:''}, 
  [
    el("label.input-label", 'Номер карты'), 
    el("input",{type:'text',placeholder:'Номер карты'}),

    el("label.input-label", 'Дата окончания действия карты'), 
    el("input",{type:'text',placeholder:'Дата окончания действия карты'}),

    el("label.input-label", 'CVV/CVC'), 
    el("input",{type:'text',placeholder:'CVV/CVC'}),
    
    el("label.input-label", 'E-mail'), 
    el("input",{type:'text',placeholder:'E-mail'}),

    el("button.btn.submit-btn.disabled",{type:'submit', disabled:"disabled"},'Оплатить'),
  ]
);

mount(app, formCaption);
mount(app, form);