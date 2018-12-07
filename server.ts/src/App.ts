import * as express from 'express';
import lookup from './Lookup' 
import letter from './Letter'

class App {
    public express

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        router.use(express.json())
        router.get('/v1/lookup', (req, res) => {
            lookup.findCongressPeople(req.query.address, req.query.city, req.query.state, req.query.zip)
                .then(data => res.json(data));
        });

        router.post('/v1/letters', (req, res) => {
            const {from, letters, stripeToken} = req.body;
            letter.sendLetters(from, letters, stripeToken).then(data => res.json(data));
        });

        router.get('/v1/track-letter', (req, res) => {
            // '/v1/track-letter?letter-id=1234
            const letterId = req.query['letter-id']
            if (!letterId) {
                // panic
            } else {
                const asyncTI = letter.getTrackingInfo(letterId)
                asyncTI.then(data => res.json(data))
            }

        })
        this.express.use('/', router);
    }
}

export default new App().express;
