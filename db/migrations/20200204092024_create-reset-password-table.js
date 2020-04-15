exports.up = knex =>
    knex.schema.createTable("reset_password", table => {
        table.increments("id")
        table
            .integer("user_id")
            .unsigned()
            .notNullable()
        table.string("reset_code").notNullable()

        table.unique("user_id")
        table.unique("reset_code")

        table
            .foreign("user_id")
            .references("users.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table.dateTime("created_at").notNullable()
        table.dateTime("updated_at").notNullable()
    })

exports.down = knex => {
    knex.table("reset_password", table => {
        table.dropForeign("user_id")
    })
    return knex.schema.dropTable("reset_password")
}
