import {model, Schema} from "mongoose";

interface Genres {
    value: string;
}

const genresSchema = new Schema<Genres>({
    value: {type: String, required: true},
});

const Genres = model<Genres>("Genres", genresSchema);

export default Genres;