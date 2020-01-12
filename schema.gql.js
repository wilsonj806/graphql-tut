// Import GraphQL modules
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

// ----- NOTE Hardcoded customers
const customers = [
  { id: '1', name: 'John Doe', email: 'jdoe123@gmail.com', age: 34 },
  { id: '2', name: 'Steven Smith', email: 'ssmith123@gmail.com', age: 23 },
  { id: '3', name: 'Sarah Williams', email: 'swilliams123@gmail.com', age: 27 },
]

/**
 * All GraphQLObjectTypes need a name property
 * - the "fields" property should look similar to a Mongoose Doc model
 *
 */
// ----- NOTE Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'CustomerType',

  // Fields returns an object with your schema
  fields: () => ({
    id : { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  })
});

const tempSearch = (arrToQuery, args) => {
  for (let i = 0; i < arrToQuery.length; i++) {
    if (arrToQuery[i].id === args.id) return arrToQuery[i]
  }
}
// ----- NOTE Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',

  // Need fields here just like in the above
  fields: () => ({
    // QUERY query for one customer
    customer: {
      type: CustomerType,

      // Args is how you query the customer "DB"
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // Temporary since hardcoded
        return tempSearch(customers, args);
      },
    },
    // QUERY query for all customers
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        // return HARD CODED customers
        return customers
      }
    }
  }),

});

// Will need a root query/ baseline query that every other query depends on.
module.exports = new GraphQLSchema({
  query: RootQuery
})