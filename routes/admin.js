var express = require('express')
var users = require('./../inc/users')
var admin = require('./../inc/admin')
var menus = require('./../inc/servicos')
var caixas = require('./../inc/caixas')
var moment = require('moment')
var router = express.Router()

moment.locale('pt-BR')

router.use(function(req, res, next){

    if(['/login'].indexOf(req.url) == -1 && !req.session.user){
        res.redirect('/admin/login')
    }else{
        next()
    }

})

router.use(function(req, res, next){

    req.menus = admin.getMenus(req)

    next()

})

// Route GET logout

router.get('/logout', function(req, res, next){

        delete req.session.user

        res.redirect('/admin/login')

})

// Route GET Home admin
router.get('/', function(req, res, next){

    admin.dashboard().then(data => {
        res.render('admin/index', admin.getParams(req, {
            data
        }))  
    }).catch(err => {
        console.error(err)
    })
    
})

// Route POST login
router.post('/login', function(req, res, next){

    if(!req.body.email) {
        users.render(req, res, 'Preencha o campo email')

    }else if(!req.body.password) {
        users.render(req, res, 'Preencha o campo Senha')

    }else {

        users.login(req.body.email, req.body.password).then(user =>{

            req.session.user = user

            res.redirect('/admin')

        }).catch(err => {
            users.render(req, res, err.message || err)
        })

    }

})

// Route GET login
router.get('/login', function(req, res, next){

   
    users.render(req, res, null)

})

// Route GET contacts
router.get('/contacts', function(req, res, next){

    res.render('admin/contacts', admin.getParams(req))

})

// Route GET emails
router.get('/emails', function(req, res, next){

    res.render('admin/emails', admin.getParams(req))

})
// Route GET Menus
router.get('/menus', function(req, res, next){

    menus.getMenus().then(data =>{

        res.render('admin/menus', admin.getParams(req, {
            data
        }))
    })

})

// Route POST Menus
router.post('/menus', function(req, res, next){

    menus.save(req.fields, req.files).then(results =>{

        res.send(results)

    }).catch(err =>{

            res.send(err)

    })

})

// Router DELETE Menus 

    router.delete('/menus/:id', function(req, res, next){

        menus.delete(req.params.id).then(results => {

            res.send(results)

        }).catch(err => {

            res.send(err)
        })

    })


// Route GET caixas

router.get('/caixas', function(req, res, next){

    let start = (req.query.start) ? req.query.start : moment().subtract(1, 'month').format('YYYY-MM-DD')
    let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD')

    caixas.getReservations(

        req

    ).then(pag => {

       res.render('admin/caixas',  admin.getParams(req, {
        date: {
            start,
            end
        },
        data: pag.data,
        moment,
        links: pag.links
    }))  

    })

})

//Route Chart Caixas

router.get('/caixas/chart', function(req, res, next){

    req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD')
    req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD')

    caixas.chart(req).then(chartData => {

        res.send(chartData)

    })
})

// Route POST reservations

router.post('/caixas', function(req, res, next){

    caixas.save(req.fields, req.files).then(results =>{

        res.send(results)

    }).catch(err =>{

            res.send(err)

    })

})

// Router DELETE reservations

    router.delete('/caixas/:id', function(req, res, next){

        caixas.delete(req.params.id).then(results => {

            res.send(results)

        }).catch(err => {

            res.send(err)
        })

    })

// Route GET users

router.get('/users', function(req, res, next){

    res.render('admin/users',  admin.getParams(req))

})

module.exports = router