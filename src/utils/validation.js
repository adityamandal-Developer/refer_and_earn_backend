const { z } = require('zod');

const referralSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    // referredBy: z.string().min(3).max(50)
});

exports.validateReferral = (referral, requireAllFields = true) => {
    let schema = referralSchema;

    if (!requireAllFields) {
        schema = schema.partial();
    }

    try {
        const validatedData = schema.parse(referral);
        return { value: validatedData };
    } catch (error) {
        return { error: error.errors };
    }
};