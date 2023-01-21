import { LoginPage } from "../pages/loginPage";
import { RegisterPage } from "../pages/registerPage";
import { faker } from "@faker-js/faker";
import { ChangePasswordPage } from "../pages/changePasswordPage";
const loginData = require("../fixture/loginData.json");
const registerData = require("../fixture/registerData.json");
const loginFieldsSelectors = require("../fixture/pages/loginPageSelectors.json");
const mainPageSelectors = require("../fixture/pages/mainPageSelectors.json");
const registerFieldsSelectors = require("../fixture/pages/registerPageSelectors.json");
const accountPageSelectors = require("../fixture/pages/accountPageSelectors.json");

var goodEmail = ""; //Cypress.env("email");
var goodPassword = ""; //Cypress.env("password");
var env = Cypress.env("environment");

describe("Secret Santa. Тесты для формы логина", () => {
  let loginPage = new LoginPage();

  // корректные параметры подключения зависят от окружения
  if (env == "staging") {
    goodEmail = "shevtma+test@gmail.com";
    goodPassword = "test1234";
  } else {
    goodEmail = "shevtma@gmail.com";
    goodPassword = "RP7105";
  }

  // Перед каждым тестом заходим на сайт
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Тестируем форму ввода логина (поля email, password не заполнены)", () => {
    loginPage.login("", "");
    cy.get(loginFieldsSelectors.emailErrLabelSelector)
      .should("be.visible", true)
      .should("have.text", "Обязательное поле");
    cy.get(loginFieldsSelectors.pwdErrLabelSelector)
      .should("be.visible", true)
      .should("have.text", "Обязательное поле");
    cy.get(loginFieldsSelectors.errLabelSelector)
      .should("be.visible", true)
      .should("have.text", "В форме допущены ошибки");
  });

  it("Тестируем форму ввода логина (поле password не заполнено)", () => {
    loginPage.login(loginData[1].email, "");
    cy.get(loginFieldsSelectors.pwdErrLabelSelector)
      .should("be.visible", true)
      .should("have.text", "Обязательное поле");
    cy.get(loginFieldsSelectors.errLabelSelector)
      .should("be.visible", true)
      .should("have.text", "В форме допущены ошибки");
  });

  it("Тестируем форму ввода логина (поле email не заполнено)", () => {
    loginPage.login("", goodPassword);
    cy.get(loginFieldsSelectors.emailErrLabelSelector)
      .should("be.visible", true)
      .should("have.text", "Обязательное поле");
    cy.get(loginFieldsSelectors.errLabelSelector)
      .should("be.visible", true)
      .should("have.text", "В форме допущены ошибки");
  });

  it("Тестируем форму ввода логина (пользователь не зарегистрирован)", () => {
    loginPage.login(loginData[0].email, loginData[0].password);
    cy.get(loginFieldsSelectors.errLabelSelector)
      .should("be.visible", true)
      .should(
        "have.text",
        "Мы не нашли пользователя с таким email. Зарегистрироваться?"
      );
    cy.get(loginFieldsSelectors.registerHrefSelector).should(
      "have.attr",
      "href",
      "/register"
    );
  });

  it("Тестируем форму ввода логина (введен неверный пароль)", () => {
    loginPage.login(loginData[2].email, loginData[2].password);
    cy.get(loginFieldsSelectors.errLabelSelector)
      .should("be.visible", true)
      .should("have.text", "Неверное имя пользователя или пароль");
  });

  it("Тестируем форму ввода логина (введен email некорректного формата - без символа @)", () => {
    loginPage.login(loginData[3].email, goodPassword);
    cy.get(loginFieldsSelectors.emailErrLabelSelector)
      .should("be.visible", true)
      .should("have.text", "Некорректный email");
    cy.get(loginFieldsSelectors.errLabelSelector)
      .should("be.visible", true)
      .should("have.text", "В форме допущены ошибки");
  });

  it("Тестируем форму ввода логина (учетные данные корректны)", () => {
    loginPage.login(goodEmail, goodPassword);
    cy.get(mainPageSelectors.mainTextSelector)
      .should("be.visible")
      .should(
        "have.text",
        "Организуй тайный обмен подарками между друзьями или коллегами"
      );
    cy.get(mainPageSelectors.userNameSelector)
      .should("be.visible")
      .should("have.text", "maria-author");
  });

  after(
    "Выход из учетной записи после выполнения всех тестов из набора",
    () => {
      cy.request({
        method: "GET",
        url: "api/logout",
      }).then((response) => {
        expect(response.status).to.eq(200);
      });

      // cy.visit("/account");
      // cy.get(accountPageSelectors.exitSelector).click();
    }
  );
});

describe("Secret Santa. Тесты для формы регистрации", () => {
  let registerPage = new RegisterPage();

  // корректные параметры подключения зависят от окружения
  if (env == "staging") {
    goodEmail = "shevtma+test@gmail.com";
    goodPassword = "test1234";
  } else {
    goodEmail = "shevtma@gmail.com";
    goodPassword = "RP7105";
  }

  // Перед каждым тестом заходим на сайт на страницу регистрации
  beforeEach(() => {
    cy.visit("/register");
  });

  it("Тестируем форму регистрации. Попытка регистрации с пустыми данными", () => {
    registerPage.register("", "");
    cy.get(registerFieldsSelectors.regErrLabelSelector)
      .should("be.visible")
      .should("have.text", "Некорректное поле");
  });

  it("Тестируем форму регистрации. Попытка регистрации с пустым email", () => {
    registerPage.register(registerData[0].userName, "");
    cy.get(registerFieldsSelectors.regErrLabelSelector)
      .should("be.visible")
      .should("have.text", "Некорректное поле");
  });

  it("Тестируем форму регистрации. Попытка регистрации с пустым именем пользователя", () => {
    registerPage.register("", registerData[1].email);
    cy.get(registerFieldsSelectors.regErrLabelSelector)
      .should("be.visible")
      .should("have.text", "Некорректное поле");
  });

  it("Тестируем форму регистрации. Попытка регистрации пользователя c некорректным email", () => {
    registerPage.register(registerData[2].userName, registerData[2].email);
    cy.get(registerFieldsSelectors.emailErrLabelSelector)
      .should("be.visible")
      .should("have.text", "Некорректный email");
    cy.get(registerFieldsSelectors.regErrLabelSelector)
      .should("be.visible")
      .should("have.text", "Некорректное поле");
  });

  it("Тестируем форму регистрации. Попытка регистрации ранее зарегистрированного пользователя", () => {
    registerPage.register("Maria", goodEmail);
    cy.get(registerFieldsSelectors.regErrLabelSelector)
      .should("be.visible")
      .should("have.text", "Такой пользователь уже зарегистрирован. Войти?");
    cy.get(registerFieldsSelectors.enterHrefSelector)
      .should("be.visible")
      .should("have.attr", "href", "/login");
  });

  it("Тестируем форму регистрации. Попытка регистрации пользователя (данные корректны)", () => {
    const newUserName = faker.internet.userName();
    const newEmail = faker.internet.email();
    registerPage.register(newUserName, newEmail);
    cy.get(registerFieldsSelectors.successTitleSelector)
      .should("be.visible")
      .should("have.text", "Письмо отправлено!");
    cy.get(registerFieldsSelectors.successHintSelector)
      .should("be.visible")
      .should(
        "have.text",
        "Проверьте свой почтовый ящик. Вероятно, оно уже там :)"
      );
  });
});

// describe("Secret Santa. Смена пароля пользователя", () => {
//   let loginPage = new LoginPage();
//   let changePasswordPage = new ChangePasswordPage();

//   // корректные параметры подключения зависят от окружения
//   if (env == "staging") {
//     goodEmail = "shevtma@yandex.ru";
//     goodPassword = "ZU9590";
//   } else {
//     goodEmail = "shevtma@gmail.com";
//     goodPassword = "RP7105";
//   }

//   it("Проверяем возможность смены пароля для ранее зарегистрированного пользователя", () => {
//     let newPassword = faker.internet.password(8);
//     cy.visit("/login");
//     //login to the account with old password
//     loginPage.login(goodEmail, goodPassword);
//     //go to the account properties page
//     cy.get(mainPageSelectors.userNameSelector)
//       .should("be.visible")
//       .should("have.text", "Maria")
//       .click({ forse: true });
//     //changing password to the new
//     changePasswordPage.changePassword(newPassword);
//     // exit from account
//     cy.get(accountPageSelectors.exitSelector).click({ forse: true });

//     cy.visit("/login");
//     //login to the account with new password
//     loginPage.login(goodEmail, newPassword);
//     //go to the account properties page
//     cy.get(mainPageSelectors.userNameSelector)
//       .should("be.visible")
//       .should("have.text", "Maria")
//       .click({ forse: true });

//     //changing password to the old
//     changePasswordPage.changePassword(goodPassword);
//     // exit from account
//     cy.get(accountPageSelectors.exitSelector).click({ forse: true });
//   });
// });

