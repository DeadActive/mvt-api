const fastify = require('fastify')({ logger: true })

fastify.register(require('fastify-cors'), {
    origin: (origin, cb) => {
        cb(null, true)
    }
})

fastify.register(require('./connections/postgis'))

fastify.register(require('./routes/index'))
fastify.register(require('./routes/tiles'))

const start = async () => {
    try {
        await fastify.listen(process.env.PORT || 5555)
    } catch (err) {
        fastify.log.error(err)
        process.exit()
    }
}

start()