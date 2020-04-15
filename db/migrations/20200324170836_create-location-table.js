exports.up = knex =>
    knex.schema.createTable("location", table => {
        table.increments("id")
        table
            .integer("user_id")
            .unsigned()
            .notNullable()
        table.string("name").notNullable()
        table.jsonb("location").notNullable()

        table
            .foreign("user_id")
            .references("users.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table.dateTime("created_at").notNullable()
        table.dateTime("updated_at").notNullable()
    })

exports.down = knex => {
    knex.table("location", table => {
        table.dropForeign("user_id")
    })
    return knex.schema.dropTable("location")
}
