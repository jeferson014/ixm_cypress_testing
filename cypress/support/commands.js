import { ARROBA, CALL, SECOND } from "../../constants";

// --> Crear Json
Cypress.Commands.add("csvToJson", (ca_Data) => {
  const vs_Lines = ca_Data.split("\n");
  const va_Headers = vs_Lines[0].replace("\r", "").split(",");
  let va_result = {};
  if (vs_Lines.length - 1 === 1)
    throw new Error(
      "No se ingresaron datos en CSV o no tiene una fila al final vacía"
    );
  for (let i = 1; i < vs_Lines.length - 1; i++) {
    let va_obj = {};
    const va_Currentline = vs_Lines[i].replace("\r", "").split(",");
    for (let j = 1; j < va_Headers.length; j++)
      va_obj[va_Headers[j]] = va_Currentline[j];
    va_result[va_Currentline[0]] = va_obj;
  }
  return va_result;
});

// --> Crear Interceptores Datos
Cypress.Commands.add("addService", (cs_Method, cs_Service, cs_Name) => {
  cy.intercept(cs_Method, cs_Service, cy.spy().as(CALL + cs_Name)).as(cs_Name);
});

// --> Validar Endpoint
Cypress.Commands.add("useApi", (cs_Service) => {
  const vs_MethodService = ARROBA + String(cs_Service);
  const vs_CallService = ARROBA + CALL + String(cs_Service);
  cy.get(vs_CallService, { timeout: 30000 })
    .wait(vs_MethodService)
    .should((response) => {
      if (response.response === undefined)
        throw new Error("Servicio '" + response.request.url + "' no response");
      const vi_Status = response.response.statusCode;
      if (vi_Status === 401) throw new Error("Iniciar Sesión");
      if (vi_Status === 200) return;
      if (vi_Status === 400) return;
      if (vi_Status === 403) return;
      if (vi_Status === 412) return;
      if (vi_Status !== 200 && vi_Status !== 403 && vi_Status !== 412)
        throw new Error(
          "Servicio '" + response.request.url + "' status " + vi_Status
        );
      throw new Error("Servicio '" + response.request.url + "' no response");
    });
});

// --> seleccionar Opción del Menú
Cypress.Commands.add("selectOptionMenu", (co_Option, cs_Find, cs_Option) => {
  const vm_Response = new Map();
  cy.get(co_Option)
    .find(cs_Find)
    .each((option) => {
      if (option.text().trim() == cs_Option) {
        expect(option, "Option").to.contain(cs_Option);
        vm_Response.set("Valid", true);
        vm_Response.set("Option", option);
        cy.get(option).click();
      }
    })
    .then(() => {
      if (!vm_Response.get("Valid"))
        throw new Error("No se encontró la opción '" + cs_Option + "'");
      return cy.wrap(vm_Response);
    });
});

// --> Agregar Datos
Cypress.Commands.add("addData", (cs_Name, cs_Data) => {
  const vs_Name = String(cs_Name);
  cy.get("body").then((body) => {
    for (const va_Label of body.find("form").find("label")) {
      if (body.find(va_Label).text() === cs_Name) {
        const vo_Label = body.find(va_Label).parent().find("input");
        expect(vo_Label, "Se encontró el campo '" + vs_Name + "'").exist;
        cy.get(vo_Label).type(cs_Data);
        return;
      }
    }
    throw new Error("No se encontró el campo '" + vs_Name + "'");
  });
});

// --> Seleccionar Opciones
Cypress.Commands.add("selectOption", (cs_Name, cs_Selected) => {
  const vs_Name = String(cs_Name);
  cy.get("modal-container").then((modal) => {
    for (const va_Label of modal.find("form").find("label")) {
      if (modal.find(va_Label).text().trim() === cs_Name) {
        const vo_Select = modal.find(va_Label).parent().find("ng-select");
        expect(vo_Select, "Se encontró el campo '" + vs_Name + "'").exist;
        cy.get(vo_Select).click().wait(1000);
        cy.get("modal-container").then((modal) => {
          for (const va_Option of modal
            .find(vo_Select)
            .find("ng-dropdown-panel > div > div > div")) {
            if (modal.find(va_Option).text().trim() === cs_Selected) {
              cy.get(va_Option).click();
              return;
            }
          }
          throw new Error("No se encontró la opción '" + cs_Selected + "'");
        });
        return;
      }
    }
    throw new Error("No se encontró el campo '" + vs_Name + "'");
  });
});
Cypress.Commands.add("selectOption2", (cs_Name, cs_Selected) => {
  const vs_Name = String(cs_Name);
  cy.get(".modal-content").then((modal) => {
    for (const va_Label of modal.find("form").find("label")) {
      if (modal.find(va_Label).text().trim() === cs_Name) {
        const vo_Select = modal.find(va_Label).parent().find("ng-select");
        expect(vo_Select, "Se encontró el campo '" + vs_Name + "'").exist;
        cy.get(vo_Select).click().wait(1000);
        cy.get(".modal-content").then((modal) => {
          for (const va_Option of modal
            .find(vo_Select)
            .find("ng-dropdown-panel > div > div > div")) {
            console.log(modal.find(va_Option),modal.find(va_Option).text());
            if (modal.find(va_Option).text().trim() === cs_Selected) {
              cy.get(va_Option).click();
              return;
            }
          }
          throw new Error("No se encontró la opción '" + cs_Selected + "'");
        });
        return;
      }
    }
    throw new Error("No se encontró el campo '" + vs_Name + "'");
  });
});

Cypress.Commands.add(
  "clickOption",
  (cs_EP, co_Menu, cv_Option, cs_SelectOption) => {
    cy.selectOptionMenu(co_Menu, cv_Option, cs_SelectOption[0]).then(
      (response) => {
        if (cs_SelectOption.length > 1) {
          cy.selectOptionMenu(
            response.get("Option").parents("li"),
            "ul > li",
            cs_SelectOption[1]
          );
          cy.useApi(cs_EP).wait(SECOND);
          cy.get(response.get("Option")).click().wait(500);
        } else cy.useApi(cs_EP).wait(SECOND);
      }
    );
  }
);

Cypress.Commands.add(
  "clickOption2",
  (co_Menu, cv_Option, cs_SelectOption) => {
    cy.selectOptionMenu(co_Menu, cv_Option, cs_SelectOption[0]).then(
      (response) => {
        if (cs_SelectOption.length > 1) {
          cy.selectOptionMenu(
            response.get("Option").parents("li"),
            "ul > li",
            cs_SelectOption[1]
          );
          cy.get(response.get("Option")).click().wait(10000);
        }
      }
    );
  }
);

// Comando personalizado para login
Cypress.Commands.add('login', (username = 'admin', password = '123456', company = '1', module = 'WAREHOUSE') => {
  cy.visit('https://ixm-nexusdev.azurewebsites.net/account/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait(2000); // Espera a que aparezca el modal
  cy.get('modal-container .form-select[formcontrolname="companyId"]').select(company);
  cy.get('modal-container .form-select[formcontrolname="moduleId"]').select(module);
  cy.get('modal-container .btn.btn-primary').click();
  cy.url().should('not.eq', 'https://ixm-nexusdev.azurewebsites.net/account/login');
});

// import addContext from 'mochawesome/addContext';
// const titleToFileName = (title) => title.replace(/[:\/]/g, '');

// Cypress.on('test:after:run', (test, runnable) => {
//     if (test.state === 'failed') {
//         const filename = `${titleToFileName(runnable.parent.title)} -- ${titleToFileName(test.title)} (failed).png`;
//         addContext({ test }, `../screenshots/${Cypress.spec.name}/${filename}`);
//         addContext({ test }, `../videos/${Cypress.spec.name}.mp4`);
//     }
// });