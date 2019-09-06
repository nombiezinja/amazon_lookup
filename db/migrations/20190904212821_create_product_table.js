
exports.up = function(knex) {
  return Promise.all([knex.schema.createTable('products', function(table){
    table.increments('id').primary;
    table.string('asin');
    table.string('category');
    table.string('rank');
    table.string('dimensions');
  })
  ]);
};
  
exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('products')
  ]);
};
  