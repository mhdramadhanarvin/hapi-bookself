class ErrorException extends Error {
  constructor(message) {
      super(message);
      this.name = "ErrorException";
  }
}

module.exports = ErrorException