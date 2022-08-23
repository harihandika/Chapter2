const {Pool} = require('pg')

const dbPool = new Pool({
    database: 'personal_web',
    port:5432,
    user: 'postgres',
    password: '456456456'
})

module.exports = dbPool