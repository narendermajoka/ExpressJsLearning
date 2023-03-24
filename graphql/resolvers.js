const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
    hello(){
        return {
            text: 'Hello World!',
            views: 1234,
            name : 'Narender'
        };
    },
    createUser: async function(args, req){
        const email = args.userInput.email;
        const password = args.userInput.password;
        const name = args.userInput.name;

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            const error = new Error('User already exsits');
            throw error;
        }
        console.log(password);
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            name: name,
            password: hashedPassword
        });

        const dbUser = await user.save();
        return { ...dbUser._doc, _id : dbUser._id.toString()};

    },

    login : async function({email, password},req){
       
        const user = await User.findOne({email:email});
        if(!user){
            const error = new Error('User does not exists');
            error.statusCode = 401;
            throw error;
        }
        console.log(password);
        console.log(user.password);

        const result = await bcrypt.compare(password, user.password);
        if(!result){
            const error = new Error('wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: user.email,
            userId: user._id
        }, 'somesupersecretlongsecret', { expiresIn: '1h' });

        return { token : token, userId:user.email };

    },
    createPost : async function( {postInput}, req) {
        const title = postInput.title;
        const content = postInput.content;
        const imageUrl = postInput.imageUrl;
        const post = new Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
        //    creator: req.userId
        });
        const createdPost = await post.save();
        return { ...createdPost._doc,
                _id: createdPost._id.toString(),
                createdAt: createdPost.createdAt.toISOString(),
                updatedAt: createdPost.updatedAt.toISOString()
            }
    },

    posts: async function (args,req){
       const totalPosts = await Post.find().countDocuments();
       const pageNo = args.page;
       if(!pageNo){
          pageNo = 1;
       }
       const perPage = 2;

       let posts = await Post.find()
                            .skip( (pageNo - 1) * perPage)
                            .limit(perPage)
                            .sort({createdAt: -1});
       posts = posts.map(p=>{
            return {...p._doc, _id:p._id.toString(),  createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString()};
       }); //graph doesn't understand mongoose object hence converting manually
       return { posts: posts, totalPosts: totalPosts };                     
    }
};