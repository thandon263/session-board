exports.up = function(knex) {
    let createQuery = `
        ALTER TABLE profiles
        ADD skype_id TIMESTAMP
    `
    return knex.raw(createQuery)
}

exports.down = function(knex) {
    let dropQuery = `
        ALTER TABLE profiles
        DROP COLUMN skype_id
    `
    return knex.raw(dropQuery)
}
