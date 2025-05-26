import * as c from "../../../constants.js";

const username = "admin";
const password = "123456";

describe("Login Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200/account/login");
  });

  it("Should login successfully with valid credentials", () => {
    // Enter username
    cy.get("input[name='User']").type(username);
    
    // Enter password
    cy.get("input[name='Password']").type(password);
    
    // Click login button
    cy.get("button").contains("Sign In").click();
    
    // Verify successful login - assuming dashboard is loaded after login
    cy.url().should("include", "/dashboard");
    
    // Additional verification that login was successful
    cy.get("#side-menu").should("be.visible");
  });

  it("Should display error with invalid credentials", () => {
    // Enter username
    cy.get("input[name='User']").type(username);
    
    // Enter wrong password
    cy.get("input[name='Password']").type("wrongpassword");
    
    // Click login button
    cy.get("button").contains("Sign In").click();
    
    // Verify error message appears
    cy.get(".error-message").should("be.visible");
  });
});
