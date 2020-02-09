import React, { useRef, useLayoutEffect } from 'react';
import { StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import PlotlyBasic from './lib/PlotlyBasic';
import PlotlyFull from './lib/PlotlyFull';

/*
Base 64 encode source code
Postmessage source code into webview
Webview decodes and evals
Plotly is now in the webview!
*/

const messages = {
  CHART_LOADED: 'CHART_LOADED',
};

const errorHandlerFn = `
  window.onerror = function(message, source, lineno, colno, error) {
    document.getElementById('error').innerHTML += message + '\\n';
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

  enableFullPlotly?: boolean;
}

const Plotly: React.FC<PlotlyProps> = props => {
  const lastPropsRef = useRef<PlotlyProps>(props);
  const chart = useRef<WebView | null>(null);
  const loadedRef = useRef(false);

  // As of 2/5/2019 it seems that using a # in the html causes the css
  // parsing to crash on Android
  const html = `
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
          ${props.debug ? 'background: papayawhip;' : ''}
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
          z-index: 1000;
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
    </script>
    </html>
    `;

  const invoke = (str: string) => {
    if (chart && chart.current)
      chart.current.injectJavaScript(`(function(){${str}})()`);
  };

  const invokeEncoded = (str: string) => {
    invoke(`eval(atob("${str}"));`);
  };

  // Can uncomment and call for debugging purposes
  // const debug = (msg: string) => {
  //   invoke(`document.getElementById('debug').innerHTML += \`${msg}\` + '\\n';`);
  // };

  const initialPlot = (data: Data[], layout?: Layout, config?: Config) => {
    invoke(`
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

  const plotlyReact = (data: Data[], layout?: Layout, config?: Config) => {
    invoke(`
        window.Plotly.react(
          'chart',
          ${JSON.stringify(data)},
          ${JSON.stringify(layout)},
          ${JSON.stringify(config)}
        );
      `);
  };

  const plotlyRelayout = (layout: Layout) => {
    invoke(`
        window.Plotly.relayout(
          'chart',
          ${JSON.stringify(layout)}
        );
      `);
  };

  const plotlyRestyle = (data: Data, i: number) => {
    invoke(`
        window.Plotly.restyle(
          'chart',
          ${JSON.stringify(data)},
          ${i}
        );
      `);
  };

  const webviewLoaded = () => {
    if (Platform.OS === 'android') {
      // On iOS this is included in a <script> tag
      invoke(errorHandlerFn);
    }

    // Load plotly
    invokeEncoded(props.enableFullPlotly ? PlotlyFull : PlotlyBasic);

    const { data, config, layout } = props;
    initialPlot(data, layout, config);

    loadedRef.current = true;
  };

  const onMessage = (event: WebViewMessageEvent) => {
    // event type is messed up :(
    switch ((event as any).nativeEvent.data) {
      case messages.CHART_LOADED:
        if (props.onLoad) props.onLoad();
        break;
      default:
        if (props.debug)
          console.error(`Unknown event ${(event as any).nativeEvent.data}`);
        break;
    }
  };

  useLayoutEffect(() => {
    const lastProps = lastPropsRef.current;
    lastPropsRef.current = props;

    // If we haven't done the initial plot we can't update
    if (!loadedRef.current) return;

    if (props.update) {
      // Let the user call the update functions
      props.update(
        {
          data: lastProps.data,
          layout: lastProps.layout,
          config: lastProps.config,
        },
        {
          data: props.data,
          layout: props.layout,
          config: props.config,
        },
        {
          react: plotlyReact,
          relayout: plotlyRelayout,
          restyle: plotlyRestyle,
        }
      );
    } else {
      // Default, just use Plotly.react
      plotlyReact(props.data, props.layout, props.config);
    }
  });

  return (
    <WebView
      ref={chart}
      source={{ html }}
      style={props.style || styles.container}
      onLoad={webviewLoaded}
      onMessage={onMessage}
      originWhitelist={['*']}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Plotly;
