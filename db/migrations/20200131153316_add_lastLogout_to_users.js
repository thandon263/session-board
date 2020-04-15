exports.up = function(knex) {
    let createQuery = `
        ALTER TABLE users
        ADD last_logout TIMESTAMP
    `
    return knex.raw(createQuery)
}

exports.down = function(knex) {
    let dropQuery = `
        ALTER TABLE users
        DROP COLUMN last_logout 
    `
    return knex.raw(dropQuery)
}
