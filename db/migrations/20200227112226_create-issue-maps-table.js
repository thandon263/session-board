exports.up = function(knex) {
    let createQuery = `CREATE TABLE issue_maps(
        id SERIAL PRIMARY KEY NOT NULL,
        issue_type TEXT,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )`
    return knex.raw(createQuery)
}

exports.down = function(knex) {
    let dropQuery = `DROP TABLE issue_maps`
    return knex.raw(dropQuery)
}
