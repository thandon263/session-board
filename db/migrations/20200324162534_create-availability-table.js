exports.up = knex =>
    knex.schema.createTable("availability", table => {
        table.increments("id")
        table
            .integer("user_id")
            .unsigned()
            .notNullable()
        table.string("day").notNullable()
        table.string("time").notNullable()

        table
            .foreign("user_id")
            .references("users.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table.dateTime("created_at").notNullable()
        table.dateTime("updated_at").notNullable()
    })

exports.down = knex => {
    knex.table("availability", table => {
        table.dropForeign("user_id")
    })
    return knex.schema.dropTable("availability")
}
