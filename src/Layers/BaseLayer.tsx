import * as React from "react";

export class BaseLayer extends React.Component {
  authUser = true; // hardcoded for now
  render() {
    if (!this.authUser) {
      return false; // there will be loading page
    }
    return this.props.children;
  }
}
