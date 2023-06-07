import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt'

// Define the user schema
interface UserSchema extends Document {
  name: string;
  email: string;
  password: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserSchema>({
  name: {
    type: String,
    required: [true, 'Enter your name'],
    trim:true
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Enter an email'],
    trim:true
  },
  password: {
    type: String,
    required: [true, "incorrect password"],
    select: false
  },
  apiKey: {
    type: String,
    required: true,
  }
}, {timestamps: true});


//UserSchema Methods
userSchema.pre<UserSchema>(
  'save',
  async function (next) {
      const user = this
      // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
          const  salt = await bcrypt.genSalt(),
            hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
  }
);

userSchema.methods.isValidPassword = async function(password:string) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
}

// Create the User model
const User = mongoose.model<UserSchema>('User', userSchema);

export default User;
