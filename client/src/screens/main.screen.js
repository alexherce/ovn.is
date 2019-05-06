import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
  Form,
  Input,
  Dimmer,
  Loader,
  Message
} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import api from '../lib/api';

const getWidth = () => {
  const isSSR = typeof window === 'undefined'
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const HomepageHeading = ({ mobile }) => (
  <Container>
    <Grid container stackable verticalAlign='middle'>
      <Grid.Row>
        <Grid.Column width={10} textAlign='left'>
          <Header
            as='h1'
            content='Short and fast links out of this world'
            style={{
              fontSize: mobile ? '2em' : '4em',
              fontWeight: 'bold',
              marginBottom: 0,
              marginTop: mobile ? '1.5em' : '3em',
              width: '100%'
            }}
          />
          <Header
            as='h2'
            content='Create and share trusted, powerful short links with analytics'
            style={{
              fontSize: mobile ? '1.5em' : '1.7em',
              fontWeight: '100',
              marginTop: mobile ? '0.25em' : '0.5em',
            }}
          />
        </Grid.Column>
        <Grid.Column floated='right' width={6}>
          <Responsive {...Responsive.onlyMobile} as={Image} size='small' src='https://storage.googleapis.com/ovnis/assets/alien-ship-colored.png' verticalAlign='middle'/>
          <Responsive {...Responsive.onlyTablet} as={Image} size='large' src='https://storage.googleapis.com/ovnis/assets/alien-ship-colored.png' verticalAlign='middle' style={{marginTop: '7em'}}/>
          <Responsive {...Responsive.onlyComputer} as={Image} size='large' src='https://storage.googleapis.com/ovnis/assets/alien-ship-colored.png' verticalAlign='middle' style={{marginTop: '7em'}}/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

/* Heads up!
* Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
* It can be more complicated, but you can create really flexible markup.
*/
class DesktopContainer extends Component {
  state = {}

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  render() {
    const { children } = this.props
    const { fixed } = this.state

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu} >
          <Segment
            textAlign='center'
            style={{ minHeight: 600, padding: '1em 0em' }}
            vertical >
            <Menu
              borderless
              fixed={'top'}
              secondary={false}
              size='large' >
              <Container>
                <Menu.Item as='a'>
                  <Image size='small' src='https://storage.googleapis.com/ovnis/assets/logo.png' />
                </Menu.Item>
                <Menu.Item as='a'>About</Menu.Item>
                <Menu.Item as='a'>Plans</Menu.Item>
                <Menu.Item position='right'>
                  <Button as='a'>
                    Log in
                  </Button>
                  <Button as='a' style={{ marginLeft: '0.5em' }}>
                    Sign Up
                  </Button>
                </Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </Visibility>

        {children}
      </Responsive>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  state = {}

  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth} >
        <Sidebar
          as={Menu}
          animation='push'
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened} >
          <Menu.Item as='a' active>
            Home
          </Menu.Item>
          <Menu.Item as='a'>About</Menu.Item>
          <Menu.Item as='a'>Plans</Menu.Item>
          <Menu.Item as='a'>Log in</Menu.Item>
          <Menu.Item as='a'>Sign Up</Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            textAlign='center'
            style={{ minHeight: 350, padding: '1em 0em' }} >
            <Container>
              <Menu pointing secondary size='large'>
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name='sidebar' />
                </Menu.Item>
                <Menu.Item>
                  <Image size='tiny' src='/ovnis-logo.png' />
                </Menu.Item>
                <Menu.Item position='right'>
                  <Button as='a' style={{ marginLeft: '0.5em' }}>
                    Sign Up
                  </Button>
                </Menu.Item>
              </Menu>
            </Container>
            <HomepageHeading mobile />
          </Segment>

          {children}
        </Sidebar.Pusher>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

class Main extends Component {
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

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  createLink = () => {
    this.setState({loading: true});

    api.post('/create?key=AIzaSyD8xnJttXrsQfCamH9Wgsw6hIWO7yP4L1Q', {url: this.state.longUrl}, { headers: { 'x-ovnis-token': 'hola' }})
    .then(response => {
      if (response.ok) {
        return this.setState({linkGenerated: 'https://ovn.is/' + response.data.url, loading: false, generated: true, longUrl: ''});
      } else {
        console.log(response);
        if (response.problem == 'CLIENT_ERROR') {
          if (response.data.error) return this.setState({loading: false, generated: false, error: true, errorMessage: response.data.error});
          if (response.data.message) return this.setState({loading: false, generated: false, error: true, errorMessage: response.data.message});
          return this.setState({loading: false, generated: false, error: true, errorMessage: 'Unknown error, please try again...'});
        } else {
          return this.setState({loading: false, generated: false, error: true, errorMessage: response.problem});
        }
      }
    })
  }

  Renderer = () => {
    if (this.state.generated == true) return(<this.GeneratedLink/>);
    if (this.state.error == true) return(<this.GenerateError/>);
    return (<this.GenerateForm/>);
  }

  GeneratedLink = () => {
    return(
      <Grid container stackable verticalAlign='middle' textAlign='center'>
        <Grid.Column>
          <Grid.Row centered>
            <Header size='huge' inverted>Here is your new short link!</Header>
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
              Generate a new one
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
        <Grid.Column>
          <Grid.Row centered>
            <Header size='huge' inverted>Get your free short link</Header>
          </Grid.Row>
          <Grid.Row centered>
            <Dimmer active={this.state.loading}>
              <Loader size='large'>Creating link...</Loader>
            </Dimmer>
            <Form size='massive'>
              <Form.Field>
                <Form.Input
                  inverted
                  action={{color: 'blue', content: 'Shorten', size: 'massive', onClick: () => this.createLink()}}
                  placeholder='Shorten your link'
                  value={this.state.longUrl}
                  onChange={(v) => this.setState({longUrl: v.target.value})}
                />
              </Form.Field>
            </Form>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }

  GenerateError = () => {
    return(
      <Grid container stackable verticalAlign='middle' textAlign='center'>
        <Grid.Column>
          <Grid.Row centered>
            <Message warning>
              <Message.Header>Sorry, something went wrong</Message.Header>
              <p>{(!!this.state.errorMessage)?(this.state.errorMessage):('Please try again...')}</p>
              <Button color='yellow' onClick={() => this.setState({error: false})}>Try again</Button>
            </Message>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }

  render() {
    const { children } = this.props;
    const { fixed } = this.state;

    return(
      <ResponsiveContainer>
        <Segment inverted style={{ backgroundColor: '#0d052d', padding: '3em 0em'}} vertical id={'link'}>
          <this.Renderer/>
        </Segment>
        <Segment style={{ padding: '0em' }} vertical>
          <Grid celled='internally' columns='equal' stackable>
            <Grid.Row textAlign='center'>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  What does <i>ovni</i> mean?
                </Header>
                <p style={{ fontSize: '1.33em' }}><i>Objeto Volador No Identificado</i> or <a href='https://en.wiktionary.org/wiki/OVNI' target='_blank'>spanish for UFO</a></p>
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
                  Powerful, short links
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  Create free, permanent short links to share everywhere
                </p>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  Harness the power of analytics
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  Upgrade to access the full power of our analytics, track clicks and engagement in your links
                </p>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  Engage with your brand
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  Upgrade to create custom short links with any extension you want
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment inverted vertical style={{ padding: '5em 0em' }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={4}>
                  <Header inverted as='h4' content='About' />
                  <List link inverted>
                    <List.Item as='a'>About Us</List.Item>
                    <List.Item as='a'>Contact Us</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Header inverted as='h4' content='Legal' />
                  <List link inverted>
                    <List.Item as='a'>Terms</List.Item>
                    <List.Item as='a'>Privacy</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Header inverted as='h4' content='Credits' />
                  <p>Created by <a href='https://herce.co' target='_blank'>Alex Herce</a></p>
                  <p>Images made by <a href="https://www.flaticon.com/authors/eucalyp" target='_blank'>Eucalyp</a> & <a href="https://www.freepik.com/" target='_blank'>Freepik</a></p>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Header as='h4' inverted>
                    © 2019 ovn.is
                  </Header>
                  <p>Made with ❤️ in Mexico City</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </ResponsiveContainer>
    );
  }
}

export default Main;
