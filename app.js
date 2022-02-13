const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const { query } = require("express");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/blogDB');

const postSchema = new mongoose.Schema({
  postTitle: String,
  postContent: String
});

const Post = mongoose.model('Post', postSchema);

app.get('/', function (request, response) {
  response.redirect('/home');
});

app.get('/home', (request, response) => {
  Post.find((err, documents) => {
    if (!err) {
      response.render('home', { startingContent: homeStartingContent, allPosts: documents });
    } else {
      console.log("Unable to find posts. Error: " + err);
    }
  });
});

app.get('/about', function (request, response) {
  response.render('about', { startingContent: aboutContent });
});

app.get('/contact', function (request, response) {
  response.render('contact', { startingContent: contactContent });
});

app.get('/compose', function (request, response) {
  response.render('compose');
});

app.post('/compose', function (request, response) {
  const post = new Post({
    postTitle: _.capitalize(request.body.postTitle),
    postContent: request.body.postContent
  });

  post.save((err) => {
    if (!err) {
      response.redirect('/home');
    }
  });
});


app.get('/posts/:_id', function (request, response) {
  const post_id = request.params._id;
  const obj = {
    postTitle: "Post not found.",
    postContent: "Post with id: '" + post_id + "' not found."
  };

  Post.findOne({ _id: post_id }, (err, queryResult) => {
    if (!err) {
      if (queryResult) {
        obj.postTitle = queryResult.postTitle;
        obj.postContent = queryResult.postContent;
      } else {
        //obj remains not found
      }
    } else {
      console.log("Error finding post with id: " + post_id + ". Error: " + err);
      response.render('post', { postTitle: obj.postTitle, postContent: obj.postContent });
    }
    response.render('post', { postTitle: obj.postTitle, postContent: obj.postContent });
  });
});

app.listen(3000, function () {
  console.log("✔ Server started on port 3000");
});
