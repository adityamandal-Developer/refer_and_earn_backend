const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { z } = require('zod');

class RefereeController {
    verifyReferralCode = async (req, res, next) => {
        try {
            const schema = z.object({
                referrerEmail: z.string().email(),
                referralCode: z.string().length(10),
                refereeName: z.string().min(3).max(50),
                refereeEmail: z.string().email()
            });

            const { error, data } = schema.safeParse(req.body);
            if (error) {
                return res.status(400).json({ error: error.errors[0].message });
            }

            const { referrerEmail, referralCode, refereeName, refereeEmail } = data;

            // Find the referral code and check if it belongs to the referrer
            const referralCodeRecord = await prisma.referralCode.findFirst({
                where: {
                    code: referralCode,
                    referrer: {
                        email: referrerEmail
                    }
                },
                include: {
                    referrer: {
                        include: {
                            referralStatus: true
                        }
                    }
                }
            });

            if (!referralCodeRecord) {
                return res.status(404).json({ error: 'Invalid referral code or referrer email' });
            }

            // Check the status
            const referralStatus = referralCodeRecord.referrer.referralStatus.find(
                status => status.status !== 'REFERRED'
            );

            if (!referralStatus) {
                return res.status(400).json({ error: 'This referral code has already been used' });
            }

            // Create or update Referee
            const referee = await prisma.referee.upsert({
                where: { email: refereeEmail },
                update: {
                    name: refereeName,
                    referrerEmail: referrerEmail,
                    referralCode: referralCode
                },
                create: {
                    email: refereeEmail,
                    name: refereeName,
                    referrerEmail: referrerEmail,
                    referralCode: referralCode
                }
            });

            // Update referral status
            await prisma.referralStatus.update({
                where: { id: referralStatus.id },
                data: { status: 'REFERRED', refereeId: referee.id }
            });

            res.status(200).json({
                message: 'Referral code verified and processed successfully',
                referee: {
                    id: referee.id,
                    name: referee.name,
                    email: referee.email
                }
            });

        } catch (error) {
            next(error);
        }
    };
}

module.exports = new RefereeController();