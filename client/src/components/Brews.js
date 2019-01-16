import React, { Component } from 'react';
import { Box , Heading , Text , Image , Card, Button, Mask, IconButton } from 'gestalt';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { calculatePrice, setCart , getCart } from '../components/utils/index';

//Strapi configuration
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);


class Brews extends Component {

    state={
        brews:[],
        brand:'',
        cartItems: [],
        loader: true
    }

    async componentDidMount(){
        try {
            const response = await strapi.request('POST', '/graphql', {
                data:{
                    query:`query{
                        brand(id:"${this.props.match.params.brandId}"){
                          _id
                          name
                          brews{
                            _id
                            name
                            description
                            image{
                              url
                            }
                            price
                          }
                        }
                      }`
                }
            });

            this.setState({
                brews: response.data.brand.brews,
                brand: response.data.brand.name,
                loader: false,
                cartItems: getCart()
            })

        } catch(err){
            console.log(err)
        }
    }
    // adding items to the cartt

    addToCart =(brew)=> {
        const alreadyInCart = this.state.cartItems.findIndex(item => item._id === brew._id);

        if ( alreadyInCart === -1 ){
            const updateItems = this.state.cartItems.concat({
                ...brew,
                quantity:1
            });
            this.setState({ cartItems: updateItems }, ()=> setCart(updateItems));
        } else {
            const updateItems = [...this.state.cartItems];
            // increasing items by 1 which are already in cart 
            updateItems[alreadyInCart].quantity += 1;
            this.setState({ cartItems: updateItems },()=> setCart(updateItems));
        }
    }

    // Deleting elements from Cart 
    deleteItemFromCart =(itemToDelete)=> {
        const filteredItems = this.state.cartItems.filter(item => item._id !== itemToDelete._id);
        this.setState({ cartItems: filteredItems }, ()=> setCart(filteredItems))
    }

    render() {

        const {brand, brews, cartItems, loader } = this.state;
        return (
            <Box 
                marginTop={4}
                display="flex"
                justifyContent="center"
                alignItems="start"
                dangerouslySetInlineStyle={{
                    __style:{
                        flexWrap: 'wrap-reverse',
                    }
                }}
            >
                {/* Brew Section */}
                <Box display="flex" direction="column" alignItems="center">
                {/* Brews Heading */}
                    <Box margin={2}>
                        <Heading color="orchid">{brand}</Heading>
                    </Box>
                {/* Brews List  */}
                    <Box 
                        dangerouslySetInlineStyle={{
                            __style:{
                                backgroundColor: '#bdcdd9'
                            }
                        }}
                        wrap
                        shape="rounded"
                        display="flex"
                        justifyContent="center"
                        padding={4}
                    >
                        {brews.map(brew=>(
                             <Box paddingY={4} margin={2} width={210} key={brew._id}>
                             <Card
                                 image={
                                   <Box height={250} width={200} >
                                     <Image
                                     fit="cover"
                                       alt="brew"
                                       naturalHeight={1}
                                       naturalWidth={1}
                                       src={`${apiUrl}${brew.image.url}`}
                                     />
                                   </Box>
                                 }
                               >
                               <Box display="flex"
                                   alignItems="center"
                                   justifyContent="center"
                                   direction="column"
                               >
                               <Box marginBottom={2} >
                                <Text size="xl">{brew.name}</Text>
                               </Box>
                                   <Text align="center">{brew.description}</Text>
                                   <br/>
                                   <Text bold color="darkGray" >${brew.price}</Text>
                                   <Box marginTop={2}>
                                    <Text bold size="xl">
                                        <Button  onClick={()=>this.addToCart(brew)}color="blue" text=" Add to Cart" />
                                    </Text>
                                   </Box>
                               </Box>
                             </Card>
                           </Box>
                        ))}
                    </Box>
                    {/* Loader or spinner  */}
                    { loader && <Loader/>}
                </Box>
                {/* User Cart */}
                <Box  alignSelf="end" marginTop={2} marginLeft={8}>
                    <Mask shape="rounded" wash>
                        <Box  direction="column" alignItems="center" padding={2}>
                        {/* User Cart Heading */}
                        <Heading align="center" size="md"> Your Cart </Heading>
                        <Text color="gray" italic align="center"> {cartItems.length} items selected</Text>
                        {/* Cart Items Will Add */}
                                 {cartItems.map(item => (
                                     <Box key={item._id} display="flex" alignItems="center">
                                        <Text>
                                            {item.name} x {item.quantity} - ${(item.quantity * item.price).toFixed(2)}
                                        </Text>
                                        <IconButton 
                                            accessibilityLabel="Delete Item"
                                            icon="cancel"
                                            size="sm"
                                            iconColor="red"
                                            onClick={()=> this.deleteItemFromCart(item)}
                                        />
                                     </Box>
                                 ))}
                            <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                                 <Box margin={2}>
                                    {cartItems.length === 0 && (
                                        <Text color="red">Please Select Some Items</Text>
                                    )}
                                 </Box>
                                 <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                                 <Text>
                                     <Link to="/checkout">checkout</Link>
                                 </Text>
                            </Box>
                        </Box>
                    </Mask>
                </Box>
            </Box>
        );
    }
}

export default Brews;