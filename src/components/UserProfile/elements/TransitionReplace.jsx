import React from 'react';
import PropTypes from 'prop-types';
import { Transition, TransitionGroup } from 'react-transition-group';

class TransitionReplace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: null,
    };

    this.onChildEnter = this.onChildEnter.bind(this);
    this.onChildEntering = this.onChildEntering.bind(this);
    this.onChildEntered = this.onChildEntered.bind(this);
    this.onChildExit = this.onChildExit.bind(this);
    this.onChildExited = this.onChildExited.bind(this);
  }

  // Transition events are fired in this order:
  //
  // onEnter > onEntering > onEntered
  // onExit  > onExiting  > onExited
  //
  // Keep in mind that we always have two transitions happening
  // both the entering and leaving children
  //
  // We set the container height (for animation) in this order:
  //
  // 1. onChildExit         (explicitly set the height to match the current current)
  // 2. onChildEntering     (set the height to match the new content)
  // 3. onChildExited       (reset the height to null)

  onChildEnter(htmlNode) {
    if (this.props.onChildEnter) this.props.onChildEnter(htmlNode);
  }

  onChildEntering(htmlNode) {
    // subtract 1 from the height to improve shifts at the end of the animation
    this.setState({
      height: htmlNode.offsetHeight - 1,
    });
  }

  onChildEntered(htmlNode) {
    if (this.props.onChildEntered) this.props.onChildEntered(htmlNode);
  }

  onChildExit(htmlNode) {
    // subtract 1 from the height to improve shifts at the end of the animation
    this.setState({
      height: htmlNode.offsetHeight - 1,
    });

    if (this.props.onChildExit) this.props.onChildExit(htmlNode);
  }

  onChildExited(htmlNode) {
    this.setState({
      height: null,
    });

    if (this.props.onChildExited) this.props.onChildExited(htmlNode);
  }

  render() {
    const {
      enterDuration,
      exitDuration,
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
        transition: `opacity ${enterDuration}ms ${enterFadeEaseFunction}`,
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
        transition: `opacity ${exitDuration}ms ${exitFadeEaseFunction}`,
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
      timeout: {
        enter: enterDuration,
        exit: exitDuration,
      },
      unmountOnExit: true,
      mountOnEnter: true,
      onEnter: this.onChildEnter,
      onEntering: this.onChildEntering,
      onEntered: this.onChildEntered,
      onExit: this.onChildExit,
      onExited: this.onChildExited,
    };

    return (
      <TransitionGroup
        style={{
          position: 'relative',
          overflow: this.state.height === null ? null : 'hidden',
          height: this.state.height, // prevent rounding shifts from being too noticeable
          transition: `height ${enterDuration}ms ${heightChangeEaseFunction}`,
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
  enterDuration: PropTypes.number,
  exitDuration: PropTypes.number,
  enterFadeEaseFunction: PropTypes.string,
  exitFadeEaseFunction: PropTypes.string,
  heightChangeEaseFunction: PropTypes.string,
  className: PropTypes.string,
  onChildEnter: PropTypes.func,
  onChildEntered: PropTypes.func,
  onChildExit: PropTypes.func,
  onChildExited: PropTypes.func,
};

TransitionReplace.defaultProps = {
  enterDuration: 300,
  exitDuration: 300,
  enterFadeEaseFunction: 'linear',
  exitFadeEaseFunction: 'linear',
  heightChangeEaseFunction: 'ease-in-out',
  className: null,
  onChildEnter: null,
  onChildEntered: null,
  onChildExit: null,
  onChildExited: null,
};
