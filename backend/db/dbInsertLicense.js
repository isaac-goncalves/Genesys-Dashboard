const Users = require("../../sequelize/models/users");

async function dbInsertLicense(jsonResponse) {
    // console.log(jsonResponse);
    await jsonResponse.entities.map(async (json) => {
        let { id } = json;

        let license = json.licenses[0];

        // console.log("\n" + "id: " + id, "\n" + "license: " + license);

        await Users.update(
            {
                license: license,
            },
            {
                where: { id: id },
            }
        );
        // let post = new PostLicenses(id, license);
        // post = post.saveLicenses();
    });
}

module.exports = { dbInsertLicense }