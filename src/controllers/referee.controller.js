const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { z } = require('zod');

class RefereeController {

    verifyReferralCode = async (req, res, next) => {
        try {
            const schema = z.object({
                referralCode: z.string().length(6),
                refereeName: z.string().min(1).max(50),
                refereeEmail: z.string().email()
            });

            const { error, data } = schema.safeParse(req.body);
            if (error) {
                return res.status(400).json({ error: error.errors[0].message });
            }

            const { referralCode, refereeName, refereeEmail } = data;

            // Find the referral code
            const referralCodeRecord = await prisma.referralCode.findUnique({
                where: { code: referralCode },
                include: {
                    referrer: true,
                    referralStatus: true
                }
            });

            if (!referralCodeRecord) {
                return res.status(404).json({ error: 'Invalid referral code' });
            }

            // Check if the referral code has already been used
            if (referralCodeRecord.referralStatus?.status === 'REFERRED') {
                return res.status(400).json({ error: 'This referral code has already been used' });
            }

            // Create or update Referee
            const referee = await prisma.referee.upsert({
                where: { email: refereeEmail },
                update: {
                    name: refereeName,
                    referrerEmail: referralCodeRecord.referrer.email,
                    referralCode: referralCode
                },
                create: {
                    email: refereeEmail,
                    name: refereeName,
                    referrerEmail: referralCodeRecord.referrer.email,
                    referralCode: referralCode
                }
            });

            // Update or create referral status
            await prisma.referralStatus.upsert({
                where: { referralCodeId: referralCodeRecord.id },
                update: {
                    status: 'REFERRED',
                    refereeId: referee.id
                },
                create: {
                    referrerId: referralCodeRecord.referrerId,
                    refereeId: referee.id,
                    status: 'REFERRED',
                    referralCodeId: referralCodeRecord.id
                }
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