import React, { Component } from 'react';
import { 
    Container, 
    Box, Heading,
    Card, Image, 
    Text, SearchField,
    Icon } from 'gestalt';

   
import { Link } from 'react-router-dom';
import './App.css';
import Loader from './Loader';

//Strapi configuration
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {

  state = {
    brands:[],
    searchTerm:'',
    loader: true
  }

  // Executing Query using GraphQl+Strapi
  async componentDidMount(){

    try {
      const response = await strapi.request('POST', '/graphql',{
        data:{
          query:`query{
            brands{
              _id
              description
              name
              image{
                url
              }
            }
          }`
        }
      });
      //setting state after fetching data from query
      this.setState({ brands: response.data.brands , loader: false });
    } catch(err){
      console.log(err);
      this.setState({loader: false})
    }
  }
  // Getting the value of Search field 
  handleChange=(e)=>{
    this.setState({ searchTerm: e.value })
  }

  // Filtering the Search with Brands
  filteredBrands=({ brands, searchTerm })=>(
     brands.filter(brand => (
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      brand.description.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  )

  render() {

    const { searchTerm, loader } = this.state ;

    return (
      <Container>
          {/* Brands Search Field */}
          <Box display="flex" justifyContent="center" marginTop={5} marginBottom={8}>
            <SearchField 
              id="searchField"
              accessibilityLabel=" Brands Search Field"
              placeholder="Search Brands"
              onChange={this.handleChange}
              value={searchTerm}
            />
            <Box margin={3}>
                <Icon 
                  icon="filter"
                  color={searchTerm ? "blue" : "red"}
                  size={20}
                  accessibilityLabel="Filter"
                />
            </Box>
          </Box>

          
          {/*brand section*/}
          <Box
            display="flex"
            justifyContent="center"
            marginBottom={2}
          >

          {/* Brand Header */}
          <Heading color="navy" size="md">
              Brew Brands
          </Heading>
          </Box>

          {/* BRANDS UI */}
            <Box 
                dangerouslySetInlineStyle={{
                  __style:{
                    backgroundColor: "#d6c8ec"
                  }
                }}
                shape="rounded"
                wrap display="flex"
                justifyContent="around"

            >
              {this.filteredBrands(this.state).map(brand => (
                <Box paddingY={4} margin={2} width={200} key={brand._id}>
                  <Card
                      image={
                        <Box height={200} width={200} >
                          <Image
                          fit="cover"
                            alt="Brand"
                            naturalHeight={1}
                            naturalWidth={1}
                            src={`${apiUrl}${brand.image.url}`}
                          />
                        </Box>
                      }
                    >
                    <Box display="flex"
                        alignItems="center"
                        justifyContent="center"
                        direction="column"
                    >
                        <Text size="xl">{brand.name}</Text>
                        <Text align="center">{brand.description}</Text>
                        <Text size="xl">
                          <Link to={`/${brand._id}`}>See Brews</Link>
                        </Text>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
             {/* Showing the Spinner  */}
             { loader && <Loader/>}
      </Container>
    );
  }
}

export default App;
