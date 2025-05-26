import * as c from "../../../constants.js";

const username = "USRWHAD";
const password = "123456";
let go_Options, gi_Warehouse;

before("Login IXM", () => {
  cy.addService(c.GET, "/account/login", "home");
  cy.addService(c.POST, "/SecurityService/api/user/login", "login");
  cy.visit("/").wait("@home").wait(c.SECOND);
  cy.addData("Userr", username);
  cy.addData("Password", password);
  cy.get("button").contains("Sign In").click();
  cy.useApi("login")
    .then((response) => {
      const data = response.response.body.data;
      gi_Warehouse = data.wareHouses[0].id;
      cy.request({
        method: c.GET,
        url: 'http://localhost:4200/SecurityService/api/User/getMenu/7/2/1',//"https://uataks.eastus.cloudapp.azure.com/SecurityService/api/User/getMenu/7/2/1",
        headers: {
          Authorization: "Bearer " + data.accessToken,
        },
      }).then(({ body }) => {
        go_Options = body.data;
      });
    })
    .wait(c.SECOND);
});

describe("Menu", () => {
  it("Should have options name", () => {
    cy.get("#side-menu").then((menu) => {
      const options = "li > a > div";

      //Valid Options
      cy.get(menu)
        .find(options)
        .each((option, index) => {
          validationOptions(index, option);
        });

      endPoints();
      clicOption("roles", menu, options, getOptions(0, 0));
      clicOption("clients", menu, options, getOptions(0, 1));
      clicOption("services", menu, options, getOptions(1, 0));
      clicOption("servicesT", menu, options, getOptions(1, 1));
      clicOption("orders", menu, options, getOptions(2, 0));
      clicOption("trucks", menu, options, getOptions(3));
      clicOption("piles", menu, options, getOptions(4));
      clicOption("lotsRec", menu, options, getOptions(5, 0));
      clicOption("trucksRec", menu, options, getOptions(5, 1));
      clicOption("trucksRew", menu, options, getOptions(6, 0));
      clicOption("lotsRew", menu, options, getOptions(6, 1));
      clicOption("shipments", menu, options, getOptions(7, 0));
      clicOption("trucksDis", menu, options, getOptions(7, 1));
      clicOption("lotsDis", menu, options, getOptions(7, 2));
    });
  });
});

function validationOptions(fi_Index, fo_Option) {
  cy.get(fo_Option).should((response) => {
    expect(response, "Option " + (fi_Index + 1)).to.contain(
      go_Options[fi_Index].optionName
    );
  });
}

function clicOption(fs_EP, fo_Menu, fv_Option, fs_SelectOption) {
  cy.selectOptionMenu(fo_Menu, fv_Option, fs_SelectOption[0]).then(
    (response) => {
      if (fs_SelectOption.length > 1) {
        cy.selectOptionMenu(
          response.get("Option").parents("li"),
          "ul > li",
          fs_SelectOption[1]
        );
        cy.useApi(fs_EP).wait(c.SECOND);
        cy.get(response.get("Option")).click().wait(500);
      } else cy.useApi(fs_EP).wait(c.SECOND);
    }
  );
}

function getOptions(...fi_Option) {
  let va_Options = [go_Options[fi_Option[0]].optionName];
  if (fi_Option.length > 1)
    va_Options.push(go_Options[fi_Option[0]].subItems[fi_Option[1]].optionName);
  return va_Options;
}

function endPoints() {
  const search = "/Search/" + gi_Warehouse + "/1/10";
  const role = "/GetRoleByField/2?value=&page=1&limit=10";
  cy.addService(c.GET, c.EP_Role + role, "roles");
  cy.addService(c.POST, c.EP_Client + "/search/1/1/10", "clients");
  cy.addService(c.POST, c.EP_Contract + search, "services");
  cy.addService(c.POST, c.EP_ContractT + search, "servicesT");
  cy.addService(c.POST, c.EP_Order + "/Search", "orders");
  cy.addService(c.POST, c.EP_Truck + "/SearchTrucks", "trucks");
  cy.addService(c.POST, c.EP_Lot + "/Search", "lotsRec");
  cy.addService(c.POST, c.EP_Pile + search, "piles");
  cy.addService(c.POST, c.EP_Truck + "/Search", "trucksRec");
  cy.addService(c.POST, c.EP_Truck + "/ReWeightTrucks/12/1/10", "trucksRew");
  cy.addService(c.POST, c.EP_LotR + search, "lotsRew");
  cy.addService(c.POST, c.EP_SI + search, "shipments");
  cy.addService(c.POST, c.EP_Dispatch + "/SearchTruck", "trucksDis");
  cy.addService(c.POST, c.EP_Dispatch + "/SearchLot", "lotsDis");
}
