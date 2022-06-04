class FailException extends Error {
  constructor(message) {
      super(message);
      this.name = "FailException";
  }
}

module.exports = FailException