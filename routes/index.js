var conn = require('./../inc/db')
var express = require('express');
var caixas = require('./../inc/caixas')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  conn.query(`
    SELECT * FROM tb_menus ORDER BY title
  `, (err, results) =>{
    if(err) {
      console.log(err)
    }

    res.render('index', { 
      title: 'Rede Net Link',
      menus: results
    })
  
  })

})

// Route Contacts
router.get('/contacts', function(req, res, next){
  
  res.render('contacts', {
    title: 'Contato - Fale Conosco'
  })

})

// Route Menus
router.get('/menus', function(req, res, next){
  
  res.render('menus', 
  {
    title: 'Menus '
  })

})

// Route GET Emails
router.get('/emails', function(req, res, next){
  
  emails.render(req, res)

})

// Route GET Caixas
router.get('/caixas', function(req, res, next){
  
  caixas.render(req, res)

})

// Route POST caixas
router.post('/caixas', function(req, res, next){
   
  if(!req.body.copyPro){
    caixas.render(req, res, "Digite o valor total de cópias de máquinas próprias")
  } else if(!req.body.copyLoc){
    caixas.render(req, res, "Digite o valor total de cópias de máquinas locadas")
  }
  else if(!req.body.impPro){
    caixas.render(req, res, "Digite o valor total de impressões de máquinas próprias")
  }else if(!req.body.impLoc){
    caixas.render(req, res, "Digite o valor total de impressões de máquinas locadas") 
  //}else if(!req.body.plot){
    //caixas.render(req, res, "Digite o valor total de cópias feitas na Plotter")
  }else if(!req.body.inputColorJato){
    caixas.render(req, res, "Digite o valor total das impressões coloridas na jato")
  }else if(!req.body.inputColorLaser){
    caixas.render(req, res, "Digite o valor total das impressões coloridas na laser")
  }else if(!req.body.prod){
    caixas.render(req, res, "Digite o valor total da venda de Produtos")
  }else if(!req.body.serv){
    caixas.render(req, res, "Digite o valor total da venda de Serviços")
  }else if(!req.body.net){
    caixas.render(req, res, "Digite o valor total dos acessos à Internet")
  }else if(!req.body.saida){
    caixas.render(req, res, "Digite o valor total de saídas de caixa")
  }else if(!req.body.lojas){
    caixas.render(req, res, "Selecione sua loja")
  }else if(!req.body.date){
    caixas.render(req, res, "Preencha a data")
  }else if(!req.body.time){
    caixas.render(req, res, "Preencha a hora atual")
  }else {
    
    caixas.save(req.body).then(results => {
      caixas.render(req, res, null, 'Caixa fechado com sucesso')
    }).catch(err =>{
      caixas.render(req, res, err.message)
    })
  
  }
 
})

// Route Services
router.get('/services', function(req, res, next){
  
  res.render('services', {
    title: 'Serviços'
  })

})

module.exports = router
