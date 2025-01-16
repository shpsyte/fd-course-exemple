export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Internal Server Error", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Please contact support";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
export class MethodNotAllowedError extends Error {
  constructor() {
    super("Method Not Allowed");
    this.name = "MethodNotAllowedError";
    this.action = "Pls check the allowed methods for this endpoint";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
