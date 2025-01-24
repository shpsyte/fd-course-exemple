import { InternalServerError, MethodNotAllowedError } from "./errors";

function onError(error, req, res) {
  console.error(error);
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
