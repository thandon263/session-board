exports.up = knex =>
    knex.schema.createTable("date", table => {
        table.increments("id")
        table.string("day").notNullable()
        table.integer("time_id").notNullable()

        table.unique("time_id")

        table
            .foreign("time_id")
            .references("times.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table.dateTime("created_at").notNullable()
        table.dateTime("updated_at").notNullable()
    })

exports.down = knex => {
    knex.table("date", table => {
        table.dropForeign("time_id")
    })
    return knex.schema.dropTable("times")
}
