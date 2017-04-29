import express = require('express');
import bodyParser = require('body-parser');
let json = require('./movie.json');

let app = express();
let router = express.Router();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.route('/')
    .get((req, res) => {
        res.status(200).json(json);
    })
    .post((req, res) => {
        let id = req.body.Id,
            title = req.body.Title,
            year = req.body.Year,
            rating = req.body.Rating;

        if (id && title && year && rating) {
            json.push(req.body);
            res.status(201).json(json);
        } else {
            res.status(500).json({ error: "There was an error." });
        }
    });
router.route('/:id')
    .get((req, res) => {
        let id = req.params.id;

        for (var i = 0; i < json.length; i++) {
            var element = json[i];
            if (element.Id == id) {
                res.status(200).json(element);
            }
        }
    })
    .put((req, res) => {
        let id = req.params.id;

        if (id && req.body.Title && req.body.Year && req.body.Rating) {
            for (var i = 0; i < json.length; i++) {
                var element = json[i];

                if (element.Id == id) {
                    element.Title = req.body.Title;
                    element.Year = req.body.Year;
                    element.Rating = req.body.Rating;
                }
            }

            res.status(200).json(json);
        } else {
            res.status(500).json({ error: "There was an error." });
        }
    })
    .delete((req, res) => {
        let indexToDel = -1;

        for (var i = 0; i < json.length; i++) {
            var element = json[i];

            if (element.Id == req.params.id) {
                indexToDel = i;
            }
        }

        if (~indexToDel) {
            json.splice(indexToDel, 1);
        }

        res.status(200).json(json);
    });

app.use('/v1/', router);

app.listen(app.get('port'), (err) => {
    if (err) throw err;

    console.log(`Server running: localhost:${app.get('port')}`);
});