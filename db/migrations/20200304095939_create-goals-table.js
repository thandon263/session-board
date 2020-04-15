exports.up = knex => {
    return knex.schema.createTable("goals", table => {
        table.increments("id")
        table
            .integer("owner_id")
            .unsigned()
            .notNullable()
        table.string("title").notNullable()
        table.integer("goal_type").notNullable()
        table.specificType("mentorship_preferences", "INT[3]").notNullable()
        table.specificType("skill_preferences", "INT[3]").notNullable()
        table.boolean("status").notNullable()
        table.dateTime("deadline").notNullable()

        table.unique("owner_id")
        table.unique("title")
        table.unique("goal_type")
        table.unique("mentorship_preferences")
        table.unique("skill_preferences")
        table.unique("status")
        table.unique("deadline")

        table
            .foreign("owner_id")
            .references("users.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE")
        table.dateTime("first_created").notNullable()
        table.dateTime("last_modified").notNullable()
        table.dateTime("date_achieved").notNullable()
    })
}

exports.down = knex => {
    knex.table("goals", table => {
        table.dropForeign("user_id")
    })
    return knex.schema.dropTable("goals")
}
