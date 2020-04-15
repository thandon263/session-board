exports.up = knex =>
    knex.schema.createTable("profiles", table => {
        table.increments("id")
        table
            .integer("user_id")
            .unsigned()
            .notNullable()
        table.string("job_title").notNullable()
        table.string("bio").notNullable()
        table.string("image_url").notNullable()
        table.integer("people_managed").notNullable()

        table.unique("user_id")

        table
            .foreign("user_id")
            .references("users.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table.dateTime("created_at").notNullable()
        table.dateTime("updated_at").notNullable()
    })

exports.down = knex => {
    knex.table("profiles", table => {
        table.dropForeign("user_id")
    })
    return knex.schema.dropTable("reset_password")
}
