module.exports = function(React, desc) {
	desc.render = function() {
		var Component = this.state.component;
		if(Component) {
			return React.createElement(Component, this.props, this.props.children);
		} else if(this.renderUnavailable) {
			return this.renderUnavailable();
		} else {
			return null;
		}
	};
  desc.componentWillUnmount = function() {
    this.isUnmounted = true;
  }
	desc._getInitialState = function() {
		return { component: this.loadComponent() };
	};
	desc.componentDidMount = function() {
		if(!this.state.component) {
			this.loadComponent(function(component) {
				if(!this.isUnmounted) {
					this.setState({ component: component });
				}
			}.bind(this));
		}
	};
};
