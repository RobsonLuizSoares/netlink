var conn = require('./db')
var moment = require('moment')
var Pagination = require('./../inc/Pagination')

module.exports = {

    render(req, res, error, success){
        
        res.render('caixas', {
            title: 'Fechamento de Caixa',
            body: req.body,
            error,
            success
          })
    },

  save(fields){

        return new Promise ((resolve, reject) =>{

            if(fields.date.indexOf('/') > -1 ){

                let date = fields.date.split('/')
                fields.date = `${date[2]}-${date[1]}-${date[0]}`;
            }

            let query, params= [
                fields.copyPro,
                fields.copyLoc,
                fields.obsCopy,
                fields.impPro,
                fields.impLoc,
                fields.inputColorJato,
                fields.inputColorLaser,
                fields.obsImp,
                fields.plot,
                fields.obsPlot,
                fields.prod,
                fields.obsProd,
                fields.serv,
                fields.obsServ,
                fields.net,
                fields.obsNet,
                fields.saida,
                fields.obsSaida,
                fields.lojas,
                fields.date,
                fields.time
        ]

            if (parseInt(fields.id) > 0){

                query = `
                    UPDATE tb_caixas
                    SET 
                        copyPro = ?,
                        copyLoc = ?,
                        obsCopy = ?,
                        impPro = ?,
                        impLoc = ?,
                        inputColorJato = ?,
                        inputColorLaser = ?,
                        obsImp = ?,
                        plot = ?,
                        obsPlot = ?,
                        prod = ?,
                        obsProd = ?,
                        serv = ?,
                        obsServ = ?,
                        net = ?,
                        obsNet = ?,
                        saida = ?,
                        obsSaida = ?,
                        lojas = ?,
                        date = ?,
                        time = ?
                    WHERE id = ?
                `;

                params.push(fields.id)

            }else {

                    query = `
                    INSERT INTO tb_caixas (copyPro, copyLoc, obsCopy, impPro, impLoc, inputColorJato, inputColorLaser, obsImp, 
                        plot, obsPlot, prod, obsProd, serv, obsServ, net, 
                        obsNet, saida, obsSaida, lojas, date, time)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `
            }

            conn.query(query,params, (err, results)=>{
            if(err) {
                reject(err)
            }else {
                resolve(results)
            }
        })

        })
      
    },

    getReservations(req){

            return new Promise((resolve, reject) => {

            let page = req.query.page

            let start = req.query.start

            let end = req.query.end

            
            if (!page) page = 1

            let params = []

            if(start && end) params.push(start,end)

            let pag = new Pagination(

                `
                    SELECT SQL_CALC_FOUND_ROWS * 
                    FROM tb_caixas
                    ${(start && end) ? 'WHERE date BETWEEN ? AND ?' : ''}
                    ORDER BY date LIMIT ?, ?
                
                `,
                params
            )
           

              return pag.getPage(page)
                 
                .then(data => {

                    resolve({
                        data,
                        links: pag.getNavigation(req.query)
                    })
                   
                }) 
                
                

            })
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            conn.query(`
                DELETE FROM tb_caixas WHERE id=?
            `,[
                id
            ], (err, results) => {

                if(err) {
                    reject(err)
                } else {
                    resolve(results)

                }
            })
        })
    },
    chart(req){

        return new Promise ((resolve, reject) =>{

            conn.query(`

            SELECT
                    CONCAT(YEAR(date), '/', MONTH(date), '/', DAY(date)) AS Data,
                    SUM(copyPro)  AS Cop_Propria,
                    SUM(copyLoc) AS Cop_Locada,
                    SUM(impPro) AS Imp_Propria,
                    SUM(impLoc)  AS Imp_Locada,
                    SUM(inputColorJato)  AS inputColorJato,
                    SUM(inputColorLaser)AS inputColorLaser,
                    SUM(plot) AS Plotter,
                    SUM(prod) AS Produtos,
                    SUM(serv) AS Serviços,
                    SUM(net) AS Internet,
                    SUM(saida) AS Saídas
                    
                    FROM tb_caixas
                    WHERE
                    date BETWEEN ? AND ?
                    GROUP BY YEAR(date), MONTH(date), day(date)
                    ORDER BY DAY(date) DESC, MONTH(date) DESC
                       
            `, [
                req.query.start,
                req.query.end

            ], (err, results) => {
                if(err) {
                    reject(err)
                }else {
                    let months = []
                    let values_copyP = []
                    let values_copyL = []
                    let values_impP = []
                    let values_impL = []
                    let values_inputColorJato = []
                    let values_inputColorLaser = []
                    let values_plot = []
                    let values_prod = []
                    let values_serv = []
                    let values_inter = []
                    let values_said = []
                    
                    results.forEach(row => {

                        months.push(moment(row.Data).format("DD/MM/YYYY"))
                        values_copyP.push(row.Cop_Propria)
                        values_copyL.push(row.Cop_Locada)
                        values_impP.push(row.Imp_Propria)
                        values_impL.push(row.Imp_Locada)
                        values_inputColorJato.push(row.inputColorJato)
                        values_inputColorLaser.push(row.inputColorLaser)
                        values_plot.push(row.Plotter)
                        values_prod.push(row.Produtos)
                        values_serv.push(row.Serviços)
                        values_inter.push(row.Internet)
                        values_said.push(row.Saídas)
                        
                        
                    });

                    resolve({
                        months,
                        values_copyP,
                        values_copyL,
                        values_impP,
                        values_impL,

                        values_plot,
                        values_prod,
                        values_serv,
                        values_inter,
                        values_said
                    })
                }

            })
        })

    }


}