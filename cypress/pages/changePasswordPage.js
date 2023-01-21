const changePasswordFieldsSelectors = require("../fixture/pages/changePasswordPageSelectors.json");

export class ChangePasswordPage {
  elements = {
    newpsw1Field: () => cy.get(changePasswordFieldsSelectors.newpsw1Field),
    newpsw2Field: () => cy.get(changePasswordFieldsSelectors.newpsw2Field),
    saveButton: () => cy.get(changePasswordFieldsSelectors.saveButton),
  };

  changePassword(newPassword) {
    if (newPassword.length > 0) {
      this.elements.newpsw1Field().type(newPassword);
      this.elements.newpsw2Field().type(newPassword);
    }
    this.elements.saveButton().click();
  }
}

