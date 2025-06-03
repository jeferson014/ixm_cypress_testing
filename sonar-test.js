// Archivo de prueba para SonarQube/SonarCloud

function suma(a, b) {
    return a + b;
}

function resta(a, b) {
    // Código innecesario para probar el análisis
    let resultado = a - b;
    if (resultado < 0) {
        return 0;
    }
    return resultado;
}

// Código duplicado intencionalmente para probar la detección
function restaDuplicada(a, b) {
    let resultado = a - b;
    if (resultado < 0) {
        return 0;
    }
    return resultado;
}

console.log('Suma:', suma(2, 3));
console.log('Resta:', resta(5, 8)); 