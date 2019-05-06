import React, { Component } from 'react';
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  Responsive,
  Segment,
  Form,
  Dimmer,
  Loader,
  Message
} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import api from '../lib/api';

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      generated: false,
      error: false,
      linkGenerated: '',
      longUrl: ''
    };
  }

  fileInputRef = React.createRef();

  fileChange = e => {
    this.setState({ file: e.target.files[0] });
  };

  createLink = () => {
    this.setState({loading: true});

    api.post('/create?key=AIzaSyD8xnJttXrsQfCamH9Wgsw6hIWO7yP4L1Q', {url: this.state.longUrl}, { headers: { 'x-ovnis-token': 'hola' }})
    .then(response => {
      if (response.ok) {
        return this.setState({linkGenerated: 'https://ovn.is/' + response.data.url, loading: false, generated: true, longUrl: ''});
      } else {
        console.log(response);
        if (response.problem === 'CLIENT_ERROR') {
          if (response.data.error) return this.setState({loading: false, generated: false, error: true, errorMessage: response.data.error, longUrl: ''});
          if (response.data.message) return this.setState({loading: false, generated: false, error: true, errorMessage: response.data.message, longUrl: ''});
          if (response.status === 429) return this.setState({loading: false, generated: false, error: true, errorMessage: 'Error while communicating with our servers. Please try again...', longUrl: ''});
          return this.setState({loading: false, generated: false, error: true, errorMessage: 'Unknown error, please try again...', longUrl: ''});
        } else {
          return this.setState({loading: false, generated: false, error: true, errorMessage: response.problem, longUrl: ''});
        }
      }
    })
  }

  handleUpload = () => {
    this.setState({loading: true});

    const headers = {
      'Content-Type': 'multipart/form-data'
    };

    let form = new FormData();

    form.append('file', this.state.file);
    form.append('identifier', this.state.folder);

    api.post('https://uploader.ovn.is/upload?key=AIzaSyD8xnJttXrsQfCamH9Wgsw6hIWO7yP4L1Q', form, { headers })
    .then(response => {
      if (response.ok) {
        return this.setState({linkGenerated: response.data.url, loading: false, generated: true, longUrl: '', file: ''});
      } else {
        console.log(response.data);
        if (response.problem === 'CLIENT_ERROR') {
          if (response.data.error) return this.setState({loading: false, generated: false, error: true, errorMessage: response.data.error, longUrl: '', file: ''});
          if (response.data.message) return this.setState({loading: false, generated: false, error: true, errorMessage: response.data.message, longUrl: '', file: ''});
          if (response.status === 429) return this.setState({loading: false, generated: false, error: true, errorMessage: 'Error while communicating with our servers. Please try again...', longUrl: '', file: ''});
          return this.setState({loading: false, generated: false, error: true, errorMessage: 'Unknown error, please try again...', longUrl: '', file: ''});
        } else {
          return this.setState({loading: false, generated: false, error: true, errorMessage: 'Unknown error, please try again...', longUrl: '', file: ''});
        }
      }
    });
  }

  Renderer = () => {
    if (this.state.generated === true) return(<this.GeneratedLink/>);
    if (this.state.error === true) return(<this.GenerateError/>);
    return (<this.GenerateForm/>);
  }

  GeneratedLink = () => {
    return(
      <Grid container stackable verticalAlign='middle' textAlign='center'>
        <Grid.Column>
          <Grid.Row centered>
            <Header size='huge' inverted>Done! Copy this URL</Header>
          </Grid.Row>
          <Grid.Row centered>
            <Form size='massive'>
              <Form.Field>
                <CopyToClipboard text={this.state.linkGenerated}>
                  <Form.Input
                    large
                    inverted
                    action={{ color: 'blue', labelPosition: 'right', icon: 'copy', content: 'Copy', size: 'massive' }}
                    placeholder='Shorten your link'
                    value={this.state.linkGenerated}
                  />
                </CopyToClipboard>

              </Form.Field>
            </Form>
          </Grid.Row>
          <Grid.Row>
            <Button primary size='huge' style={{marginTop: '2em'}} onClick={() => this.setState({generated: false})}>
              Start over
              <Icon name='right arrow' />
            </Button>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }

  GenerateForm = () => {
    return(
      <Grid container stackable verticalAlign='middle' textAlign='center'>
        <Dimmer active={this.state.loading}>
          <Loader size='massive'>Please wait...</Loader>
        </Dimmer>
        <Grid.Row centered>
          <Header size='huge' inverted>Get your free short link</Header>
        </Grid.Row>
        <Grid.Row centered>
          <Form size='massive' style={{width: '100%'}}>
            <Form.Input
              size='large'
              inverted
              action={{color: 'blue', content: 'Shorten', size: 'massive', onClick: () => this.createLink()}}
              placeholder='Shorten your link'
              value={this.state.longUrl}
              onChange={(v) => this.setState({longUrl: v.target.value})}
            />
          </Form>
        </Grid.Row>
        <Grid.Row centered>
          <Header size='huge' inverted>...or host your image for free</Header>
        </Grid.Row>
        <Grid.Row centered>
          <Form size='massive' style={{width: '100%'}}>
            <Button content={((!!this.state.file)?('Change Image'):('Choose Image')) + ' (jpg, png, gif, bmp)'} labelPosition="left" icon="image" size='massive' color={((!!this.state.file)?('grey'):('blue'))} fluid onClick={() => this.fileInputRef.current.click()}/>
            <input ref={this.fileInputRef} type="file" hidden onChange={this.fileChange}/>
            {(!!this.state.file) && (
              <Form.Field>
                <label style={{color: 'white', marginTop: '2em'}}>File to upload:</label>
                <input fluid value={this.state.file.name} readOnly />
              </Form.Field>
            )}
            {(!!this.state.file) && (
              <Button color='blue' fluid size='massive' onClick={this.handleUpload}>
                Upload
              </Button>
            )}
          </Form>
        </Grid.Row>
      </Grid>
    );
  }

  GenerateError = () => {
    return(
      <Grid container stackable verticalAlign='middle' textAlign='center'>
        <Grid.Column>
          <Grid.Row centered>
            <Message negative size="massive">
              <Message.Header>Sorry, something went wrong</Message.Header>
              <p>{(!!this.state.errorMessage)?(this.state.errorMessage):('Please try again...')}</p>
              <Button color='red' size="large" onClick={() => this.setState({error: false})}>Try again</Button>
            </Message>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }

  render() {
    return(
      <div>
        <Container style={{padding: '2.5em'}}>
          <Grid container stackable verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column width={10} textAlign='left'>
                <Header
                  as='h1'
                  content='Short links and images out of this world'
                  style={{
                    fontSize: '3em',
                    fontWeight: 'bold',
                    marginBottom: 0,
                    width: '100%'
                  }}
                />
                <Header
                  as='h2'
                  content='Top tier performance and reliability. Create links and share images faster than ever.'
                  style={{
                    fontSize: '1.5em',
                    fontWeight: '100',
                    marginTop: '0.75em'
                  }}
                />
              </Grid.Column>
              <Grid.Column floated='right' width={6}>
                <Responsive {...Responsive.onlyMobile} as={Image} size='small' src='https://storage.googleapis.com/ovnis/assets/alien-ship-colored.png' verticalAlign='middle'/>
                <Responsive {...Responsive.onlyTablet} as={Image} size='large' src='https://storage.googleapis.com/ovnis/assets/alien-ship-colored.png' verticalAlign='middle'/>
                <Responsive {...Responsive.onlyComputer} as={Image} size='large' src='https://storage.googleapis.com/ovnis/assets/alien-ship-colored.png' verticalAlign='middle'/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <Segment inverted style={{ backgroundColor: '#0d052d', paddingTop: '5em', paddingBottom: '5em'}} vertical id={'link'}>
          <this.Renderer/>
        </Segment>
        <Segment style={{ padding: '0em' }} vertical>
          <Grid celled='internally' columns='equal' stackable>
            <Grid.Row textAlign='center'>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  What does <i>ovni</i> mean?
                </Header>
                <p style={{ fontSize: '1.33em' }}><i>Objeto Volador No Identificado</i> or <a href='https://en.wiktionary.org/wiki/OVNI' target='_blank' rel="noopener noreferrer">spanish for UFO</a></p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column width={6} textAlign='center'>
                <Responsive {...Responsive.onlyMobile} as={Image} size='small' src='https://storage.googleapis.com/ovnis/assets/abduction-cow.png' verticalAlign='middle'/>
                <Responsive {...Responsive.onlyTablet} as={Image} size='large' src='https://storage.googleapis.com/ovnis/assets/abduction-cow.png' verticalAlign='middle' />
                <Responsive {...Responsive.onlyComputer} as={Image} size='large' src='https://storage.googleapis.com/ovnis/assets/abduction-cow.png' verticalAlign='middle' />
              </Grid.Column>
              <Grid.Column floated='right' width={8}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  Powerful short links
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  Create free, nice permanent short links
                </p>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  Powerful images
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  Host your images with us and share them everywhere
                </p>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  Top tier infrastructure
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  Built with the best and newest technologies, we're ready for speed and reliability
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
}

export default Landing;
