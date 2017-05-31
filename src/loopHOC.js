import React, { PureComponent } from "react";
import raf from "raf";
import hoistNonReactStatics from "hoist-non-react-statics";

export default (C, refreshRate = 60) => {
  class TL extends PureComponent {
    static displayName = `timeLoop(${C.displayName||C.name||""})`;

    constructor(props) {
      super(props);
      this.state = {
        time: 0,
        tick: 0,
      };
      // this.displayName = `timeLoop(${C.displayName||C.name||""})`;
      this._r;
    }

    componentDidMount() {
      let startTime, lastTime;
      let interval = 1000 / refreshRate;
      lastTime = -interval;
      const loop = (t) => {
        this._r = raf(loop);
        if (!startTime) startTime = t;
        if (t - lastTime > interval) {
          lastTime = t;
          this.setState({
            time: (t - startTime) / 1000,
            tick: this.state.tick + 1,
          });
        }
      };
      this._r = raf(loop);
    }
    componentWillUnmount() {
      raf.cancel(this._r);
    }
    render() {
      return <C
        {...this.props}
        {...this.state}
      />;
    }
  }

  hoistNonReactStatics(TL, C);

  return TL;
};
