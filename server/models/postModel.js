const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    title: { type: String, required: [true, 'Title is required.'] },
    category: { 
        type: String, 
        enum: {
            values: ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment", "Uncategorized", "Weather", "Feeling"],
            message: '{VALUE} is not supported.'
        } 
    },
    description: { type: String, required: [true, 'Description is required.'] },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Creator is required.'] },
    thumbnail: { type: String, required: [true, 'Thumbnail is required.'] },
}, { timestamps: true });

module.exports = model("Post", postSchema);
