function somar(num1, num2) {
  if (typeof num1 !== "number" || typeof num2 !== "number") {
    return "Erro";
  }

  if (!num1 || !num2) {
    return "Erro";
  }

  return num1 + num2;
}

// commonJS
exports.somar = somar;
