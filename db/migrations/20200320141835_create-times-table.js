exports.up = knex =>
    knex.schema.createTable("times", table => {
        table.increments("id")
        table.string("time").notNullable()
        table.dateTime("created_at").notNullable()
        table.dateTime("updated_at").notNullable()
    })

exports.down = knex => knex.schema.dropTable("times")
