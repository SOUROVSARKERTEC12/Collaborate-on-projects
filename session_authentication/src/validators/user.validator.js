import { z } from 'zod';

export const userValidationSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    email: z
        .string()
        .email('Email must be a valid email address'),
    firstName: z
        .string()
        .optional(),
    lastName: z
        .string()
        .optional(),
    verified: z.boolean().default(false),
    firstVisit: z.boolean().default(true),
});

export const validateUser = (data) => {
    try {
        return userValidationSchema.parse(data);
    } catch (error) {
        // Return validation errors as an array
        throw new Error(
            JSON.stringify(
                error.errors.map((err) => ({
                    field: err.path[0],
                    message: err.message,
                }))
            )
        );
    }
};
