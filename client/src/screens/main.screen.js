import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Container,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar
} from 'semantic-ui-react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Landing from './landing.screen';
import NoMatch from './nomatch.screen';
import NotFound from './notfound.screen';
import Error from './error.screen';

const getWidth = () => {
  const isSSR = typeof window === 'undefined'
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class Footer extends Component {
  render() {
    return(
      <footer>
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
                  <p>Created by <a href='https://herce.co' target='_blank' rel="noopener noreferrer">Alex Herce</a></p>
                  <p>Images made by <a href="https://www.flaticon.com/authors/eucalyp" target='_blank' rel="noopener noreferrer">Eucalyp</a> & <a href="https://www.freepik.com/" target='_blank' rel="noopener noreferrer">Freepik</a></p>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Header as='h4' inverted>
                    © 2019 ovn.is
                  </Header>
                  <p>Made with <span role="img" aria-label="love">❤️</span> in Mexico City</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </footer>
    );
  }
}

class DesktopContainer extends Component {
  render() {
    const { children } = this.props

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth} style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>

        <div style={{flex: 1}}>
          <Menu
            borderless
            secondary={true}
            size='large' >
            <Container>
              <Menu.Item>
                <Image size='small' src='https://storage.googleapis.com/ovnis/assets/logo.png' href='/' />
              </Menu.Item>
              <Menu.Item as='a' position='right' href='/x/about'>About</Menu.Item>
            </Container>
          </Menu>
          {children}
        </div>
        <Footer/>
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
          <Menu.Item as='a' href='/'>Home</Menu.Item>
          <Menu.Item as='a' href='/x/about'>About</Menu.Item>
        </Sidebar>
        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            textAlign='center'
            borderless
            secondary={true}
            style={{ padding: '1em 0em' }} >
            <Container>
              <Menu pointing secondary size='large'>
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name='sidebar' />
                </Menu.Item>
                <Menu.Item>
                  <Image size='tiny' src='https://storage.googleapis.com/ovnis/assets/logo.png' />
                </Menu.Item>
              </Menu>
            </Container>
          </Segment>
          {children}
          <Footer/>
        </Sidebar.Pusher>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
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

    this.state = {};
  }

  render() {
    return(
      <ResponsiveContainer>
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/x/not-found" component={NotFound} />
            <Route exact path="/x/error" component={Error} />
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </ResponsiveContainer>
    );
  }
}

export default Main;
