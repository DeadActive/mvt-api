const plugin = require('fastify-plugin')

const connector = async (fastify, options) => {
    fastify.register(require('fastify-postgres'), {
        connectionString: process.env.SQL_CONNECTION_STRING || 'postgres://iboss:iboss@10.1.44.4/edu_gis_db'
    })
}

module.exports = plugin(connector)