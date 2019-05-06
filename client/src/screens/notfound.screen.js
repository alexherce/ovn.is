import React from 'react';
import { Container, Grid, Segment, Header, Image } from 'semantic-ui-react';

class NotFound extends React.Component {
  render() {
    return(
      <Container style={{padding: '2.5em'}}>
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column width={10} textAlign='left'>
              <Header
                as='h1'
                content='Sorry, link not found'
                style={{
                  fontSize: '3em',
                  fontWeight: 'bold',
                  marginBottom: 0,
                  width: '100%'
                }}
              />
              <Header
                as='h2'
                content='The link you are trying to access is not available'
                style={{
                  fontSize: '1.5em',
                  fontWeight: '100',
                  marginTop: '0.75em'
                }}
              />
            </Grid.Column>
            <Grid.Column floated='right' width={6}>
              <Image size='large' src='https://storage.googleapis.com/ovnis/assets/abduction-colored.png' verticalAlign='middle'/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default NotFound;
