import {
  ValidationError,
  InternalServerError,
  MethodNotAllowedError,
} from "./errors";

function onError(error, req, res) {
  if (error instanceof ValidationError) {
    console.log("error", error);
    return res.status(error.statusCode).json(error);
  }

  const publicError = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });
  return res.status(publicError.statusCode).json(publicError);
}

function onNoMatch(req, res) {
  const publicError = new MethodNotAllowedError();
  res.status(publicError.statusCode).json(publicError);
}

const controller = {
  errorHandler: {
    onError,
    onNoMatch,
  },
};

export default controller;
