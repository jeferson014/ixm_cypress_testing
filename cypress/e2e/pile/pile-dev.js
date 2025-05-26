import * as c from "../../constants.js";

const username = "gmarti";
const password = "123456";
let go_Options, gi_Warehouse, ga_Data,localData;


beforeEach("Login IXM", () => {
  cy.readFile("cypress/fixtures/csv/pile-data-dev.csv", "utf8").then((data) => {
    cy.csvToJson(data).then((result) => {
      cy.writeFile("cypress/fixtures/pile-dev.json", result, "utf8");
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
        url: "https://devaksnexus.eastus.cloudapp.azure.com/SecurityService/api/User/getMenu/13/2/1",
        headers: {
          Authorization: "Bearer " + data.accessToken,
        },
      }).then(({ body }) => {
        console.log('getmenu',body);
        go_Options = body.data;
        cy.wait(3000);
        localData=JSON.parse(localStorage.getItem("currentUser"));
      });
    })
    .wait(c.SECOND);
  cy.fixture("pile-dev").then((data) => {
    ga_Data = data;
  });
});

describe("Pile", () => {
  it("Register Pile", () => {
    const va_Data = ga_Data["scenario01"];
    cy.log(va_Data);
    cy.get("#side-menu").then((menu) => {
      cy.clickOption2(menu, "li > a > div", getOptions(4));
    });
    cy.get(".col-lg-2 > :nth-child(2)").click();
    cy.wait(2000);
    cy.selectOption2("Pile Type", va_Data.pile_type);
    cy.selectOption2("Client", va_Data.client);
    cy.selectOption2("Location", va_Data.location);
    cy.addData('Pile Description','test');

    cy.selectOption2("Stock Group", va_Data.stock_group);
    cy.selectOption2("Pile Product", va_Data.pile_product);
    cy.get(".modal-footer > .btn-primary").click();
    cy.get(".swal2-confirm").click();
    cy.get(".ng-trigger").contains("has been successfully created");
  });

});

function getOptions(...fi_Option) {
  let va_Options = [go_Options[fi_Option[0]].optionName];
  if (fi_Option.length > 1)
    va_Options.push(go_Options[fi_Option[0]].subItems[fi_Option[1]].optionName);
  return va_Options;
}
