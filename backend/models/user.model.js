const bcrypt = require('bcrypt');
const {Schema,model} = require('mongoose');

const userSchema = new Schema({ 
    photoUrl: {
        type: Schema.Types.String,
        default: "",
      },
    name:{
        type:Schema.Types.String,
        required:true,
        trim:true
    },
    username:{
        type:Schema.Types.String,
        required:true,
        trim:true,
        unique:true
    },
    email:{
        type:Schema.Types.String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:Schema.Types.String,
        required:true,
        select:false,
    },
    verified: {
        type: Schema.Types.Boolean,
        default: false,
      },
    role:{
        type:Schema.Types.String,
        enum:['mentor','student'],
        default:null
    },
    profile: {
        tags: {
          type: [Schema.Types.String],
          default: [],
        },
        title: {
          type: Schema.Types.String,
          default: "",
        },
        bio: {
          type: Schema.Types.String,
          default: "",
        },
        college: {
          type: Schema.Types.String,
          default: "",
        },
        social: {
          linkedin: {
            type: Schema.Types.String,
            default: "",
          },
          github: {
            type: Schema.Types.String,
            default: "",
          },
          twitter: {
            type: Schema.Types.String,
            default: "",
          },
          facebook: {
            type: Schema.Types.String,
            default: "",
          },
          instagram: {
            type: Schema.Types.String,
            default: "",
          },
        },
      },
})

userSchema.methods.isPasswordMatch = async function(password){
  console.log("password: ", password);
  console.log(this.password);
  
  
    return bcrypt.compare(password,this.password);
};

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8);
    }
    next();
});

const UserModel = model('User',userSchema);

module.exports = UserModel;