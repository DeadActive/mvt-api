const routes = async (fastify, options) => {

    fastify.get('/tiles/:id/:level/:x/:y', async (req, reply) => {
        const { level, x, y, id } = req.params

        fastify.pg.connect((err, client, release) => {
            if (err) return reply.send(err)

            client.query(
                `select ST_AsMVT(q, 'default', 4096, 'geom') as data from
(
select id, name, properties, 
    ST_AsMvtGeom(
        ST_Transform(geom, 3857),               
        BBox($2, $3, $1), -- (2)
        4096,                   
        64,                    
        true) as geom
	from data
	where ST_Transform(geom, 3857) && BBox($2, $3, $1)
	and ST_Intersects(ST_Transform(geom, 3857), BBox($2, $3, $1))
	and layer_id = $4
) as q`, [level, x, y, id],
                (err, result) => {
                    release()
                    req.log.info(`Load tile x: ${x} y: ${y} z: ${level}`)
                    reply.send(err || result.rows[0])
                }
            )
        })
    })

    fastify.get('/tiles/:id/rectangle', async (req, reply) => {
        const { id } = req.params

        fastify.pg.connect((err, client, release) => {
            if (err) return reply.send(err)

            client.query(
                `with bbox as
                (
                    select ST_Expand(ST_Extent(geom), 2) as geom from data where layer_id = $1
                )

                select
                ST_XMin(geom) as x_min, ST_YMin(geom) as y_min,
                ST_XMax(geom) as x_max, ST_YMax(geom) as y_max from bbox`
                , [id], (err, result) => {
                    release()
                    reply.send(err || result.rows[0])
                }
            )
        })
    })
}

module.exports = routes