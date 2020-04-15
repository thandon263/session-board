exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex("users")
        .del()
        .then(function() {
            // Inserts seed entries
            return knex("users").insert([
                {
                    id: 1,
                    first_name: "John",
                    last_name: "Doe",
                    email: "john@doe.com",
                    password: "",
                    mentor: true,
                    mentee: false,
                },
                {
                    id: 2,
                    first_name: "Jane",
                    last_name: "Doe",
                    email: "jane@doe.com",
                    password: "",
                    mentor: false,
                    mentee: true,
                },
            ])
        })
}
