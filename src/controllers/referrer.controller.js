const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

const emailServices = require('../services/emailServices');
const { validateReferral } = require('../utils/validation');

class RefereeController {
    // createReferrer = async (req, res, next) => {
    //     try {

    //         const { email, name } = req.body;
    //         const { error } = validateReferral(req.body);
    //         if (error) return res.status(400).json({ error: error });

    //         // Check if referrer already exists
    //         const existingReferrer = await prisma.referrer.findUnique({ where: { email } });
    //         if (existingReferrer) {
    //             return res.status(400).json({ error: 'Referrer with this email already exists' });
    //         }

    //         // Generate unique referral code
    //         const referralCode = crypto.randomBytes(5).toString('hex');

    //         // Create referrer
    //         const referrer = await prisma.referrer.create({
    //             data: {
    //                 email,
    //                 name,
    //                 referralCodes: {
    //                     create: {
    //                         code: referralCode
    //                     }
    //                 },
    //                 referralStatus: {
    //                     create: {
    //                         status: 'CREATED'
    //                     }
    //                 }
    //             },
    //             include: {
    //                 referralCodes: true,
    //                 referralStatus: true
    //             }
    //         });

    //         // Send email with referral code
    //         await emailServices.sendReferralCodeEmail(referrer.email, referrer.name, referralCode);

    //         res.status(201).json({
    //             message: 'Referrer created successfully',
    //             referrer: {
    //                 id: referrer.id,
    //                 email: referrer.email,
    //                 name: referrer.name,
    //                 referralCode: referralCode
    //             }
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // };
    createReferrer = async (req, res, next) => {
        try {
            const { email, name } = req.body;
            const { error } = validateReferral(req.body);
            if (error) return res.status(400).json({ error: error });

            // Check if referrer already exists
            const existingReferrer = await prisma.referrer.findUnique({ where: { email } });
            if (existingReferrer) {
                return res.status(400).json({ error: 'Referrer with this email already exists' });
            }

            // Generate unique referral code
            const referralCode = crypto.randomBytes(3).toString('hex');

            // Create referrer
            const referrer = await prisma.referrer.create({
                data: {
                    email,
                    name,
                    referralCodes: {
                        create: {
                            code: referralCode
                        }
                    }
                },
                include: {
                    referralCodes: true
                }
            });

            // Create referral status
            await prisma.referralStatus.create({
                data: {
                    status: 'CREATED',
                    referrer: {
                        connect: { id: referrer.id }
                    },
                    referralCode: {
                        connect: { id: referrer.referralCodes[0].id }
                    }
                }
            });

            // Send email with referral code
            await emailServices.sendReferralCodeEmail(referrer.email, referrer.name, referralCode);

            res.status(201).json({
                message: 'Referrer created successfully',
                referrer: {
                    id: referrer.id,
                    email: referrer.email,
                    name: referrer.name,
                    referralCode: referralCode
                }
            });
        } catch (error) {
            next(error);
        }
    };
    getReferrer = async (req, res, next) => {
        try {
            const { id } = req.params;
            const referrer = await prisma.referrer.findUnique({
                where: { id: String(id) },
                include: {
                    referralCodes: true,
                    referralStatus: true,

                }
            });

            if (!referrer) {
                return res.status(404).json({ error: 'Referrer not found' });
            }

            res.status(200).json(referrer);
        } catch (error) {
            next(error);
        }
    };

    getReferrerByEmail = async (req, res, next) => {
        try {
            const { email } = req.params;
            const referrer = await prisma.referrer.findUnique({
                where: { email },
                include: {
                    referralCodes: true,
                    referralStatus: true
                }
            });

            if (!referrer) {
                return res.status(404).json({ error: 'Referrer not found' });
            }

            res.status(200).json(referrer);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new RefereeController();