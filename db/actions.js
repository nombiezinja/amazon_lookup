module.exports = (knex) => {
  return {
    create: (asin, category, dimensions, rank) => {
      return knex.table('products').insert({
        asin: asin,
        category: category,
        dimensions: dimensions,
        rank: rank
      });
    },
    read: (asin) => {
      return knex.select()
        .from('products')
        .where({
          asin: asin
        });
    }, 
    delete: (asin) => {
      return knex('products')
      .where({
        asin: asin
      })
      .del();
    }
  };
};