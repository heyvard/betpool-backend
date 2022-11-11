'use strict'

exports.up = async (knex) => {
    await knex.schema.createTable('users', (t) => {
        t.uuid('id').default(knex.raw('uuid_generate_v4()')).primary()
        t.string('firebase_user_id').unique().notNullable()
        t.string('picture').nullable()
        t.boolean('active').notNullable()
        t.string('email').unique().notNullable()
        t.string('name').notNullable()
        t.boolean('admin').notNullable()
        t.boolean('paid').notNullable()
        t.smallint('charity').notNullable()
        t.string('winner').notNullable()
        t.string('topscorer').nullable()
        t.timestamps(false, true)
    })
}

exports.down = async function down(knex) {
    await knex.schema.dropTable('users')
}
