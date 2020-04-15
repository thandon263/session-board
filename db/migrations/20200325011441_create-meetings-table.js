exports.up = knex =>
    knex.schema.createTable("meetings", table => {
        table.increments("id")
        table
            .integer("user_id")
            .unsigned()
            .notNullable()
        table
            .integer("location_id")
            .unsigned()
            .notNullable()
        table
            .integer("availability_id")
            .unsigned()
            .notNullable()
        table
            .integer("goal_id")
            .unsigned()
            .notNullable()

        table
            .foreign("user_id")
            .references("users.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table
            .foreign("location_id")
            .references("location.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table
            .foreign("availability_id")
            .references("availability.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table
            .foreign("goal_id")
            .references("goals.owner_id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table.dateTime("created_at").notNullable()
        table.dateTime("updated_at").notNullable()
    })

exports.down = knex => {
    knex.table("meetings", table => {
        table.dropForeign("user_id")
        table.dropForeign("location_id")
        table.dropForeign("availability_id")
        table.dropForeign("goal_id")
    })
    return knex.schema.dropTable("meetings")
}
