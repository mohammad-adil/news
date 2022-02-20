const responseCode = new Map([
  ["404", "NOT_FOUND"],
  ["200", "OK"],
  ["201", "CREATED"],
  ["400", "BAD_REQUEST"],
  ["401", "UN_AUTHORIZED"],
  ["403", "FORBIDDEN"],
  ["500", "INTERNAL_SERVER_ERROR"],
  ["503", "SERVICE_UNAVAILABLE"],
  ["406", "NOT_ACCEPTED"],
]);
module.exports.generateResponse = async (data, token, status, Message) => {
  try {
    let response = {
      data,
      type: responseCode.get(status.toString()),
      status,
      Message,
      token,
    };
    return response;
  } catch (err) {
    return err;
  }
};
