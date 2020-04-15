exports.up = function(knex) {
    let createQuery = `
        ALTER TABLE goals
        ADD goal_expertise INTEGER 
    `
    return knex.raw(createQuery)
}

exports.down = function(knex) {
    let dropQuery = `
        ALTER TABLE goals
        DROP COLUMN goal_expertise
    `
    return knex.raw(dropQuery)
}
