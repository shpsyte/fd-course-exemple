// import { test, expect } from "jest";
const calculadora = require("../models/calculadora.js");

describe("Calculadora", () => {
  it("somar 2 +  2 deveria retoranr 4", () => {
    const total = calculadora.somar(2, 2);
    expect(total).toBe(4);
  });

  it("somar 100 +  5 deveria retoranr 4", () => {
    const total = calculadora.somar(5, 100);
    expect(total).toBe(105);
  });

  it("somar 'banana' +  5 deveria retoranr Erro", () => {
    const total = calculadora.somar("banana", 100);
    expect(total).toBe("Erro");
  });

  it("somar null or undefined + anythin deveria retoranr Erro", () => {
    const total = calculadora.somar(null, 100);
    expect(total).toBe("Erro");
  });

  it("somar null or undefined + anythin deveria retoranr Erro", () => {
    const total = calculadora.somar(null, null);
    expect(total).toBe("Erro");
  });

  it("somar null or undefined + anythin deveria retoranr Erro", () => {
    const total = calculadora.somar(undefined, undefined);
    expect(total).toBe("Erro");
  });
});

// test(" espero que 1 seja 1", () => {
//   const esperado = 10;
//   const test = 10;
//   expect(test).toBe(esperado);
// });

// test("nome do teste", () => {
//   console.log("This is a simple test");
// });

// test("testando outra condicao", () => {
//   console.log(`Esse eh outro teste`);
// });
