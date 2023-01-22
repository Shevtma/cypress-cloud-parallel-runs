import { LoginPage } from "../pages/loginPage";
import { faker } from "@faker-js/faker";
const loginData = require("../fixture/loginData.json");
const loginFieldsSelectors = require("../fixture/pages/loginPageSelectors.json");
const mainPageSelectors = require("../fixture/pages/mainPageSelectors.json");
const arrayOfPasswords = require("../fixture/passwordsList.json");

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
    }
  );
});

describe("Secret Santa. Test the password changed via API-calls", () => {
  var connectSIDcookie = "";

  if (env == "staging") {
    goodEmail = "shevtma+test@gmail.com";
    goodPassword = "test1234";
  } else {
    goodEmail = "shevtma@gmail.com";
    goodPassword = "RP7105";
  }

  // Перед тестами заходим на сайт
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "api/login",
      body: {
        email: goodEmail,
        password: goodPassword,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  // После завершения тестов сбрасываем пароль на дефолтный
  afterEach(() => {
    cy.request({
      method: "PUT",
      url: "api/account/password",
      headers: {
        cookie: connectSIDcookie,
      },
      body: { password: goodPassword },
    }).should((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("Set new password (sad path - paramerized)", () => {
    arrayOfPasswords.forEach((pswd) => {
      cy.log(pswd);
      cy.request({
        method: "PUT",
        url: "api/account/password",
        body: { password: pswd },
        failOnStatusCode: false,
      }).should((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.have.property("name", "ValidationError");
      });
    });
  });

  it("Set new password (sad path - short password)", () => {
    let newPassword = faker.internet.password(5);
    cy.log(newPassword);
    cy.request({
      method: "PUT",
      url: "api/account/password",
      body: { password: newPassword },
      failOnStatusCode: false,
    }).should((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error.errors[0]).to.have.property(
        "transKey",
        "validations.minCharLength"
      );
    });
  });

  it("Set new password (sad path - unauthorized user)", () => {
    let fakeCookie = "connect.sid=" + faker.random.alphaNumeric(82);
    let newPassword = faker.internet.password(6);
    cy.log(newPassword);
    cy.log(fakeCookie);
    cy.request({
      method: "GET",
      url: "api/session",
    }).then((response) => {
      let cookie = response.requestHeaders["cookie"];
      let arrayofcookies = cookie.split(";");
      for (let cooka of arrayofcookies) {
        if (cooka.includes("connect.sid")) {
          connectSIDcookie = cooka;
        }
      }
    });

    cy.request({
      method: "PUT",
      url: "api/account/password",
      headers: {
        cookie: fakeCookie,
      },
      body: { password: newPassword },
      failOnStatusCode: false,
    }).should((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.error).to.have.property("name", "UnauthorizedError");
    });
  });

  it("Set new password (happy path)", () => {
    let newPassword = faker.internet.password(6);
    cy.log(newPassword);
    cy.request({
      method: "PUT",
      url: "api/account/password",
      body: { password: newPassword },
    }).should((response) => {
      expect(response.status).to.eq(200);
    });
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

