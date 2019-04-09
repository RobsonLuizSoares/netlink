let conn = require('./db')

module.exports = {
    getContacts(){
        return new Promise((resolve, reject)=>{

            conn.query(`
            
            SELECT * FROM tb_contacts ORDER BY name
            
            `, (err, results) =>{

                if(err) {
                    reject(err)
                } 

                resolve(results)

            })

        })
    }

}