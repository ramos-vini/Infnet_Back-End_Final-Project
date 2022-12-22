import express from 'express';
import UserController from '../controllers/UserController';

const auth = express.Router();

const userCtrl = new UserController();

auth.post('/login', async (req, res) => {
    const user = await userCtrl.login(req.body.userEmail, req.body.password);
    if(user){
        console.log(user)
        if(user.active){
            res.statusCode = 200;
            res.json(user);
        }else{
            res.statusCode = 404;
            res.json({msg: 'Usuário inativo.'});
        }
        return;
    }
    res.statusCode = 404;
    res.json({'msg': 'Dados de usuário inválidos'})
})

auth.post('/register', async (req, res) => {
    const result = await userCtrl.register(req.body.username, req.body.name, req.body.email, req.body.password);
    if(result){
        res.json({'msg': 'Usuário criado com sucesso'});
        return;
    }

    res.statusCode = 400;
    res.json({'msg': 'Erro ao criar usuário'});
    return;
})

auth.get('/confirm-email', async (req, res) => {
    const result = await userCtrl.confirmEmail(req.query.token);
    if(result){
        res.render('confirm-email', {
            status: 1,
            msg: 'E-mail confirmado com sucesso!',
            url_front: 'http://localhost:3000/login'
        })
        return;
    }
    res.render('confirm-email', {
        status: 0,
        msg: 'Erro ao confirmar e-mail',
        url_front: ''
    })
})

export default auth;