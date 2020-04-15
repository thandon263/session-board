// Update with your config settings.

module.exports = {
    development: {
        client: "pg",
        connection: "postgres://localhost/movethedial",
        migrations: {
            directory: "./db/migrations",
        },
        seeds: {
            directory: "./db/seeds/dev",
        },
        useNullAsDefault: true,
    },

    test: {
        client: "postgresql",
        connection: "postgres://localhost/movethedial_test",
        migrations: {
            directory: "./db/migrations",
        },
        seeds: {
            directory: "./db/seeds/dev",
        },
        useNullAsDefault: true,
        pool: {
            min: 2,
            max: 10,
        },
    },

    production: {
        client: "postgresql",
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            charset: "utf8",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: "./db/migrations",
        },
    },
}
