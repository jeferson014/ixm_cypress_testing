// loginPage.js
class LoginPage {
    get usernameInput() {
        return cy.get('#username');
    }

    get passwordInput() {
        return cy.get('#password');
    }

    get rememberUserCheckbox() {
        return cy.get('#remember-user');
    }

    get signInButton() {
        return cy.get('button[type="submit"]');
    }

    get errorMessage() {
        return cy.get('.error-message'); // Adjust this selector based on the actual error message element
    }

    enterUsername(username) {
        this.usernameInput.type(username);
    }

    enterPassword(password) {
        this.passwordInput.type(password);
    }

    checkRememberUser() {
        this.rememberUserCheckbox.check();
    }

    uncheckRememberUser() {
        this.rememberUserCheckbox.uncheck();
    }

    clickSignIn() {
        this.signInButton.click();
    }

    verifyErrorMessage(expectedMessage) {
        this.errorMessage.should('contain.text', expectedMessage);
    }
}

// login.spec.js
describe('Login Tests', () => {
    const loginPage = new LoginPage();

    beforeEach(() => {
        cy.visit('http://localhost:4200/account/login');
    });

    it('Verifique que el usuario pueda iniciar sesión correctamente con credenciales válidas', () => {
        loginPage.enterUsername('admin');
        loginPage.enterPassword('123456');
        loginPage.clickSignIn();
        cy.url().should('not.include', '/account/login'); // Assuming successful login redirects
        // Add additional assertions to verify successful login if necessary
    });

    it('Check that the "Remember user" checkbox retains the user\'s information after logging out and returning to the page', () => {
        loginPage.enterUsername('admin');
        loginPage.enterPassword('123456');
        loginPage.checkRememberUser();
        loginPage.clickSignIn();
        cy.url().should('not.include', '/account/login'); // Assuming successful login redirects
        
        // Log out logic here, replace with actual logout steps
        cy.visit('http://localhost:4200/account/logout'); // Adjust the URL for logout

        cy.visit('http://localhost:4200/account/login');
        loginPage.usernameInput.should('have.value', 'admin'); // Check if username is retained
        // Check if password is retained if applicable, depends on implementation
    });

    it('Attempt to sign in with an invalid username and/or password and verify that an appropriate error message is displayed', () => {
        loginPage.enterUsername('invalidUser');
        loginPage.enterPassword('wrongPassword');
        loginPage.clickSignIn();
        loginPage.verifyErrorMessage('Invalid username or password'); // Adjust the expected message as per the application
    });
});
