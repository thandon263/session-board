exports.up = knex =>
    knex.schema.createTable("milestones", table => {
        table.increments("id")
        table
            .integer("user_id")
            .unsigned()
            .notNullable()
        table.integer("goal_id").notNullable()
        table.string("milestones", "string[3]").notNullable()
        table.boolean("status").notNullable()
        table.dateTime("deadline").notNullable()

        table
            .foreign("user_id")
            .references("users.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table
            .foreign("goal_id")
            .references("goals.owner_id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table.dateTime("created_at").notNullable()
        table.dateTime("updated_at").notNullable()
        table.dateTime("date_achieved")
    })

exports.down = knex => {
    knex.table("milestones", table => {
        table.dropForeign("user_id")
        table.dropForeign("goal_id")
    })
    return knex.schema.dropTable("milestones")
}
