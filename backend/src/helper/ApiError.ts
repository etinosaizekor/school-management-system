class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    stack: string = ""
  ) {
    console.log("stack", stack);
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
