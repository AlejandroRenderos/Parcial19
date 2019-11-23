
var User = require('../models/user');
var cookie = require('../models/cookie');
var debug = require('debug')('blog:post_controller');

module.exports.getOne = (req, res, next) => {
    debug("Search Cookie", req.params.id);

    Post.findById(req.params.id)
        .then((cookie) => {
            debug("Found Cookie", cookie);
            if (cookie)
                return res.status(200).json(cookie);
            else
                return res.status(400).json(null)
        })
        .catch(err => {
            next(err);
        });
}

module.exports.create = (req, res, next) => {
    debug("Create Cookie");
    User.findOne({
            username: req.body.author
        })
        .then(user => {
            if (!user) {
                throw new Error("Galleta no existe");
            } else {

                let post = new Post({
                    title: req.body.title,
                    author: user._id,
                    tags: (req.body.tags || "").split(","),
                    state: req.body.state || 'draft',
                    content: req.body.content
                });

                return cookie.save()
            }
        })
        .then(cookie => {
            debug(cookie);
            return res
                .header('Location', '/cookie/' + cookie.title)
                .status(201)
                .json({
                    title: cookie.title,
                    _id: cookie._id
                });
        })
        .catch(err => {
            next(err)
        });
}

module.exports.find = (req, res, next) => {
    var perPage = Number(req.query.size) || 10,
        page = req.query.page > 0 ? req.query.page : 0;

    debug("Cookie List", {
        size: perPage,
        page,
        search: req.params.search
    });

    var filter = {
        state: {
            "$ne": "draft"
        }
    }

    if (!req.listCookie) {

        filter = {
            ...filter,
            "$or": [{
                    $text: {
                        $search: req.params.search
                    }
                },
                {
                    "tags": {
                        "$regex": `${req.params.search}`
                    }
                }
            ]
        }
    }

    debug("Filter With", filter);


    cookie.find()
        .where(filter)
        .limit(perPage)
        .skip(perPage * page)
        .then((cookies) => {
            debug("Count Cookie", cookies.length);
            return res.status(200).json(cookies)
        }).catch(err => {
            next(err);
        });
}

module.exports.update = (req, res, next) => {
    debug("Post Cookie", req.params.id);

    let update = {
        ...req.body
    };


    cookie.findByIdAndUpdate(req.params.id, update)
        .then((updated) => {
            if (updated)
                return res.status(200).json(updated);
            else
                return res.status(400).json(null);
        }).catch(err => {
            next(err);
        });

}

module.exports.delete = (req, res, next) => {

    debug("Delete Cookie", req.params.id);

    cookie.findByIdAndDelete(req.params.id)
        .then((data) => {
            if (data) res.status(200).json(data);
            else res.status(404).send();
        }).catch(err => {
            next(err);
        })
}