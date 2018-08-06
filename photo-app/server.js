var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var empty = require('is-empty');
var jwt = require('jsonwebtoken');
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
const saltRounds = 10;
var ig = require('instagram-node').instagram();
var accessToken;
var output;
var request = require('superagent');

const port = process.env.PORT || 5000;
var db;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Listening on port ${port}`));

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err);
    db = client.db('photoviewer_db');
    console.log("Mongodb is opened.")
})

app.post('/authentication/signup', (req, res) => {
    console.log("Signup Post Method call");
    console.log(req.body);
    let { username, name, password } = req.body;
    db.collection('login').findOne({ username }, (err, result) => {
        if (err) {
            console.log(err)
            res.json({
                message: err,
                status: false
            })
        } else {
            console.log(result);
            if (empty(result)) {
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    // Store hash in your password DB.
                    db.collection('login').save({ name, username, password:hash }, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('saved to database')
                            res.json({
                                message: "Signed Up Successfully.",
                                status: true
                            })
                        }
                    })
                });
            } else {
                console.log("*Username is already exists.")
                res.json({
                    message: "*Username is already exists.",
                    status: false
                })
            }
        }
    })
})

app.post('/authentication/signin', (req, res) => {
    console.log("SignIn Post Method call");
    console.log(req.body);
    let { username, password } = req.body;

    db.collection('login').findOne({ username }, (err, result) => {
        if (err) {
            console.log(err)
            res.json({
                message: err,
                status: false
            })
        } else {
            console.log(result)
            if (!empty(result)) {
                bcrypt.compare(password, result.password, function(err, hash) {
                    // res == true
                    console.log("password match : ", hash)
                    if (hash===true) {
                        // var {_id,name} = result
                        // console.log(name,_id)
                        // console.log("Admin is Logged in Successfully")
                        // jwt.sign({ _id,name,username }, 'secretkey',{ expiresIn : '30s' }, (err, token) => {
                        res.json({
                            // token,
                            name:result.name,
                            message: "Admin is Logged in Successfully",
                            status: true
                        })
                        // })
                    } else {
                        console.log("*Password is invalid")
                        res.json({
                            message: "*Password is invalid",
                            status: false
                        })
                    }
                });
            } else {
                console.log("*Username is invalid.")
                res.json({
                    message: "*Username is invalid",
                    status: false
                })
            }
        }
    })
})

//Instagram API
var client_id= 'ab8ee4f08cda4f77a685ccad6289d5b8';
var client_secret = '4c9dcaafe9574bc593c47f8db4c48590';
//the redirect uri we set when registering our application
var redirectUri = 'http://localhost:5000/handleAuth';

// app.get('/instagramApi',(req,res)=>{
//     console.log("Instagram API.!!!")
//     let url= `https://api.instagram.com/oauth/authorize/?client_id=${client_id}&redirect_uri=${redirectUri}&response_type=code`
//     request.get(url)
//     .end((err,res)=>{
//       if(err){
//         console.log("Error",err)
//       }else{
//         console.log("Hello Instagram.!!")
//         console.log(JSON.parse(res.text))
//         res.send(JSON.parse(res.text))
//       }
//     })
// })


ig.use({
    client_id,
    client_secret
});

// directing to the instagram authorization url
app.get('/authorize', function(req, res){
    // set the scope of our application to be able to access likes and public content
    res.redirect(ig.get_authorization_url(redirectUri, { scope : ['public_content','likes']}) );
});

// request the Access token
app.get('/handleAuth', function(req, res){
    console.log("Hello HandleAuth")
    //retrieves the code that was passed along as a query to the '/handleAuth' route and uses this code to construct an access token
    ig.authorize_user(req.query.code, redirectUri, function(err, result){
        if(err) res.send( err );console.log('my result',result)
    // store this access_token in a global variable called accessToken
        accessToken = result.access_token;
        console.log('access token ',accessToken)
        // res.send(result)
    // After getting the access_token redirect to the '/' route 
        res.redirect('/');
    });
})

// getting photos
app.get('/', function (req, res) {
    // res.send("im in instagram")
    console.log("Getting photos")
    // create a new instance of the use method which contains the access token gotten
    ig.use({
        access_token: accessToken
    });
    console.log(accessToken, accessToken.split('.')[0])

    ig.user_media_recent(accessToken.split('.')[0],function(err, result, pagination, remaining, limit){
        if (err) res.json(err);
        output = result;
        // res.send(result)
        // pass the json file gotten to our ejs template
        console.log("result = ", output)
        console.log("pagination = ", pagination)
        console.log("remaining = ", remaining)
        console.log("limit = ", limit);
        console.log(output.length);
        res.send(output)

        for(var i = 0; i < output.length; i++) {
                let img_id= output[i].id
                let img_url= output[i].images.standard_resolution.url
            
            db.collection('photos').findOne({img_id}, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result);
                    if (empty(result)) {
                        db.collection('photos').save({img_id,img_url}, (err, resp) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('saved to database')
                            }
                        })
                    }
                }
            })
        }
        // res.render('pages/index', { instagram: result });
    });
    // res.send(output)
});

app.get('/search', (req, res) => {
    console.log("kalpana")
    db.collection('photo').find().toArray((err, result) => {
        if (err) {
            console.log(err)
            // return        
        }
        console.log(typeof (result))
        res.send(result)
    })
});

app.post('/search/:id', (req, res) => {
    console.log(req.params.id);
    
    db.collection('photo').findOne({_id:new ObjectId(req.params.id)},(err,result)=>{
        if (err){
            return console.log(err);
        }else{
            console.log('image is fetched successfully..!!!')
            console.log (result);
            res.send(result.imgpath)
        } 
    })
});
