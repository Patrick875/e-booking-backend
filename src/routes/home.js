import express from 'express';
const router = express.Router();

router.get('^/$|/index(.html)?', (req, res) => {
    return res.status(200).json({"message": "this should route you homepage"});
});

module.exports = router;