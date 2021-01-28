const { ApolloServer, gql } = require("apollo-server-lambda");
// Importing Fauna DB
const faunadb = require("faunadb"),
  q = faunadb.query;

// ENV Config
const dotenv = require("dotenv");
dotenv.config();

// Global Client For All Mutation
const client = new faunadb.Client({
  secret: "fnAEAodTAbACDRgZo5150tk59tOlfJDh8rMytjYz",
});

// Defining Types
const typeDefs = gql`
  type Query {
    bookmarks: [bookmarkLink]
  }

  type Mutation {
    addBookmark(
      Name: String
      URL: String
      Description: String
      DateCreated: String
      Id: String
    ): bookmarkLink

    deleteBookmark(Id: String): bookmarkLink
  }

  type bookmarkLink {
    Name: String!
    URL: String
    DateCreated: String
    Description: String
    Id: String
  }
`;

const resolvers = {
  Query: {
    bookmarks: async (parent, args, context) => {
      try {
        let result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("Bookmarks"))),
            q.Lambda((x) => q.Get(x))
          )
        );
        console.log("result====>", result.data);
        return result.data.map((x) => {
          return {
            Name: x.data.Name,
            URL: x.data.URL,
            Description: x.data.Description,
            Date: x.data.Date,
            Id: x.ref.id,
          };
        });
      } catch (error) {}
    },
  },
  Mutation: {
    addBookmark: async (_, { URL, Description, DateCreated, Name }) => {
      try {
        const result = await client.query(
          q.Create(q.Collection("Bookmarks"), {
            data: {
              URL: URL,
              DateCreated: DateCreated,
              Description: Description,
              Name: Name,
            },
          })
        );
        return result.data;
      } catch (eroor) {}
    },
    deleteBookmark: async (_, { Id }) => {
      try {
        const result = await client.query(
          q.Delete(q.Ref(q.Collection("Bookmarks"), Id))
        );
        return result.data;
      } catch (error) {
        console.log("Delete BookMark Error===>", error);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler();
