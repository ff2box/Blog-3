const accountAction = require('../model_rest/accountAction');

let loginIn = async (ctx, next) => {
    try {
        let user = await accountAction.getPassWord(ctx.request.body.userName);
        if (user[0].passWord === ctx.request.body.passWord) {
            ctx.cookies.set(
                'userName',
                ctx.request.body.userName,
                {
                    maxAge: 10 * 60 * 1000,
                    httpOnly: false,
                    overwrite: true
                }
            );
            ctx.body = { login: true };
        }
        else {
            ctx.body = { login: false };
        }
    }
    catch (err) {
        console.log(err);
        ctx.body = { login: false };
    }
    next();
}

let changePassWord = async (ctx, next) => {
    try {
        await accountAction.changePassWord(ctx.request.body);
        ctx.body = { httpresult: 200 };
    }
    catch (err) {
        ctx.body = { httpresult: 400 };
    }
    next();
}

let unlogin = async (ctx, next) => {
    // ctx.response.set('Access-Control-Allow-Origin', 'http://localhost:8080');
    // ctx.response.set('Access-Control-Allow-Credentials', true);
    ctx.cookies.set(
        'userName',
        '',
        {
            maxAge: 10 * 60 * 1000,
            httpOnly: false,
            overwrite: true
        }
    ); 
    ctx.status = 200;   
    next();
}

module.exports = {
    'POST /loginIn': loginIn,
    'POST /changePassWord': changePassWord,
    'GET /unlogin': unlogin
}