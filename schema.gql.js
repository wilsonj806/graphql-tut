// Import GraphQL modules
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

const axios = require('axios');
const customersJsonEnd = 'http://localhost:3000/customers/'

// ----- NOTE Hardcoded customers
// const customers = [
//   { id: '1', name: 'John Doe', email: 'jdoe123@gmail.com', age: 34 },
//   { id: '2', name: 'Steven Smith', email: 'ssmith123@gmail.com', age: 23 },
//   { id: '3', name: 'Sarah Williams', email: 'swilliams123@gmail.com', age: 27 },
// ]

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

// const tempSearch = (arrToQuery, args) => {
//   for (let i = 0; i < arrToQuery.length; i++) {
//     if (arrToQuery[i].id === args.id) return arrToQuery[i]
//   }
// }
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
        return axios.get(customersJsonEnd + args.id)
          .then(res => res.data);
      },
    },
    // QUERY query for all customers
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        // return HARD CODED customers
        return axios.get(customersJsonEnd)
        .then(res => res.data);
      }
    }
  }),
});

// ----- NOTE GraphQL Mutation
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        // GraphQLNonNull is for required types
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios.post(customersJsonEnd, args)
          .then(res => res.data);
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios.delete(customersJsonEnd + args.id)
      }
    },
    updateCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        // pass entire args param since it's an object
        return axios.patch(customersJsonEnd + args.id, args).then(res => res.data);
      }
    }
  }
})

// Will need a root query/ baseline query that every other query depends on.
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})