// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';

// class App extends Component {
//   render() {
//     return (
//       <div>
//         <div class="bg-img">
//           {/* <Header/> */}
//           <Login />
//         </div>
//       </div>

//     );
//   }
// }

// // class Header extends Component {
// //   render() {
// //     return (
// //       <div>
// //         {/* <header className="App-header"> */}
// //           {/* <img src={logo} className="App-logo" alt="logo" /> */}
// //           {/* <h2>Responsive Social Login Form</h2> */}

// //         {/* </header> */}
// //       </div>
// //     );
// //   }
// // }

// class Login extends Component {
//   render() {
//     return (

// <div className="App">

//         {/* <p>Resize the browser window to see the responsive effect. When the screen is less than 650px wide, make the two columns stack on top of each other instead of next to each other.</p> */}
//         <div class="container">
//           <div>
//             <form action="/action_page.php">
//             <div class="row">
//                 <div class="hide-md-lg">
//                   <p>Or sign in manually:</p>
//                 </div>
//                 <input type="text" name="username" placeholder="Username" required />
//                 <input type="password" name="password" placeholder="Password" required />
//                 <input type="submit" value="Login" />
//               </div>
//               <div class="row">
//               {/* <h2 style={{textAlign:"center"}}>PICTURE VIEWER</h2> */}
//                <div class="vl">
//                    <span class="vl-innertext">or</span>

//                        </div>
//                        </div>


//               <div class="col">
//                 <div class="fb btn">
//                   <i class="fa fa-facebook fa-fw"></i> Login with Facebook
//                     </div>
//                 <div class="twitter btn">
//                   <i class="fa fa-twitter fa-fw"></i> Login with Twitter
//                     </div>
//                 <div class="google btn"><i class="fa fa-google fa-fw">
//                 </i> Login with Google+

//                     </div>

//               </div>
//             </form>
//           </div>
//         </div>
//   <div class="containers">
//     <div class="row">
//       <div class="row">
//         {/* <a href="" style={{ color: "black" }} class="btn">Sign up</a> */}
//         <input type="sign" value="Sign up" />
//       </div>
//       <div class="row">
//         {/* <a href="" style={{ color: "black" }} class="btn">Forgot password?</a> */}
//         <input type="forgot" value="Forgot password?" />
//       </div>
//     </div>
//   </div>
// </div>


//     );
//   }
// }

// export default App;

import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import {BrowserHistory} from 'react-router'
const request = require('superagent');

class App extends Component {
  render() {
    return (
      <div>
        <div class="bg-img">
          <Login />
        </div>
      </div>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        username: undefined,
        password: undefined,
      },
      errors: {},
    }
    this.handleValidation = this.handleValidation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //username
    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "*Cannot be empty"
    }

    if (typeof fields["username"] !== "undefined") {
      let lastAtPos = fields["username"].lastIndexOf('@');
      let lastDotPos = fields["username"].lastIndexOf('.');

      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["username"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["username"].length - lastDotPos) > 2)) {
        formIsValid = false;
        errors["username"] = "*username is not valid";
      }
    }

    //Password
    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "*Cannot be empty"
    }

    if (typeof fields["password"] !== "undefined") {
      if (fields["password"].length >= 8) {
        if (!fields["password"].match(/^((.*[a-z])(.*[0-9]))|((.*[0-9])(.*[a-z]))+$/)) {
          formIsValid = false;
          errors["password"] = "*Password Should be Alpanumeric"
        }
      } else {
        formIsValid = false;
        errors["password"] = "*Password should atleast have 8 characters"
      }

    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  handleChange(event) {
    var value = event.target.value
    var name = event.target.name
    var fields = this.state.fields
    fields[name] = value
    this.setState({ fields })
  }

  handleSubmit(e) {

    e.preventDefault();
    console.log("Function api opened..!!")
    console.log(this.state)

    if (this.handleValidation()) {
      let { username, password } = this.state.fields
      console.log(username, password)
      var url = `http://localhost:5000/authentication/signin`
      request
        .post(url)
        .send({ username, password }).end((err, res) => {
          // console.log(JSON.parse(res.text))
          let response = JSON.parse(res.text)
          // localStorage.setItem('token',response.token)
          if (response.status === true) {
            console.log("status : ", response.status);
            localStorage.setItem('token', response.token)
            alert(response.message)
            console.log("message : ", response.message)
            //   alert(localStorage.getItem('token'))
            //   console.log("token : ", response.token)
            //   //this.props.history.push('/AddCoupon')
          } else {
            alert(response.message)
            console.log("message : ", response.message)
          }
        })
      console.log("Valid Entry")
      // this.props.history.push('/AddCoupon')
      // if(this.state.status==="true"){
      //   this.props.history.push('/AddCoupon')
      // }
    } else {
      alert("Your entry is Invalid")
      console.log("Your entery is Invalid")
    }
  }

  // handleClick() {
  //   BrowserHistory.push('/Signup')
  // }

  render() {
    return (
      <div className="App">
        <div class="container">
          <h1 class="App-name">Pixar-Grid</h1>

          <form onSubmit={this.handleSubmit}>
            <div class="row">
              <input type="text" placeholder="Username" name="username" onChange={this.handleChange} required />
              <span style={{ color: "red" }}>{this.state.errors["username"]}</span><br /><br />
              <input type="password" placeholder="Password" name="password" onChange={this.handleChange} required />
              <span style={{ color: "red" }}>{this.state.errors["password"]}</span><br /><br />
              <input type="submit" value="Login" />
              <a href="" style={{ color: "white", fontSize: "13px"}}>Forgot password?</a>
            </div>
          </form>
          <button class="button" >Sign up</button><br /><br />
          {/* <button class="button">Forgot password?</button><br /><br /> */}
          <div class="vl">
            <span class="vl-innertext">or</span>
          </div>
          {/* onClick={this.handleClick()} */}
          <div class="containerss">
            <div class="row">
              <a href="" class="fb btn">
                <i class="fa fa-facebook fa-fw"></i> Login with Facebook
              </a>
              <a href="" class="Instagram btn">
                <i class="fa fa-Instagram fa-fw"></i> Login with Instagram
              </a>
              <a href="" class="google btn"><i class="fa fa-google fa-fw">
                </i> Login with Google+
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

