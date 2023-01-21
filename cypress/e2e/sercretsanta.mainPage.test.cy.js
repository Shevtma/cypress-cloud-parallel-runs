import { LoginPage } from "../pages/loginPage";
const mainPageSelectors = require("../fixture/pages/mainPageSelectors.json");
const accountPageSelectors = require("../fixture/pages/accountPageSelectors.json");

describe("Secret Santa tests after login spec", () => {
  let loginPage = new LoginPage();

  var email = ""; //Cypress.env("email");
  var password = ""; //Cypress.env("password");
  var env = Cypress.env("environment");

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

