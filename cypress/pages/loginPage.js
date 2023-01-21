const loginFieldsSelectors = require("../fixture/pages/loginPageSelectors.json");

export class LoginPage {
  elements = {
    loginField: () => cy.get(loginFieldsSelectors.loginField),
    passwordField: () => cy.get(loginFieldsSelectors.passwordField),
    loginButton: () => cy.get(loginFieldsSelectors.loginButton),
  };

  login(login, password) {
    if (login.length > 0) {
      this.elements.loginField().type(login);
    }
    if (password.length > 0) {
      this.elements.passwordField().type(password);
    }
    this.elements.loginButton().click({ force: true });
  }
}

