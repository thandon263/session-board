exports.up = function(knex) {
    let createQuery = `
        ALTER TABLE times
        ADD isBooked BOOLEAN DEFAULT false
    `
    return knex.raw(createQuery)
}

exports.down = function(knex) {
    let dropQuery = `
        ALTER TABLE times
        DROP COLUMN isBooked 
    `
    return knex.raw(dropQuery)
}
