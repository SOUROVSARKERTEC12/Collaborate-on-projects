import nodemailer from 'nodemailer';
import otpGenerator from "otp-generator"; // To send emails

/**
 * Email OTP Service
 */


const EmailOTPService = {
    /**
     * Generate and store an OTP for a user
     * @returns {string} The generated OTP
     */
    generateOTP: function () {
        // Generate a 6-digit OTP
        return otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true,
        });
    },


    /**
     * Send the OTP to the user's email
     * @param {string} userId - The user's ID
     * @param {string} email - The user's email address
     * @param {string} otp - The OTP to send
     */
    async sendOTP(otp, email) {


        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service provider
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${email}`);
        } catch (error) {
            console.error('Error sending OTP email:', error);
            throw new Error('Failed to send OTP email');
        }
    },

    /**
     * Validate email, password, and OTP
     * @param {string} email - The user's email
     * @param {string} password - The user's password
     * @param {string} inputOtp - The OTP provided by the user
     * @returns {boolean} Whether all validations pass
     */
    async validateUser(email, password, inputOtp) {
        // Step 1: Find the user by email
        const user = await User.findOne({where: {email}});
        if (!user) {
            throw new Error('User not found');
        }

        // Step 2: Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // Step 3: Validate the OTP
        const otpEntry = await OTPStore.findOne({
            where: {
                userId: user.id,
                otp: inputOtp,
                used: false,
            },
        });

        if (!otpEntry) {
            throw new Error('Invalid or expired OTP');
        }

        if (new Date() > otpEntry.expiresAt) {
            throw new Error('OTP has expired');
        }

        // Mark OTP as used
        otpEntry.used = true;
        await otpEntry.save();

        return true;
    },
};

export default EmailOTPService;
