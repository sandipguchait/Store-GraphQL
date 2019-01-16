import React from 'react';
import { Box, Text , Heading, Image, Button } from 'gestalt'
import { NavLink, withRouter  } from 'react-router-dom';
import { getToken, clearCart , clearToken } from './utils/index'

class Navbar extends React.Component {
    handleSignOut =()=> {
        // clear token
        clearToken()
        //clear cart
        clearCart()
        // redirect home
        this.props.history.push('/')
    }
    render(){
        return getToken() !== null ? <AuthNav  handleSignOut={ this.handleSignOut} /> : <UnAuthNav/>
    }
}
   
const AuthNav = (props) => (
    <Box 
    height={70}
    display="flex"
    alignItems="center"
    justifyContent="around"
    color="navy"
    padding={1}
    
>
{/* checkout component */}
        <NavLink activeClassName="active" to="/checkout">
            <Text size="xl" color="white">Checkout</Text>
        </NavLink>
    



{/* Title and logo  component */}

    <NavLink activeClassName="active" exact to="/">
    <Box  margin={2} display="flex" alignItems="center">
        <Box height={50} width={50}>
            <Image 
                src="./icons/logo.svg"
                alt="Bew logo"
                naturalHeight={1}
                naturalWidth={1}
            />
            </Box>
            <Heading size="xs" color="orange">
                ChocoBrew
            </Heading>
        </Box>
    </NavLink>



{/* signout component */}
    <Button
        onClick={props.handleSignOut}
       color="transparent"
       text="Sign Out"
       inline
       size="md"
    />
</Box>
);

const UnAuthNav = () => {
    return (
        <Box 
            height={70}
            display="flex"
            alignItems="center"
            justifyContent="around"
            color="navy"
            padding={1}
            
        >
        {/* signin component */}
            <NavLink activeClassName="active" to="/signin">
                <Text size="xl" color="white">Sign In</Text>
            </NavLink>



        {/* Title and logo  component */}

            <NavLink activeClassName="active" exact to="/">
            <Box  margin={2} display="flex" alignItems="center">
                <Box height={50} width={50}>
                    <Image 
                        src="./icons/logo.svg"
                        alt="Bew logo"
                        naturalHeight={1}
                        naturalWidth={1}
                    />
                    </Box>
                    <Heading size="xs" color="orange">
                        ChocoBrew
                    </Heading>
                </Box>
            </NavLink>



        {/* signup component */}
            <NavLink activeClassName="active" to="/signup">
                <Text size="xl" color="white">Sign Up</Text>
            </NavLink>
        </Box>
    );
};

export default withRouter(Navbar);