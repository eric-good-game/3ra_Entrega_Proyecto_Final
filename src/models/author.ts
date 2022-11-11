import {model, Schema} from "mongoose";

interface Author {
    value: string;
}

const authorSchema = new Schema<Author>({
    value: {type: String, required: true},
});

const Author = model<Author>("Author", authorSchema);

export default Author;