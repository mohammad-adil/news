const User = require("./user.model");
const { generateResponse } = require("../../middleware/responseHandler");
const helper = require("../../common/helper/helper");
const bcrypt = require("bcrypt");

exports.doSignup = async (req, res, next) => {
  try {
    console.log(req.url);
    let response = "";
    const check = helper.bodyCheck(req.body);

    if (!check) {
      response = await generateResponse(
        [],
        "",
        500,
        "Something Went wrong. The request body is not found"
      );
      res.status(500).send(response);
    }

    const userCheck = await User.findByEmail(req.body.email);

    if (!userCheck) {
      const updates = Object.keys(req.body); //Requested updates
      const allowedUpdates = [
        "timeOfBirth",
        "termsAccepted",
        "userName",
        "email",
        "password",
        "phone",
        "gender",
        "language",
        "maritialStatus",
        "dob",
      ];

      const newUpdateAllowed = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!newUpdateAllowed)
        return res
          .status(400)
          .send({ message: "The body you passed is not valid" });

      const user = new User(req.body);
      let result = await user.save();

      if (!result) {
        response = await generateResponse(
          [],
          [],
          500,
          "Something Went wrong. The request body is not found"
        );
        res.status(500).send(response);
      }
    }
    //****If user is present Update user */

    const update = req.body;
    const query = userCheck._id;

    console.log("************** Before ********");
    console.log(userCheck);
    for (let element in update) {
      userCheck[element] = update[element];
    }

    const updateUserNow = await userCheck.save();

    if (!updateUserNow) {
      response = generateResponse(
        [],
        [],
        500,
        "Something Went wrong. Please Try again"
      );
      res.status(500).send(response);
    }

    response = generateResponse(updateUserNow, [], 200, "User updated");
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};
