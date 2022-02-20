exports.bodyCheck = async (body) => {
  if (Object.keys(body).length == undefined || Object.keys(body).length == 0) {
    return false;
  }
  return true;
};
