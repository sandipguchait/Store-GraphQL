import React, { Component } from 'react';
import { Container , Box , Button , Heading , Text , TextField} from 'gestalt';
import ToastMessage from './toastmessage.js';
import { setToken } from './utils/index';

//strapi configuration 
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);


class SignIn extends Component {

    state={
        username: '',
        password: '',
        toast: false,
        toastMessage: '',
        loading: false
    }

    handleChange = ({ event, value })=> {
       event.persist();
       this.setState({ [event.target.name]: value})
    }

    handleSubmit = async (event)=> {
        event.preventDefault();
        const { username, password } = this.state;

        if(this.isFormEmpty(this.state)){
            this.showToast('Fill in all Fields');
            return;
        }

        //SIGNUP USER 
        try {
            //set loading - true 
            this.setState({ loading: true })
            // make request to register user with strapi
            const response = await strapi.login(username, password);
            //set loading false 
            this.setState({ loading: false });
            // put token in local storage
            setToken(response.jwt)
            // redirect to homepage
            this.redirectUser('/') 

        }catch (err){
            //set loading - false 
            this.setState({ loading: false });
            // show error message with toast message 
            this.showToast(err.message);
        }
    }

    redirectUser = (path) => this.props.history.push(path);

    // checks if form fields are empty or not 
    isFormEmpty =({username , password , email })=> {
        return !username || !password
    }

    // shows a message if formfields are empty
    showToast = toastMessage => {
        this.setState({ toast: true , toastMessage});
        setTimeout(()=> this.setState({ toast: false , toastMessage: ''}), 5000)
    }

    render() {
        return (
            <Container>
                <Box
                    dangerouslySetInlineStyle={{
                        __style:{
                            backgroundColor: '#d6a3b1'
                        }
                    }}
                    margin={4}
                    padding={4}
                    marginTop={10}
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                >
                    {/* Signin Form */}
                    <form style={{
                        display:'inlineBlock',
                        textAlign:'center',
                        maxWidth: 450
                    }}
                    onSubmit={this.handleSubmit}
                    >
                    {/* Sign in Form Heading */}
                    <Box
                      marginBottom={2}
                      display="flex"
                      direction="column"
                      alignItems="center"
                    >
                        <Heading color="midnight">Welcome Back</Heading>
                    </Box>
                    {/* Username Input  */}
                        <TextField
                           id="username"
                           type="text"
                           name="username"
                           placeholder="Username"
                           onChange={this.handleChange}
                        />

                    {/* Password Input  */}
                    <TextField
                           id="password"
                           type="text"
                           name="password"
                           placeholder="Password"
                           onChange={this.handleChange}
                        />
                        <Box marginTop={4}>
                            <Button
                            disabled={this.state.loading}
                            inline
                            marginTop={5}
                            color="blue"
                            text="submit"
                            type="submit"
                        />
                        </Box>
                    </form>
                </Box>
                <ToastMessage show={this.state.toast} message={this.state.toastMessage} />
            </Container>
        );
    }
}

export default SignIn;