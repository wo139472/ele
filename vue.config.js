const data = require("./data.json")

const seller = data.seller
const goods = data.goods
const ratings = data.ratings

module.exports = {
    configureWebpack: {
        devServer: {
            before(app) {
                app.get("/api/seller", function (req, res) {
                    res.json({
                        data: seller
                    })
                })
                app.get("/api/goods", function (req, res) {
                    res.json({
                        data: goods
                    })
                })
                app.get("/api/ratings", function (req, res) {
                    res.json({
                        data: ratings
                    })
                })
            },
            proxy:{
                "/git":{
                    target:"https://api.github.com/",
                    changeOrigin:true,
                    pathRewrite:{"^/git":""}
                }
            }
        }
    }
}