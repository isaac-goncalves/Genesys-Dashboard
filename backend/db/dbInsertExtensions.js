const PostExtensions = require("../models/Extensions");

function dbInsertExtensions(jsonResponse) {
    // console.log(jsonResponse);
    jsonResponse.entities.map((json) => {
        let { state, number, ownerType } = json;
        if (state == "active") {
            state = "Em uso";
        }
        let userid = json.owner.id;
        let name = json.owner.name;
        
        let post = new PostExtensions(userid, name, state, number, ownerType);
        post = post.saveExtensions();
    });
}

module.exports = { dbInsertExtensions }