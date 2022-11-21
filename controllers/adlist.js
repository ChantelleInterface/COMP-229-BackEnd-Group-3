/*
    Comp-229 Web Application Development Group 3
    Chafanarosa Buy and Sell Used Products
    This Website will enable users to post and view advertisements for used		
    products
	
    Developers
    Fatimah Binti Yasin – 301193282
    Nandagopan Dilip – 301166925
    Chantelle Lawson – 301216199
    Ronald Jr Ombao – 301213219
    Santiago Sanchez Calle – 300648373

    Copyright All Rights Reserved
*/

// create a reference to the model
let Advertisement = require('../models/advertisement');

function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    }
    if (err.message) {
        return err.message;
    } else {
        return 'Unknown server error';
    }
};

module.exports.getAdvertisement = async function (req, res, next) {
    try {
        let advertisements = await Advertisement.findOne({ _id: req.params.id }).populate({
            path: 'owner',
            select: 'firstName lastName email username admin created'
        }).exec();

        res.status(200).json({
            data: advertisements
        });

    } catch (error) {
        return res.status(400).json(
            {
                success: false,
                message: getErrorMessage(error)
            }
        );
    }
}


module.exports.getAdvertisements = async function (req, res, next) {
    try {
        let advertisements = await Advertisement.find().populate({
            path: 'owner',
            select: 'firstName lastName email username admin created'
        });

        res.status(200).json({
            data: advertisements
        });

    } catch (error) {
        return res.status(400).json(
            {
                success: false,
                message: getErrorMessage(error)
            }
        );
    }
}

module.exports.updateAdvertisement = async (req, res, next) => {
    try {
        let updatedItem = await Advertisement.findOneAndUpdate({ _id: req.params.id }, {
            adsTitle: req.body.adsTitle,
            price: req.body.price,
            status: req.body.status,
            description: {
                itemName: req.body.description.itemName,
                description: req.body.description.description,
                category: req.body.description.category,
                condition: req.body.description.condition,
            },
            activeDate: req.body.activeDate,
            expiryDate: req.body.expiryDate
            // If it does not have an owner it assumes the ownership otherwise it transfers it.
            // owner: (req.body.owner == null || req.body.owner == "")? req.payload.id : req.body.owner 
        }, { returnOriginal: false })

        console.log(updatedItem)
        res.status(200).json({
            data: updatedItem
        })

    } catch (error) {
        return res.status(400).json(
            {
                success: false,
                message: getErrorMessage(error)
            }
        );
    }
}

module.exports.createAdvertisement = (req, res, next) => {
    console.log(req.body);
    try {
        let newAdvertisement = Advertisement({
            adsTitle: req.body.adsTitle,
            price: req.body.price,
            status: req.body.status,
            description: {
                itemName: req.body.description.itemName,
                description: req.body.description.description,
                category: req.body.description.category,
                condition: req.body.description.condition,
            },
            activeDate: req.body.activeDate,
            expiryDate: req.body.expiryDate,
            // tags: (req.body.tags == null || req.body.tags == "") ? "": req.body.tags.split(",").map(word => word.trim()),
            // If it does not have an owner it assumes the ownership otherwise it transfers it.
            // owner: (req.body.owner == null || req.body.owner == "")? req.payload.id : req.body.owner 
        });

        Advertisement.create(newAdvertisement, (err) => {
            if (err) {
                console.log(err);

                return res.status(400).json(
                    {
                        success: false,
                        message: getErrorMessage(err)
                    }
                );
            }

            res.status(200).json({
                data: newAdvertisement
            })
            console.log(newAdvertisement);
        });
    } catch (error) {
        return res.status(400).json(
            {
                success: false,
                message: getErrorMessage(error)
            }
        );
    }
}

module.exports.performDelete = (req, res, next) => {
    res.status(405).json({
        success: false,
        message: 'Method not allowed'
    })
}
