const {buildSchema} = require('graphql');

module.exports = buildSchema(`
        type MyData {
            text: String!
            views: Int!
            name: String!
        }
        type AuthData {
            token:String!
            userId:String!
        }

        type Post {
            _id: ID!
            title: String!
            content: String!
            imageUrl: String!
            creator: User!
            createdAt: String!
            updatedAt: String!
        }

        type User {
            _id: ID!
            name: String!
            email:String!
            password: String
            status: String!
            posts : [Post]
        }

        input userInputData {
            email: String!
            name: String!
            password: String!
        }

        input postInputData{
            title: String!
            content: String!
            imageUrl: String
        }

        type postData {
            posts: [Post!]
            totalPosts:Int!
        }

        type RootQuery {
            login(email:String!, password: String!): AuthData!
            posts(page:Int!): postData!
       }

        type rootMutation {
            createUser(userInput: userInputData) : User!
            createPost(postInput :postInputData ) : Post!
        }
        schema {
            query: RootQuery
            mutation: rootMutation
        }
`);
