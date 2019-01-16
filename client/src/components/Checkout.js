import React, { Component } from 'react';
import { Container , Box , Button , Heading , Text , TextField } from 'gestalt';
import ToastMessage from './toastmessage.js';
import { getCart, calculatePrice } from './utils/index';
import { Elements, StripeProvider, CardElement, injectStripe } from 'react-stripe-elements';

//strapi configuration 
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);


class _CheckoutForm extends Component {

    state={
        cartItems: [],
        address:'',
        postalCode:'',
        city:'',
        phoneNumber:'',
        toast: false,
        toastMessage: ''
    }

    componentDidMount() {
        this.setState({ cartItems: getCart()})
    }

    handleChange = ({ event, value })=> {
        event.persist();
        this.setState({ [event.target.name]: value})
     }
 
     handleConfirmOrder = async (event)=> {
         event.preventDefault();
 
         if(this.isFormEmpty(this.state)){
             this.showToast('Fill in all Fields');
             return;
         }
     }
      // checks if form fields are empty or not 
    isFormEmpty =({address, postalCode, city, phoneNumber })=> {
        return !address || !postalCode || !city || !phoneNumber
    }

    // shows a message if formfields are empty
    showToast = toastMessage => {
        this.setState({ toast: true , toastMessage});
        setTimeout(()=> this.setState({ toast: false , toastMessage: ''}), 5000)
    }
 

    render() {
        const { toast , toastMessage, cartItems  } = this.state;

        return (
            <Container>
                <Box
                   color="darkWash"
                    margin={4}
                    padding={4}
                    marginTop={10}
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                >
                 {/* Checkout Form Heading */}
                 <Heading color="midnight">CheckOut</Heading>
                {cartItems.length > 0 ? <React.Fragment>
                    {/* user Cart */}
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        marginTop={2}
                        marginBottom={6}
                    >
                        <Text color="darkGray" italic >{cartItems.length} Items for Checkout</Text>
                        <Box padding={2}>
                            {cartItems.map(item => (
                                <Box key={item._id} padding={1}>
                                <Text color="midnight">
                                {item.name} X {item.quantity} - ${item.quantity * item.price }
                                </Text>
                                </Box>
                            ))}
                        </Box>
                        <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
                    </Box>

                        {/* Checkout  Form */}
                        <form style={{
                        display:'inlineBlock',
                        textAlign:'center',
                        maxWidth: 450
                    }}
                    onSubmit={this.handleConfirmOrder}
                    >

                    {/* Shipping Address Input  */}
                        <TextField
                           id="address"
                           type="text"
                           name="address"
                           placeholder="Shipping Address"
                           onChange={this.handleChange}
                        />
                    {/* postal code   Input  */}
                    <TextField
                           id="postalCode"
                           type="number"
                           name="postalCode"
                           placeholder="Postal Code"
                           onChange={this.handleChange}
                        />
                    {/* city Input  */}
                    <TextField
                           id="city"
                           type="text"
                           name="city"
                           placeholder="City of Residence"
                           onChange={this.handleChange}
                        />
                    {/* Phone Number Input  */}
                    <TextField
                           id="phoneNumber"
                           type="number"
                           name="phoneNumber"
                           placeholder="Contact Number"
                           onChange={this.handleChange}
                        />
                        {/* Credit Card Elements */}
                        <CardElement id="stripe__input" onReady={input => input.focus()}/>

                        <button id="stripe__button" type="submit">Submit</button>
                    </form>
                </React.Fragment> : (
                    // Default Text if No Items in Cart 
                    <Box color="darkWash" shape="rounded" padding={4}>
                       <Heading align="center" color="watermelon" size="xs">Your Cart is Empty</Heading>
                       <Text align="center" italic color="green">Add Some Brews!</Text>
                    </Box>
                )}
                    </Box>
                <ToastMessage show={this.state.toast} message={this.state.toastMessage} />
            </Container>
        );
    }
}
const CheckoutForm = injectStripe(_CheckoutForm);


const Checkout = ()=> (
    <StripeProvider apiKey="pk_test_QREVHSBFyM21NjYBhGpnef9U">
        <Elements>
            <CheckoutForm/>
        </Elements>
    </StripeProvider>
)

export default Checkout;