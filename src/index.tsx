import * as React from 'react';
import { StyleSheet, WebView, Platform } from 'react-native';
import { Data, Layout, Config } from 'plotly.js';

import PlotlyLib from './lib/PlotlyBasic';

/*
Base 64 encode source code
Postmessage source code into webview
Webview decodes and evals
Plotly is now in the window!
*/

const errorHandlerFn = `
  window.onerror = function(message, source, lineno, colno, error) {
    document.getElementById('error').innerHTML += message + '\\n';
  };
`;

const postMessageHandler = `
  document.addEventListener(
    'message',
    function(event) {
      const decoded = atob(event.data);
      eval(decoded);
    },
    false
  );
`;

const debugFn = `
  window.DEBUG = function(message) {
    document.getElementById('debug').innerHTML += message + '\\n';
  };
`;

export interface PlotlyProps {
  data: Data[];
  layout?: Layout;
  config?: Config;
  debug?: Boolean;
}

class Plotly extends React.Component<PlotlyProps> {
  chart = React.createRef<WebView>();

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
      #chart {
        width: 100vw;
        height: 100vh;
        ${this.props.debug ? 'background: papayawhip;' : ''}
      }
      #error {
        position: fixed;
        top: 10vh;
        max-width: 100vw;
        max-height: 40vh;
        overflow-y: scroll;
        background: pink;
        white-space: pre-wrap;
      }
      #debug {
        position: fixed;
        top: 50vh;
        max-width: 100vw;
        max-height: 40vh;
        overflow-y: scroll;
        background: #eaeaea;
        white-space: pre-wrap;
        zIndex: 1000;
      }
      </style>
  </head>
  
  <body >
    <div id="chart"></div>
    <pre id="error"></pre>
    <pre id="debug"></pre>
  </body>

  <script>
    /* This only runs on iOS, on android it is posted */
    ${errorHandlerFn}
    ${debugFn}
    ${postMessageHandler}
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
    if (this.chart && this.chart.current) this.chart.current.postMessage(str);
  };

  initialPlot = (data: Data[], layout?: Layout, config?: Config) => {
    this.invoke(`
      window.Plotly.newPlot(
        'chart',
        ${JSON.stringify(data)},
        ${JSON.stringify(layout)},
        ${JSON.stringify(config)}
      );
    `);
  };

  updatePlot = (data: Data[], layout?: Layout, config?: Config) => {
    this.invoke(`
      window.Plotly.react(
        'chart',
        ${JSON.stringify(data)},
        ${JSON.stringify(layout)},
        ${JSON.stringify(config)}
      );
    `);
  };

  webviewLoaded = () => {
    if (Platform.OS === 'android') {
      // On iOS these are included a <script> tag
      this.invoke(errorHandlerFn);
      this.invoke(postMessageHandler);
      if (this.props.debug) {
        this.invoke(debugFn);
      }
    }

    // Load plotly
    this.invokeEncoded(PlotlyLib);

    const { data, config, layout } = this.props;
    this.initialPlot(data, layout, config);
  };

  componentDidMount() {
    if (Platform.OS === 'ios') setTimeout(this.webviewLoaded, 1000);
  }

  shouldComponentUpdate(nextProps: PlotlyProps) {
    const { data, config, layout } = nextProps;
    this.updatePlot(data, layout, config);
    return false;
  }

  render() {
    return (
      <WebView
        ref={this.chart}
        source={{ html: this.html }}
        style={styles.container}
        onLoad={this.webviewLoaded}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

export default Plotly;
