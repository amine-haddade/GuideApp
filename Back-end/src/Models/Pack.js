import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { dateValidator, checkEndDate } from "../Validations/packValidator.js";

const packSchema = mongoose.Schema({
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    guidesPlacesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide',
        required: true
    }],
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
        default: function() { return this.startLocation; }
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
export default mongoose.model('Pack', packSchema);
