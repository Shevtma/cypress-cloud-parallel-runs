const registerFieldsSelectors = require("../fixture/pages/registerPageSelectors.json");

export class RegisterPage {
  elements = {
    userNameField: () => cy.get(registerFieldsSelectors.userNameField),
    emailField: () => cy.get(registerFieldsSelectors.emailField),
    registerButton: () => cy.get(registerFieldsSelectors.registerButton),
  };

  register(userName, userEmail) {
    if (userName.length > 0) {
      this.elements.userNameField().type(userName);
    }
    if (userEmail.length > 0) {
      this.elements.emailField().type(userEmail);
    }
    this.elements.registerButton().click();
  }
}

