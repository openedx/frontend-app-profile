import React from 'react';
import PropTypes from 'prop-types';
import { Transition, TransitionGroup } from 'react-transition-group';

class TransitionReplace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: null,
    };

    this.onChildExit = this.onChildExit.bind(this);
    this.onChildEntering = this.onChildEntering.bind(this);
    this.onChildrenExited = this.onChildrenExited.bind(this);
  }

  // Note: Transition events are fired in this order:
  // onEnter > onEntering > onEntered
  // onExit  > onExiting  > onExited
  //
  // Keep in mind that we always have two transitions happening
  // The height animation relies on measurements from both the exiting
  // node and the entering node at key moments.

  onChildExit(htmlNode) {
    // subtract 1 from the height to improve shifts at the end of the animation
    this.setState({
      height: htmlNode.offsetHeight - 1,
    });
  }

  onChildEntering(htmlNode) {
    // subtract 1 from the height to improve shifts at the end of the animation
    this.setState({
      height: htmlNode.offsetHeight - 1,
    });
  }

  onChildrenExited() {
    this.setState({
      height: null,
    });
  }

  render() {
    const {
      duration,
      enterFadeEaseFunction,
      exitFadeEaseFunction,
      heightChangeEaseFunction,
    } = this.props;


    // Styles for the Transition

    const defaultStyle = {
      opacity: 0,
      padding: '.1px 0',
      // margin: '-1px 0',
    };

    const transitionStyles = {
      entering: {
        opacity: 1,
        position: 'relative',
        zIndex: 1,
        transition: `opacity ${duration}ms ${enterFadeEaseFunction}`,
      },
      entered: {
        opacity: 1,
        position: 'relative',
        zIndex: 1,
      },
      exiting: {
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        transition: `opacity ${duration}ms ${exitFadeEaseFunction}`,
      },
      exited: {
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      },
    };

    const transitionProps = {
      timeout: duration,
      unmountOnExit: true,
      mountOnEnter: true,
      onExit: this.onChildExit,
      onEntering: this.onChildEntering,
      onExited: this.onChildrenExited,
    };

    return (
      <TransitionGroup
        style={{
          position: 'relative',
          overflow: this.state.height === null ? null : 'hidden',
          height: this.state.height, // prevent rounding shifts from being too noticeable
          transition: `height ${duration}ms ${heightChangeEaseFunction}`,
        }}
        className={this.props.className}
      >
        {React.Children.map(this.props.children, child => (
          <Transition {...transitionProps}>
            {state => (
              <div
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
              >
                {child}
              </div>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    );
  }
}

export default TransitionReplace;


TransitionReplace.propTypes = {
  children: PropTypes.element.isRequired,
  duration: PropTypes.number,
  enterFadeEaseFunction: PropTypes.string,
  exitFadeEaseFunction: PropTypes.string,
  heightChangeEaseFunction: PropTypes.string,
  className: PropTypes.string,
};

TransitionReplace.defaultProps = {
  duration: 300,
  enterFadeEaseFunction: 'linear',
  exitFadeEaseFunction: 'linear',
  heightChangeEaseFunction: 'ease-in-out',
  className: null,
};
