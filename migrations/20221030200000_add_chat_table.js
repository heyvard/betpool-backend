'use strict'

exports.up = async (knex) => {
    await knex.schema.createTable('chat', (t) => {
        t.uuid('id').default(knex.raw('uuid_generate_v4()')).primary()
        t.uuid('user_id').notNullable().references('users.id')
        t.text('message')
        t.timestamps(false, true)
    })
}

exports.down = async function down(knex) {
    await knex.schema.dropTable('chat')
}
