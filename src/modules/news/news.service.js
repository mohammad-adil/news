const News = require("./news.model");
const path = require("path");
const { generateResponse } = require("../../middleware/responseHandler");
const helper = require("../../common/helper/helper");
exports.doAddNews = async (req, res, next) => {
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
    const updates = Object.keys(req.body); //Requested updates
    const allowedUpdates = [
      "newsTitle",
      "newsDescription",
      "author",
      "avatar",
      "technology",
    ];
    const newUpdateAllowed = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!newUpdateAllowed) {
      return res
        .status(400)
        .send({ message: "The body you passed is not valid" });
    }

    const news = new News(req.body);
    let result = await news.save();

    if (!result) {
      response = await generateResponse(
        [],
        "",
        500,
        "Something Went wrong. The request body is not found"
      );
      res.status(500).send(response);
    }

    response = await generateResponse(
      result,
      "",
      201,
      "News Created Succeddfully"
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

exports.doUpdateNews = async (req, res, next) => {
  try {
    console.log(req.url);
    let response = "";
    const check = helper.bodyCheck(req.body);
    const { _id } = req.params;
    if (!check || !_id) {
      response = await generateResponse(
        [],
        "",
        500,
        "Something Went wrong. The request body is not found/Id nor Provided"
      );
      res.status(500).send(response);
    }
    const updates = Object.keys(req.body); //Requested updates
    const allowedUpdates = [
      "newsTitle",
      "newsDescription",
      "technology",
      "author",
      "avatar",
    ];
    const newUpdateAllowed = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!newUpdateAllowed) {
      return res.status(400).send({
        message: "The body you passed is not valid. Update Not Allowed",
      });
    }

    const updateNews = req.body;
    const query = _id;
    let news = await News.findByIdAndUpdate(query, updateNews, { new: true });

    if (!news) {
      response = await generateResponse(
        [],
        "",
        500,
        "Something Went wrong. try gain"
      );
      res.status(500).send(response);
    }

    response = await generateResponse(
      news,
      "",
      200,
      "News Updated successfully"
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

exports.doDeleteNews = async (req, res, next) => {
  try {
    console.log(req.url);
    let response = "";
    const { _id } = req.params;
    if (!_id) {
      response = await generateResponse(
        [],
        "",
        500,
        "Something Went wrong. The request Id not Provided"
      );
      res.status(500).send(response);
    }
    let news = await News.findByIdAndUpdate(
      { _id },
      { isDeleted: true },
      { new: true }
    );

    if (!news) {
      response = await generateResponse(
        [],
        "",
        500,
        "Something Went wrong. try gain"
      );
      res.status(500).send(response);
    }

    response = await generateResponse(
      news,
      "",
      200,
      "News Deleted successfully"
    );
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

exports.doGetAllNews = async (req, res, next) => {
  try {
    console.log(req.url);
    let { search, sort, technology, author, skip } = req.query;

    search = search == "" || search == undefined ? "" : search;
    sort = sort == "" || sort == undefined ? "asc" : sort;
    technology = technology == "" || technology == undefined ? "" : technology;
    author = author == "" || author == undefined ? "" : technology;
    skip = skip == "" || skip == undefined ? 0 : skip;

    const regex = new RegExp(search, "i");
    let news = "";
    if (
      technology == "" ||
      technology == undefined ||
      author == "" ||
      author == undefined
    ) {
      news = await News.find({ isDeleted: false })
        .sort(sort)
        .skip(parseInt(skip))
        .limit(10);
    } else {
      news = await News.find({
        $and: [
          {
            $or: [{ technology }, { author }],
          },

          { isDeleted: false },
          { newsTitle: regex },
        ],
      })
        .sort(sort)
        .skip(parseInt(skip))
        .limit(10);
    }

    res.send(news);
  } catch (err) {
    next(err);
  }
};
