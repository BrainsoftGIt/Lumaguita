"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
import nodemailer from "nodemailer";
import {K} from "./K";

export let mailSender = nodemailer.createTransport({
    host: K.MAIL.host,
    port: K.MAIL.port,
    secure: K.MAIL.secure, // true for 465, false for other ports
    auth: {
        user: K.MAIL.email, // generated ethereal user
        pass: K.MAIL.pwd, // generated ethereal password
    },
});
