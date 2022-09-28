const PostExtensionsRanges = require("../models/ExtensionsRanges");

async function dbInsertExtensionsRanges(prefix, end) {
    // console.log("\n" + "prefix: " + prefix, "\n" + "end: " + end);
    let post = new PostExtensionsRanges(prefix, end);
    post = await post.saveExtensionsRanges();
    return
  }
  module.exports = {dbInsertExtensionsRanges}