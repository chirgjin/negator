const request = require("request");
const apiKeys = process.env.API_KEYS.split(",");
const apiKey = function () {
    return apiKeys[ Math.floor(Math.random() * apiKeys.length) ] || apiKey();
};

module.exports = function (req,res,next) { 
    console.log(req.body)

    try {
        let data = {
            url : process.env.API_URL,
            body : {
                settings : {
                    snippets : true,
                },
                content : req.body.content,
                language : process.env.API_LANG
            },
            json : true,
            headers : {
                "Ocp-Apim-Subscription-Key" : apiKey()
            }
        };

        console.log(data);

        res.header("Content-type", "application/json");
        const response = request.post(data);
        console.log(response);
        response.pipe(res);
    }
    catch (e) {
        res.json({
            error : true
        });
    }
}