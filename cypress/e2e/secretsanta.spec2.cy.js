import { LoginPage } from "../pages/loginPage";
import { RegisterPage } from "../pages/registerPage";
import { faker } from "@faker-js/faker";
const mainPageSelectors = require("../fixture/pages/mainPageSelectors.json");
const registerData = require("../fixture/registerData.json");
const registerFieldsSelectors = require("../fixture/pages/registerPageSelectors.json");

var email = ""; //Cypress.env("email");
var password = ""; //Cypress.env("password");
var env = Cypress.env("environment");

describe("Secret Santa tests after login spec", () => {
  let loginPage = new LoginPage();

  if (env == "staging") {
    email = "shevtma+test@gmail.com";
    password = "test1234";
  } else {
    email = "shevtma@gmail.com";
    password = "RP7105";
  }

  // Перед каждым тестом логинимся на сайте
  beforeEach(() => {
    cy.visit("/login");
    loginPage.login(email, password);
  });

  it('Проверяем, что на странице есть ссылка "Коробки" ', () => {
    cy.get(mainPageSelectors.userBoxesSelector).should("be.visible");
    cy.get(mainPageSelectors.headerSelector)
      .first()
      .should("have.attr", "href", "/account/boxes");
    cy.get(mainPageSelectors.headerItemsSelector)
      .first()
      .within(() => {
        cy.contains("Коробки");
      });
  });

  it("Проверяем, что на странице есть ссылка на личный кабинет ", () => {
    cy.get(mainPageSelectors.userNameSelector).should("be.visible");
    cy.get(mainPageSelectors.userName2Selector)
      .first()
      .should("have.attr", "href", "/account");
    cy.contains("maria-author");
  });

  it("Проверяем, что на странице есть кнопка Создать коробку ", () => {
    cy.get(mainPageSelectors.pageActionsSelector)
      .first()
      .should("have.attr", "href", "/box/new");
    cy.get(mainPageSelectors.createBoxBtnSelector).should("be.visible", true);
    cy.get(mainPageSelectors.createBoxBtnSelector).should(
      "have.text",
      "Создать коробкуСоздать коробку"
    );
    cy.contains("Создать коробку");
  });

  it("Проверяем, что на странице есть кнопка Быстрая жеребьевка ", () => {
    cy.get(mainPageSelectors.pageActionsSelector)
      .last()
      .should("have.attr", "href", "/randomizer");
    cy.get(mainPageSelectors.lotteryBtnSelector).should("be.visible", true);
    cy.get(mainPageSelectors.lotteryBtnSelector).should(
      "have.text",
      "Быстрая жеребьевкаУзнать подопечногоЧастые вопросы"
    );
    cy.contains("Быстрая жеребьевка");
  });

  afterEach(() => {
    cy.request({
      method: "GET",
      url: "api/logout",
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

describe("Secret Santa. Тесты для формы регистрации", () => {
  let registerPage = new RegisterPage();

  // корректные параметры подключения зависят от окружения
  if (env == "staging") {
    email = "shevtma+test@gmail.com";
    password = "test1234";
  } else {
    email = "shevtma@gmail.com";
    password = "RP7105";
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
    registerPage.register("Maria", email);
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

