import mongoose, { Schema } from "mongoose";

// Define the user schema
// interface LocaleSchema extends Document {
//   name: string;
//   email: string;
//   password: string;
//   apiKey: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

const localeSchema = new Schema(
	{
		state: {
			type: String,
			trim: true,
		},
		region: {
			type: String,
      required: true,
			trim: true,
		},
		capital: {
			type: String,
			trim: true,
		},
		slogan: {
			type: String,
			trim: true,
		},
		landmass: {
			type: String,
			trim: true,
		},
		population: {
			type: Number,
			trim: true,
		},
		dialect: {
			type: String,
			trim: true,
		},
		map: {
			type: String,
			trim: true,
		},
		latitude: {
			type: Number,
			trim: true,
		},
		longitude: {
			type: Number,
			trim: true,
		},
		website: {
			type: String,
			trim: true,
		},
		created_date: {
			type: String,
			trim: true,
		},
		created_by: {
			type: String,
			trim: true,
		},
		senatorial_districts: {
			type: Array,
			trim: true,
      select: false
		},
		lgas: {
			type: Array,
			trim: true,
      select: false
		},
		past_governors: {
			type: Array,
			trim: true,
      select: false
		},
		borders: {
			type: Array,
			trim: true,
      select: false
		},
		known_for: {
			type: Array,
			trim: true,
      select: false
		},
	},
	{ timestamps: true }
);

// Create the User model
const Locale = mongoose.model("Locale", localeSchema);

export default Locale;
