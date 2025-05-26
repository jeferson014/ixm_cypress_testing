// import addContext from 'mochawesome/addContext';

// const titleToFileName = (title) => title.replace(/[:\/]/g, '');

// Cypress.on('test:after:run', (test, runnable) => {
//     if (test.state === 'failed') {
//         const filename = `${titleToFileName(runnable.parent.title)} -- ${titleToFileName(test.title)} (failed).png`;
//         addContext({ test }, `../screenshots/${Cypress.spec.name}/${filename}`);
//         addContext({ test }, `../videos/cypress/${Cypress.spec.name}.mp4`);
//     }
// });