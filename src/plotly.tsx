import React from 'react';
import { StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import PlotlyBasic from './lib/PlotlyBasic';
import { getDiff } from './diff';

/*
Base 64 encode source code
Postmessage source code into webview
Webview decodes and evals
Plotly is now in the window!
*/

const IOS_PLOTLY_LOAD_TIME = 1000;

const messages = {
  CHART_LOADED: 'CHART_LOADED',
};

const errorHandlerFn = `
  window.onerror = function(message, source, lineno, colno, error) {
    document.getElementById('error').innerHTML += message + '\\n';
  };
`;

const debugFn = `
  window.DEBUG = function(message) {
    document.getElementById('debug').innerHTML += message + '\\n';
  };
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Layout = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Config = any;

type UpdateProps = {
  data: Data[];
  layout: Layout | undefined;
  config: Config | undefined;
};

type UpdateFunctions = {
  react: (data: Data[], layout?: Layout, config?: Config) => void;
  relayout: (layout: Layout) => void;
  restyle: (data: Data, index: number) => void;
};

export interface PlotlyProps {
  data: Data[];
  layout?: Layout;
  config?: Config;

  update?: (
    currentProps: UpdateProps,
    nextProps: UpdateProps,
    updateFns: UpdateFunctions
  ) => void;

  debug?: boolean;

  style?: StyleProp<ViewStyle>;

  onLoad?: () => void;
}

class Plotly extends React.Component<PlotlyProps> {
  chart = React.createRef<WebView>();
  webviewHasLoaded = false;
  plotlyHasLoaded = false;

  // As of 2/5/2019 it seems that using a # in the html causes the css
  // parsing to crash on Android
  html = `
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
        body {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
        }
        .chart {
          width: 100vw;
          height: 100vh;
          ${this.props.debug ? 'background: papayawhip;' : ''}
        }
        .error {
          position: fixed;
          top: 10vh;
          max-width: 100vw;
          max-height: 40vh;
          overflow-y: scroll;
          background: pink;
          white-space: pre-wrap;
        }
        .debug {
          position: fixed;
          top: 50vh;
          max-width: 100vw;
          max-height: 40vh;
          overflow-y: scroll;
          background: rgb(234, 234, 234);
          white-space: pre-wrap;
          zIndex: 1000;
        }
        </style>
    </head>
    
    <body >
      <div id="chart" class="chart"></div>
      <pre id="error" class="error"></pre>
      <pre id="debug" class="debug"></pre>
    </body>
    <script>
      /* This only runs on iOS, on android it is posted */
      ${errorHandlerFn}
      ${debugFn}
    </script>
    </html>
    `;

  debug = (msg: string) => {
    this.invoke(
      `document.getElementById('debug').innerHTML += \`${msg}\` + '\\n';`
    );
  };

  invoke = (str: string) => {
    if (this.chart && this.chart.current)
      this.chart.current.injectJavaScript(`(function(){${str}})()`);
  };

  invokeEncoded = (str: string) => {
    this.invoke(`eval(atob("${str}"));`);
  };

  initialPlot = (data: Data[], layout?: Layout, config?: Config) => {
    this.invoke(`
        window.Plotly.newPlot(
          'chart',
          ${JSON.stringify(data)},
          ${JSON.stringify(layout)},
          ${JSON.stringify(config)}
        ).then(function() {
          window.ReactNativeWebView.postMessage('${messages.CHART_LOADED}');
        });
      `);
  };

  plotlyReact = (data: Data[], layout?: Layout, config?: Config) => {
    this.invoke(`
        window.Plotly.react(
          'chart',
          ${JSON.stringify(data)},
          ${JSON.stringify(layout)},
          ${JSON.stringify(config)}
        );
      `);
  };

  plotlyRelayout = (layout: Layout) => {
    this.invoke(`
        window.Plotly.relayout(
          'chart',
          ${JSON.stringify(layout)}
        );
      `);
  };

  plotlyRestyle = (data: Data, i: number) => {
    this.invoke(`
        window.Plotly.restyle(
          'chart',
          ${JSON.stringify(data)},
          ${i}
        );
      `);
  };

  webviewLoaded = () => {
    // Prevent double load
    if (this.webviewHasLoaded) return;
    this.webviewHasLoaded = true;

    if (Platform.OS === 'android') {
      // On iOS these are included in a <script> tag
      this.invoke(errorHandlerFn);
      if (this.props.debug) {
        this.invoke(debugFn);
      }
    }

    // Load plotly
    this.invokeEncoded(PlotlyBasic);

    const { data, config, layout } = this.props;
    this.initialPlot(data, layout, config);
  };

  onMessage = (event: WebViewMessageEvent) => {
    // event type is messed up :(
    switch ((event as any).nativeEvent.data) {
      case messages.CHART_LOADED:
        if (this.props.onLoad) this.props.onLoad();
        break;
      default:
        if (this.debug)
          console.error(`Unknown event ${(event as any).nativeEvent.data}`);
        break;
    }
  };

  componentDidMount() {
    // TODO: Test on iOS device to see if this is still necessary
    if (Platform.OS === 'ios')
      setTimeout(this.webviewLoaded, IOS_PLOTLY_LOAD_TIME);
  }

  shouldComponentUpdate(nextProps: PlotlyProps) {
    if (this.props.update) {
      // Let the user call the update functions
      this.props.update(
        {
          data: this.props.data,
          layout: this.props.layout,
          config: this.props.config,
        },
        {
          data: nextProps.data,
          layout: nextProps.layout,
          config: nextProps.config,
        },
        {
          react: this.plotlyReact,
          relayout: this.plotlyRelayout,
          restyle: this.plotlyRestyle,
        }
      );
    } else {
      // Default, just use Plotly.react
      const dataDiff = getDiff(this.props.data, nextProps.data);
      if (Array.isArray(dataDiff)) {
        dataDiff.forEach((d, i) => {
          if (d) this.plotlyRestyle(d, i);
        });
      }
      const layoutDiff = getDiff(this.props.layout, nextProps.layout);
      if (layoutDiff) this.plotlyRelayout(layoutDiff);
    }
    return false;
  }

  render() {
    return (
      <WebView
        ref={this.chart}
        source={{ html: this.html }}
        style={this.props.style || styles.container}
        onLoad={this.webviewLoaded}
        onMessage={this.onMessage}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Plotly;
