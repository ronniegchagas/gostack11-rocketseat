import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach(error => {
    typeof error.path !== 'undefined' ? validationErrors[error.path] : {};
  });

  return validationErrors;
}
