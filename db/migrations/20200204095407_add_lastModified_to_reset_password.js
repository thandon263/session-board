exports.up = function(knex) {
    let createQuery = `
        ALTER TABLE reset_password
        ADD last_modified TIMESTAMP
    `
    return knex.raw(createQuery)
}

exports.down = function(knex) {
    let dropQuery = `
        ALTER TABLE reset_password
        DROP COLUMN last_modified 
    `
    return knex.raw(dropQuery)
}
