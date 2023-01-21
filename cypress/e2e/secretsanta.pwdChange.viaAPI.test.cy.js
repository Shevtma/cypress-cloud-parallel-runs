import { faker } from "@faker-js/faker";
var goodEmail = ""; //Cypress.env("email");
var goodPassword = ""; //Cypress.env("password");
var env = Cypress.env("environment");
const arrayOfPasswords = require("../fixture/passwordsList.json");

describe("Secret Santa. Test the password changed via API-calls", () => {
  var connectSIDcookie = "";

  if (env == "staging") {
    goodEmail = "shevtma@yandex.ru";
    goodPassword = "ZU9590";
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

