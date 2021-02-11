const routes = async (fastify, options) => {
    fastify.get('/', async (req, reply) => {
        return { hello: 'test' }
    })
}

module.exports = routes