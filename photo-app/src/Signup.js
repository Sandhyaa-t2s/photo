import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
const request = require('superagent');

class App extends Component {
    render() {
      return (
        <div>
          <div class="bg-img">
            <Signup/>
          </div>
        </div>
      );
    }
  }

  class Signup extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {
          username: undefined,
          name: undefined,
          password: undefined,
         
        },
        errors: {}
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleValidation = this.handleValidation.bind(this);
      
      // this.bringSignup = this.bringSignup.bind(this);
    }
    // bringSignup() {
    //   this.setState({ Signup: !this.state.Signup })
  
    // }
   
    handleValidation() {
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
  
      //UserName
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
  
      //name
      if (!fields["name"]) {
        formIsValid = false;
        errors["name"] = "Cannot be empty";
      }
  
      if (typeof fields["name"] !== "undefined") {
        if (!fields["name"].match(/^[a-zA-Z]+$/)) {
          formIsValid = false;
          errors["name"] = "Only letters";
        }
      }
  
      //password
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
      console.log("hey")
      console.log(this.state)
      if (this.handleValidation()) {
        let { username, name, password } = this.state.fields
        var url = `http://localhost:5000/authentication/signup`
        request
          .post(url)
          .send({ username, name, password }).end((err, res) => {
            console.log(res.text)
            alert(res.text)
          })
        console.log("Valid Entry")
      } else {
        alert("Your entry is Invalid")
      }
    }
  
    render() {
      return (
        <div className="App">
          <div class="containers">
  
            <form onSubmit={this.handleSubmit} >
              <br /><br />
              <input type="text" placeholder="username" name="username" onChange={this.handleChange} required /><br />
              <span style={{ color: "red" }}>{this.state.errors["username"]}</span><br /><br />
  
              <input type="text" placeholder="name" name="name" onChange={this.handleChange} required /><br />
              <span style={{ color: "red" }}>{this.state.errors["name"]}</span><br /><br />
  
              <input type="password" placeholder="password" name="password" onChange={this.handleChange} required /><br />
              <span style={{ color: "red" }}>{this.state.errors["password"]}</span><br /><br />
              <button class="button"> Register </button><br /><br />
            </form>
          </div>
        </div>
      );
    }
  }

  export default App;