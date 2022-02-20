module.exports = (err, req, res, next) => {
  try {
    console.log(err.message);
    if (err.code && err.code == 11000)
      return (err = handleDuplicateKeyError(err, res));

    if (err.message) {
      res
        .status(500)
        .send({ message: "An unknown error occurred.", Error: err.message });
    }
  } catch (err) {
    res.status(500).send("An unknown error occurred.");
  }
};
//handle email or username duplicates
const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const code = 409;
  res.status(code).send(`An account with that ${field} already exists.`);
};
