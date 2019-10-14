
var jwt     = require('jwt-simple')
var config  = require('./config')

module.exports = function(User, req, res, next) {
    
    var token = (req.body && req.body.access_token) || 
        (req.query && req.query.access_token) || 
        req.headers['x-access-token']

    //1
    if (token) {
        try {
            var decoded = jwt.decode(token, config.jwtSecret)
            console.log('decodando ' + decoded.email)
            //2
            if (decoded.exp <= Date.now()) {
                res.render('login', { title: 'Un1ty', message: req.flash('ExpireMessage')})                
            }
            // 3
            User.findOne({ _id: decoded.iss }, function(err, user) {
                if(err)
                    res.status(500).json({message: "erro ao procurar usuario do token."})
                
                req.user = user;
                
                console.log('achei usuario ' + req.user)
                return next();
            })
            //4
        } catch (err) {
            console.log(err)
            return res.status(401).json({message: 'Erro: Seu token é inválido'});
        }
    } else {
        res.json(401, {message: 'Token não encontrado ou informado'})
    }
}