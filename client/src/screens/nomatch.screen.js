import React from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';

class NoMatch extends React.Component {
  render() {
    return(
      <Container style={{ marginTop: '5em' }}>
        <div className='not-found'>
          <style>{`
            body > div,
            body > div > div,
            body > div > div > div.not-found {
              height: 100%;
            }
            `}
          </style>
          <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
              <Segment stacked>
                <h2>404 Not Found</h2>
                <p>Unable to find the page you are looking for</p>
              </Segment>
            </Grid.Column>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default NoMatch;
