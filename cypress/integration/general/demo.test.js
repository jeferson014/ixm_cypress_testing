// loginPage.js
class LoginPage {
    get usernameInput() {
        return cy.get('input[name="username"]'); // Adjust the selector as per the actual input field
    }

    get passwordInput() {
        return cy.get('input[name="password"]'); // Adjust the selector as per the actual input field
    }

    get loginButton() {
        return cy.get('button[type="submit"]');
    }
}

// modalPage.js
class ModalPage {
    get companySelect() {
        return cy.get('modal-container .form-select[formcontrolname="companyId"]');
    }

    get moduleSelect() {
        return cy.get('modal-container .form-select[formcontrolname="moduleId"]');
    }

    get continueButton() {
        return cy.get('modal-container .btn.btn-primary');
    }
}

// test.spec.js
describe('Login Test', () => {
    const loginPage = new LoginPage();
    const modalPage = new ModalPage();

    beforeEach(() => {
        cy.visit('https://ixm-nexusdev.azurewebsites.net/account/login');
    });

    it('should login and select company and module', () => {
        loginPage.usernameInput.type('admin');
        loginPage.passwordInput.type('123456');
        loginPage.loginButton.click();

        cy.wait(2000); // Wait for the modal to appear

        modalPage.companySelect.select('1'); // Select "IXM PERU"
        modalPage.moduleSelect.select('WAREHOUSE'); // Select "WAREHOUSE"
        modalPage.continueButton.click();

        // Assert that the URL has changed and is not the login page
        cy.url().should('not.eq', 'https://ixm-nexusdev.azurewebsites.net/account/login');
    });
});

// receptionManagementPage.js
class ReceptionManagementPage {
    get receptionManagementMenu() {
        return cy.get('ul#side-menu .is-parent').contains('Reception Management').parents('li');
    }

    get lotOption() {
        return cy.get('a[href="/lot/list"]');
    }

    clickReceptionManagement() {
        this.receptionManagementMenu.click();
    }

    clickLotOption() {
        this.lotOption.click();
    }
}

// NOTA: Ahora el login se realiza automáticamente antes de los tests de gestión de recepción usando cy.login().
// Si tienes otros describes o tests que requieren login, solo agrega cy.login() en su beforeEach.
// El test de login original se mantiene independiente para validar el flujo de autenticación.

describe('Reception Management Tests', () => {
    const receptionManagementPage = new ReceptionManagementPage();
    beforeEach(() => {
        cy.login(); // Utiliza el comando personalizado de login
        cy.visit('https://ixm-nexusdev.azurewebsites.net/');
    });

    it('should display Lot option after clicking Reception Management and navigate to Lot page', () => {
        receptionManagementPage.clickReceptionManagement();
        
        receptionManagementPage.lotOption.should('be.visible');
        
        receptionManagementPage.clickLotOption();

        cy.url().should('include', '/lot/list'); // Adjust the URL based on the actual redirection
    });
});

// lotListPage.js
class LotListPage {
    get lotNumberFilter() {
        return 'select.form-select'; // Selector for the lot number filter
    }

    get searchInput() {
        return 'input.form-control'; // Selector for the search input
    }

    get searchButton() {
        return 'button.btn-outline-primary:has(i.fa-search)'; // Selector for the search button
    }

    get lotTable() {
        return 'table.table-centered'; // Selector for the lot table
    }

    get lotNumberRow() {
        return 'tbody tr'; // Selector for the rows in the table
    }

    filterByLotNumber(lotNumber) {
        //cy.get(this.lotNumberFilter).select('Lot Number'); // Select "Lot Number" from the dropdown
        cy.get(this.searchInput).type(lotNumber); // Type the lot number in the search input
        cy.get(this.searchButton).click(); // Click the search button
    }

    verifyLotNumberInTable(lotNumber) {
        cy.wait(2000); // Wait for 2 seconds
        cy.get(this.lotTable).should('be.visible'); // Ensure the table is visible
        cy.get(this.lotNumberRow).contains(lotNumber).should('exist'); // Assert that the lot number exists in the table
    }
}

// lotList.spec.js
describe('Lot List Tests', () => {
    const lotListPage = new LotListPage();
    const receptionManagementPage = new ReceptionManagementPage();
    const baseUrl = 'https://ixm-nexusdev.azurewebsites.net/lot/list';

    beforeEach(() => {
         cy.login();
        cy.visit(baseUrl); // Visit the base URL before each test
    });

    it('should filter by Lot Number and display the correct record', () => {
        receptionManagementPage.clickReceptionManagement();
        
        receptionManagementPage.lotOption.should('be.visible');
        
        receptionManagementPage.clickLotOption();

        const lotNumber = 'IX.250146.O';
        lotListPage.filterByLotNumber(lotNumber); // Filter by the specified lot number
        lotListPage.verifyLotNumberInTable(lotNumber); // Verify the lot number is displayed in the table
    });
});