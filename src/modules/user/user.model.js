const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      validate(value) {
        if (value == "" || value == null || value == undefined) {
          throw new Error("Maritial Status is Mandatory");
        }
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid..");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "Password"');
        }
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    idDeleted: { type: Boolean, default: false },

    language: {
      type: String,
      default: "English",
      required: true,
      enum: ["Hindi", "English"],
    },

    maritialStatus: {
      type: String,
      required: true,
      validate(value) {
        if (value == "" || value == null || value == undefined) {
          throw new Error("Maritial Status is Mandatory");
        }
      },
    },

    dob: {
      type: String,
      required: true,
      validate(value) {
        if (value == "" || value == null || value == undefined) {
          throw new Error("Date of Birth is Mandatory");
        }
      },
    },

    timeOfBirth: {
      type: String,
      required: true,
      validate(value) {
        if (value == "" || value == null || value == undefined) {
          throw new Error("Time of Birth is Mandatory");
        }
      },
    },

    termsAccepted: {
      type: Boolean,
      validate(value) {
        if (value == false) {
          throw new Error("Please accept the terms");
        }
      },
    },

    avatar: {
      type: String,
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
//********RETURN THE JSON OBJECT WITHOUT SENSITIVE DATA**************** */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};
//*******************Find user is present by email the user from Database************************** */
userSchema.statics.findByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return false;
    }
    return user;
  } catch (err) {
    throw new Error(err);
  }
};
//*******************Authenticate the user from Database************************** */
userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Unable to Login");
    }
    return user;
  } catch (err) {
    return "Password Error";
  }
};

//**********HASH PASSWORDS BEFORE SAVING THE DATA************ */
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(
      user.password,
      parseInt(process.env.ROUNDS)
    );
  }
  next();
});

module.exports = User = mongoose.model("User", userSchema);
