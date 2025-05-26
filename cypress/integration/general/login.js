before("Charge Page IXM", () => {
  cy.intercept("GET", "/account/login").as("home");
  cy.visit("/").wait("@home").wait(500);
});

describe("Main Page Form", () => {
  it("Should have Username and Password inputs", () => {
    cy.get("#username").wait(500);
    cy.get("#password").wait(500);
  });

  it("Should have Sign In button", () => {
    cy.get("button").should("have.text", "Sign In");
  });
});

describe("Login IXM", () => {
  it("Should display thank you text with name and last name after submitting", () => {
    cy.intercept("POST", "/SecurityService/api/user/login").as("login");
    const username = "USRWHAD";
    const password = "123456";
    cy.get("#username").type(username);
    cy.get("#password").type(password);
    cy.contains("Sign In").click();
    cy.useApi("login").wait(1000);
  });
});
