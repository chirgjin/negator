const request = require("request");
const apiKeys = process.env.API_KEYS.split(",");
const apiKey = function () {
    return apiKeys[ Math.floor(Math.random() * apiKeys.length) ] || apiKey();
};

module.exports = function (req,res,next) {

    try {
        request.post({
            url : process.env.API_URL,
            body : {
                settings : {},
                content : req.body.content,
                language : process.env.API_LANG
            },
            json : true,
            headers : {
                "Ocp-Apim-Subscription-Key" : apiKey()
            }
        }).pipe(res);
    }
    catch (e) {
        res.json({
            error : true
        });
    }
}