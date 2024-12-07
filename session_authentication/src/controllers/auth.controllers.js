import {v4 as uuid} from 'uuid';
import bcrypt from 'bcrypt';

import {validateUser} from '../validators/user.validator.js';
import EmailOTPService from '../services/emailOTPServices.js'; // Assuming EmailOTPService is set up for OTP generation
import sequelize from '../config/database.config.js';
import User from "../models/User.js";
import TempUser from "../models/tempUser.js";
import OTPStore from "../models/OTPStore.js";


// Register a new user
export const register = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {
        // Validate input using Zod
        const validatedData = validateUser(req.body);

        // console.log(validatedData)

        // Check if email is already registered or pending in TempUser table
        const existingUser = await User.findOne({where: {email: validatedData.email}});
        if (existingUser) {
            return res.status(400).json({error: 'Email already registered'});
        }

        const tempUser = await TempUser.findOne({where: {email: validatedData.email}});
        if (tempUser) {
            return res.status(400).json({error: 'Email already exists in pending verification'});
        }

        // Create a new TempUser entry

        const tempUserData = await TempUser.create(validatedData, {transaction});

        // Request OTP and send verification email


        const otp = EmailOTPService.generateOTP();

        console.log(otp)

        //const user = await TempUser.create(tempUserData, {transaction});
         await OTPStore.create({otp, userId: tempUserData.id}, {transaction});

        //console.log('after store')
        await EmailOTPService.sendOTP(otp, validatedData.email);

        await transaction.commit();

        res.status(200).json({message: 'Registration initiated. Please verify your email to complete registration.'});
    } catch (error) {

        console.log(error)

        await transaction.rollback();
        res.status(500).json({error: 'Error registering user', details: error.message});
    }
};

// Verify OTP and Complete Registration
export const verifyEmailOTP = async (req, res) => {
    try {
        const {email, otp} = req.body;

        const userEmail = await User.findOne({where: {email: validatedData.email}});

        // Validate OTP
        const otpValid = await EmailOTPService.validateOTP(userEmail, otp);
        if (!otpValid) {
            return res.status(400).json({error: 'Invalid OTP'});
        }

        // Get the temporary user details
        const emailUser = await TempUser.findByPk(email);
        if (!emailUser) {
            return res.status(404).json({error: 'Email user not found'});
        }

        // Move data to User table
        const hashedPassword = await bcrypt.hash(tempUser.password, 10);
        const user = await User.create({
            username: TempUser.username,
            email: TempUser.email,
            password: hashedPassword,
            firstName: TempUser.firstName,
            lastName: TempUser.lastName,
            verified: true, // Mark as verified when moving to the user table
        });

        // Delete TempUser
        await tempUser.destroy();

        res.status(200).json({message: 'User registered successfully', username});
    } catch (error) {
        res.status(500).json({error: 'Error verifying OTP and completing registration', details: error.message});
    }
};

// Login a user
export const login = async (req, res) => {
    try {
        const validatedData = validateUser(req.body);

        // Find user by email
        const user = await User.findOne({where: {email: validatedData.email}});
        if (!user || !(await bcrypt.compare(validatedData.password, user.password))) {
            return res.status(401).json({error: 'Invalid email or password'});
        }

        // Send OTP for verification
        await EmailOTPService.sendOTP(user.id, validatedData.email);

        res.status(200).json({message: 'OTP sent to your email. Please verify to login.'});
    } catch (error) {
        res.status(500).json({error: 'Error during login', details: error.message});
    }
};

// Verify OTP during login
export const verifyLoginOTP = async (req, res) => {
    try {
        const {email, otp} = req.body;

        // Validate OTP
        const otpValid = await EmailOTPService.validateOTP(email, otp);
        if (!otpValid) {
            return res.status(400).json({error: 'Invalid OTP'});
        }

        // Create session
        const user = await User.findOne({where: {email}});
        const sessionId = uuid();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry
        await Session.create({id: sessionId, userId: user.id, expiresAt});

        // Set session cookie
        res.set('Set-Cookie', `session=${sessionId}; HttpOnly; Path=/`);
        res.json({message: 'Login successful'});
    } catch (error) {
        res.status(500).json({error: 'Error verifying OTP', details: error.message});
    }
};

// Logout a user
export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies.session;

        // Clear session
        await Session.destroy({where: {id: sessionId}});

        // Delete OTPs
        const user = await Session.findOne({where: {id: sessionId}});
        if (user) {
            await OTPStore.destroy({where: {userId: user.userId}});
        }

        res.set('Set-Cookie', 'session=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
        res.json({message: 'Logout successful'});
    } catch (error) {
        res.status(500).json({error: 'Error during logout', details: error.message});
    }
};

// Homepage route
export const homepage = async (req, res) => {
    try {
        const sessionId = req.cookies.session;

        // Check if session exists
        const session = await Session.findOne({where: {id: sessionId}});
        if (!session) {
            return res.status(403).json({message: 'Unauthorized. Please log in.'});
        }

        // Check if the user is visiting for the first time
        const user = await User.findByPk(session.userId);
        if (!user.firstVisit) {
            user.firstVisit = false;
            await user.save();
            res.json({message: `Welcome, ${user.username}. You are visiting for the first time.`});
        } else {
            res.json({message: `Welcome back, ${user.username}.`});
        }
    } catch (error) {
        res.status(500).json({error: 'Error accessing home page', details: error.message});
    }
};
