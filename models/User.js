var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')
var mongooseLogs = require('mongoose-activitylogs')

var UserSchema = new Schema({
        fullname: String,
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        userProfile:  { type: Schema.Types.String, ref: 'u1_usr_m01' },  
        authority:  { type: Schema.Types.ObjectId, ref: 'u1_usr_m02' },
        customer : { type: Schema.Types.ObjectId, ref: 'u1_cus_m00' },
        gender: String,
        active: Boolean,
        // avatar: { data: Buffer, contentType: String },
        timezone: String,
        attempts: Number,
        lastloginAt: [{ type: Schema.Types.Date }],
        createdBy: {
            type: String
        },
        modifiedBy: {
            type: String
        }
    },
    {
        timestamps:true
    }
)

UserSchema.plugin(passportLocalMongoose,{
    usernameField: 'email',
    hashField:'password',
    attemptsField: 'attempts',
    lastLoginField: 'lastloginAt',
    MissingPasswordError: 'Favor, informar uma senha!',
    AttemptTooSoonError: 'Acesso do usuário bloqueado.Tente novamente mais tarde.',
    TooManyAttemptsError: 'Conta bloqueada devido ao excesso de tentativas de login.',
    IncorrectPasswordError: 'Senha incorreta!',
    IncorrectUsernameError: 'Email incorreto!',
    MissingUsernameError: 'Favor informar um email para login!',
    UserExistsError:'Estes dados já existem no registro de usuários.'  
})

UserSchema.plugin(mongooseLogs, {
    schemaName: "user",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
 });

 

 
var user = mongoose.model('u1_usr_m00', UserSchema)

module.exports = user