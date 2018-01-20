/*global FHIR*/

import React, { Component } from 'react';
import LoadingSpinner from './LoadingSpinner.js';

class SmartRead extends Component {
    
  constructor(props) {
    super(props);
    this.updateResults = this.updateResults.bind(this);
    this.state = {
      ready: false,
      api: false,
      resource: false,
    }
  }
  
  componentWillMount() {
    const self = this;
    FHIR.oauth2.ready(function(smart) {
      console.log("Oauth ready");
      console.log(smart);
      console.log(self);
      self.setState({ ready: true, api: smart.api });
      self.handleQuery(self.props);
    });
  }
  
  componentWillUpdate(nextProps, nextState) {
    console.log("componentWillUpdate");
    if(this.props.query !== nextProps.query) {
      this.setState({ ready: false });  
      this.handleQuery(nextProps);
    }
  }
  
  updateResults(results) {
    console.log("updateResults");
    console.log(results);
    const resource = results.data ? results.data : false;
    this.setState({ resource: resource, ready: true });
  }
  
  handleQuery(props) {
    console.log("handleQuery");
    const query = props.query;
    console.log(this.state);
    if(query) {
        this.state.api.read(query).done(this.updateResults);
    }
    else {
      this.setState({
        ready: true
      })
    }
  }
  
  render() {
    console.log('smart read');
    if(this.state.ready && this.state.resource) {
      return (
        <div>{React.cloneElement(this.props.children, { resource: this.state.resource })}</div>
      );
    }
    else {
      return <LoadingSpinner />
    }
  }
}

export default SmartRead;