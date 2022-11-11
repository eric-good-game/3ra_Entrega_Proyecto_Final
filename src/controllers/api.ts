import { Request, Response } from "express";
import logger from "../config/logger";
import { transporter } from "../config/nodemailer";
import client from "../config/twilio";
import Author from "../models/author";
import Genres from "../models/author copy";
import Product from "../models/product";
import User from "../models/user";

class ApiController {
    static async getAllGenres(req:Request, res: Response){
        try {
            const genres = await Genres.find();
            res.status(200).json({genres});
        } catch (err) {
            logger.error(JSON.stringify(err));
        }
    }
    static async getAllAuthors(req:Request, res: Response){
        try {
            const authors = await Author.find();
            res.status(200).json({authors});
        } catch (err) {
            logger.error(JSON.stringify(err));
        }
    }
    static async getAllProducts(req:Request, res: Response){
        try {
            const query:any={};
            if(Object.keys(req.query).length){
                Object.keys(req.query).forEach((key) => {
                    if(req.query[key] === ''){
                        return
                    }
                    if(key === 'genre'){
                        query['genres_id'] = req.query[key];
                    }
                    if(key === 'author'){
                        query['author_id'] = req.query[key];
                    }
                    if(key === 'year'){
                        query['year'] = parseInt(req.query[key] as string);
                    }
                    if(key === 'searchKey'){
                        query['name'] = new RegExp(req.query[key] as string, 'i')
                    }
                })
            }
            const products = await Product.find(query).select('-__v');
            res.status(200).json({products});
        } catch (err) {
            logger.error(JSON.stringify(err));
        }
    }
    static async create(req:Request, res: Response){
        try {
            const product = await Product.create(req.body);
            res.status(200).json(product);
        } catch (err) {
            logger.error(JSON.stringify(err));
        }
    }
    static async order(req:Request, res: Response){
        try {
            const user = await User.findById(req.body.user_id);
            if(!user){
                return res.status(404).json({message:'User not found'});
            }
            const mailOptions = {
                from:'',
                to: user.email,
                subject: `New order by ${user.full_name} <${user.email}>`,
                html: '',
            }
            mailOptions.html += `<p style="margin-bottom:.7rem">Items</p>`

            req.body.items.forEach((item:any) => {
                mailOptions.html += `<div style="margin-bottom:.5rem">`
                mailOptions.html += `<p>${item.type}</p>`
                mailOptions.html += `<p>name: ${item.name}</p>`
                mailOptions.html += `<p>Quantity: ${item.quantity}</p>`
                mailOptions.html += `<p>Price: $${item.price.toFixed(2)}</p>`
                mailOptions.html += `</div>`
            })
            
            const info = await transporter.sendMail(mailOptions);
            const message = await client.messages.create({
                body: `Pedido recibido y en proceso.`,
                from: '+14793913342',
                to: user.phone_number
            })
            logger.info('Message sent: ' + message.sid);
            logger.info(JSON.stringify(info));
            
            return res.status(200).json({message: 'ok'});
            
        } catch (err) {
            logger.error(JSON.stringify(err));
            res.status(500).json({message: 'Error'});
        }
    }
}

export default ApiController;