exports.up = function(knex) {
    let createQuery = `CREATE TABLE users(
        id SERIAL PRIMARY KEY NOT NULL,
        first_name TEXT,
        last_name TEXT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(1024) NOT NULL,
        mentor BOOLEAN NOT NULL,
        mentee BOOLEAN NOT NULL,
        first_created TIMESTAMP,
        last_login TIMESTAMP,
        last_modified TIMESTAMP
      )`
    return knex.raw(createQuery)
}

exports.down = function(knex) {
    let dropQuery = `DROP TABLE users`
    return knex.raw(dropQuery)
}
