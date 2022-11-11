import {model, Schema} from "mongoose";

interface Product {
    name: string;
    price: number;
    genres_id: string[];
    author_id: string;
    year: number;
    type: 'manga' | 'manhwa';
    imgExt:string
}

const productSchema = new Schema<Product>({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    genres_id: {type: [String], required: true},
    author_id: {type: String, required: true},
    year: {type: Number, required: true},
    type: {type: String, required: true},
    imgExt: {type: String, required: true}
});

const Product = model<Product>("Product", productSchema);

export default Product;