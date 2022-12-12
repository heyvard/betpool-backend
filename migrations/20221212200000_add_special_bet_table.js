'use strict'

exports.up = async (knex) => {
    await knex.schema.createTable('special_bet', (t) => {
        t.uuid('id').default(knex.raw('uuid_generate_v4()')).primary()
        t.text('bet').notNullable()
        t.text('result').notNullable()
        t.boolean('done').notNullable()
        t.timestamps(false, true)
    })
    await knex('special_bet').insert([
        {
            bet: 'winner',
            result: 'tbd',
            done: false,
        },
        {
            bet: 'topscorer',
            result: 'tbd',
            done: false,
        },
    ])
}

exports.down = async function down(knex) {
    await knex.schema.dropTable('special_bet')
}
