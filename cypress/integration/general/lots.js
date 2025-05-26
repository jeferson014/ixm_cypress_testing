import * as c from "../../../constants.js";

const username = "USRWHAD";
const password = "123456";
let go_Options, gi_Warehouse, ga_Data;

beforeEach("Login IXM", () => {
  cy.readFile("cypress/fixtures/csv/lots.csv", "utf8").then((data) => {
    cy.csvToJson(data).then((result) => {
      cy.writeFile("cypress/fixtures/lots.json", result, "utf8");
    });
  });
  cy.addService(c.GET, "/account/login", "home");
  cy.addService(c.POST, "/SecurityService/api/user/login", "login");
  cy.visit("/").wait("@home").wait(c.SECOND);
  cy.addData("User", username);
  cy.addData("Password", password);
  cy.get("button").contains("Sign In").click();
  cy.useApi("login")
    .then((response) => {
      const data = response.response.body.data;
      gi_Warehouse = data.wareHouses[0].id;
      cy.request({
        method: c.GET,
        url: "https://uataks.eastus.cloudapp.azure.com/SecurityService/api/User/getMenu/7/2/1",
        headers: {
          Authorization: "Bearer " + data.accessToken,
        },
      }).then(({ body }) => {
        go_Options = body.data;
      });
    })
    .wait(c.SECOND);
  cy.fixture("lots").then((data) => {
    ga_Data = data;
  });
});

describe("Lots", () => {
  it("Register Lots", () => {
    const va_Data = ga_Data["scenario01"];
    cy.get("#side-menu").then((menu) => {
      cy.addService(c.POST, c.EP_Lot + "/Search", "lotsRec");
      cy.clickOption("lotsRec", menu, "li > a > div", getOptions(5, 0));
    });
    cy.addService(
      c.GET,
      "/MasterTableService/api/Client/SearchOnlyIsCompany/1?client=",
      "lstClients"
    );
    cy.get(".col-lg-3 > :nth-child(3)").click();
    cy.useApi("lstClients");
    cy.addData("AQ Lot Reference (CAN)", va_Data.aq_lot);
    cy.addService(
      c.GET,
      "/MasterTableService/api/Supplier/SearchSupplierFilterInCompany/2",
      "lstSupplier"
    );
    cy.addService(
      c.GET,
      "/MasterTableService/api/Client/SearchSupervisorByIdclient/6",
      "lstSupervisor"
    );
    cy.selectOption("Client", va_Data.client);
    cy.useApi("lstSupplier").useApi("lstSupervisor");
    cy.selectOption("Supplier", va_Data.supplier);
    cy.addService(
      c.GET,
      "/PurchaseSaleContractService/api/PurchaseSaleContract/217/0/1",
      "lstProduct"
    );
    cy.addService(
      c.GET,
      "/ContractService/api/ContractService/ListForLot/12/6/1/1",
      "lstContract"
    );
    cy.selectOption("Product", va_Data.product);
    cy.selectOption("Purchase Contract", va_Data.purchase_contract);
    cy.selectOption("Supervisor", va_Data.supervisor);
    cy.addData("WMT", va_Data.wmt);
    cy.addData("H2O %", va_Data.h2o);
    cy.addData("Open Date", va_Data.open_date);
    cy.get(".modal-footer > .btn-primary").click();
    cy.get(".swal2-confirm").click();
    cy.get(".ng-trigger").contains("has been successfully created");
  });

  it("Valid Open Date", () => {
    const va_Data = ga_Data["scenario02"];
    cy.get("#side-menu").then((menu) => {
      cy.addService(c.POST, c.EP_Lot + "/Search", "lotsRec");
      cy.clickOption("lotsRec", menu, "li > a > div", getOptions(5, 0));
    });
    cy.addService(
      c.GET,
      "/MasterTableService/api/Client/SearchOnlyIsCompany/1?client=",
      "lstClients"
    );
    cy.get(".col-lg-3 > :nth-child(3)").click();
    cy.useApi("lstClients");
    cy.addData("AQ Lot Reference (CAN)", va_Data.aq_lot);
    cy.addService(
      c.GET,
      "/MasterTableService/api/Supplier/SearchSupplierFilterInCompany/2",
      "lstSupplier"
    );
    cy.addService(
      c.GET,
      "/MasterTableService/api/Client/SearchSupervisorByIdclient/6",
      "lstSupervisor"
    );
    cy.selectOption("Client", va_Data.client);
    cy.useApi("lstSupplier").useApi("lstSupervisor");
    cy.selectOption("Supplier", va_Data.supplier);
    cy.addService(
      c.GET,
      "/PurchaseSaleContractService/api/PurchaseSaleContract/217/0/1",
      "lstProduct"
    );
    cy.addService(
      c.GET,
      "/ContractService/api/ContractService/ListForLot/12/6/1/1",
      "lstContract"
    );
    cy.selectOption("Product", va_Data.product);
    cy.selectOption("Purchase Contract", va_Data.purchase_contract);
    cy.selectOption("Supervisor", va_Data.supervisor);
    cy.addData("WMT", va_Data.wmt);
    cy.addData("H2O %", va_Data.h2o);
    cy.get(".modal-footer > .btn-primary").click();
    cy.get(".invalid-feedback > div").contains("This field is required");
  });
});

function getOptions(...fi_Option) {
  let va_Options = [go_Options[fi_Option[0]].optionName];
  if (fi_Option.length > 1)
    va_Options.push(go_Options[fi_Option[0]].subItems[fi_Option[1]].optionName);
  return va_Options;
}
