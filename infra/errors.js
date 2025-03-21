export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Internal Server Error", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Please contact support";
    this.statusCode = statusCode || 500;
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

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service is unavailable at this time", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Please contact support";
    this.statusCode = 503;
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

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Um erro de valicao happened", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Please contact support";
    this.statusCode = 400;
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

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Resource not found", {
      cause,
    });
    this.name = "NotFoundError";
    this.action = action || "Please contact support";
    this.statusCode = 404;
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
