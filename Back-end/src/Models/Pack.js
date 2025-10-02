import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { dateValidator, checkEndDate } from "../Validations/packValidator";

const packSchema = mongoose.Schema({
    guideId: {
        type: Number,
        required: true
    },
    guidesPlacesId: {
        type: [Number],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: dateValidator,
            message: props => `${props.value} must be at least 15 days in the future.`
        }
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: checkEndDate,
            message: `End date ({VALUE}) must be after the start date.`
        }
    },
    availability: {
        type: Boolean,
        required: true
    },
    startLocation: {
        type: String,
        required: true
    },
    endLocation: {
        type: String,
        required: true,
        default: startLocation
    },
    avgRating: {
        type: Number,
        default: 0
    },
    maxClients: {
        type: Number,
        default: 0
    }
});

packSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Pack', packSchema);
