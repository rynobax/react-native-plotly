import * as tslib_1 from 'tslib';
import * as React from 'react';
import { StyleSheet, WebView, Platform } from 'react-native';
import PlotlyLib from './lib/PlotlyBasic';
import { getDiff } from './diff';
/*
Base 64 encode source code
Postmessage source code into webview
Webview decodes and evals
Plotly is now in the window!
*/
var IOS_PLOTLY_LOAD_TIME = 1000;
var errorHandlerFn =
  "\n  window.onerror = function(message, source, lineno, colno, error) {\n    document.getElementById('error').innerHTML += message + '\\n';\n  };\n";
var postMessageHandler =
  "\n  document.addEventListener(\n    'message',\n    function(event) {\n      const decoded = atob(event.data);\n      eval(decoded);\n    },\n    false\n  );\n";
var debugFn =
  "\n  window.DEBUG = function(message) {\n    document.getElementById('debug').innerHTML += message + '\\n';\n  };\n";
var Plotly = /** @class */ (function(_super) {
  tslib_1.__extends(Plotly, _super);
  function Plotly() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.chart = React.createRef();
    _this.html =
      '\n  <html>\n  <head>\n      <meta charset="utf-8">\n      <meta http-equiv="Content-type" content="text/html; charset=utf-8">\n      <meta name="viewport" content="width=device-width, initial-scale=1">\n      <style type="text/css">\n      body {\n        margin: 0;\n        padding: 0;\n        width: 100vw;\n        height: 100vh;\n      }\n      #chart {\n        width: 100vw;\n        height: 100vh;\n        ' +
      (_this.props.debug ? 'background: papayawhip;' : '') +
      '\n      }\n      #error {\n        position: fixed;\n        top: 10vh;\n        max-width: 100vw;\n        max-height: 40vh;\n        overflow-y: scroll;\n        background: pink;\n        white-space: pre-wrap;\n      }\n      #debug {\n        position: fixed;\n        top: 50vh;\n        max-width: 100vw;\n        max-height: 40vh;\n        overflow-y: scroll;\n        background: #eaeaea;\n        white-space: pre-wrap;\n        zIndex: 1000;\n      }\n      </style>\n  </head>\n  \n  <body >\n    <div id="chart"></div>\n    <pre id="error"></pre>\n    <pre id="debug"></pre>\n  </body>\n\n  <script>\n    /* This only runs on iOS, on android it is posted */\n    ' +
      errorHandlerFn +
      '\n    ' +
      debugFn +
      '\n    ' +
      postMessageHandler +
      '\n  </script>\n  </html>\n  ';
    _this.debug = function(msg) {
      _this.invoke(
        "document.getElementById('debug').innerHTML += `" + msg + "` + '\\n';"
      );
    };
    _this.invoke = function(str) {
      if (_this.chart && _this.chart.current)
        _this.chart.current.injectJavaScript('(function(){' + str + '})()');
    };
    _this.invokeEncoded = function(str) {
      if (_this.chart && _this.chart.current)
        _this.chart.current.postMessage(str);
    };
    _this.initialPlot = function(data, layout, config) {
      _this.invoke(
        "\n      window.Plotly.newPlot(\n        'chart',\n        " +
          JSON.stringify(data) +
          ',\n        ' +
          JSON.stringify(layout) +
          ',\n        ' +
          JSON.stringify(config) +
          '\n      );\n    '
      );
    };
    _this.plotlyReact = function(data, layout, config) {
      _this.invoke(
        "\n      window.Plotly.react(\n        'chart',\n        " +
          JSON.stringify(data) +
          ',\n        ' +
          JSON.stringify(layout) +
          ',\n        ' +
          JSON.stringify(config) +
          '\n      );\n    '
      );
    };
    _this.plotlyRelayout = function(layout) {
      _this.invoke(
        "\n      window.Plotly.relayout(\n        'chart',\n        " +
          JSON.stringify(layout) +
          '\n      );\n    '
      );
    };
    _this.plotlyRestyle = function(data, i) {
      _this.invoke(
        "\n      window.Plotly.restyle(\n        'chart',\n        " +
          JSON.stringify(data) +
          ',\n        ' +
          i +
          '\n      );\n    '
      );
    };
    _this.webviewLoaded = function() {
      if (Platform.OS === 'android') {
        // On iOS these are included a <script> tag
        _this.invoke(errorHandlerFn);
        _this.invoke(postMessageHandler);
        if (_this.props.debug) {
          _this.invoke(debugFn);
        }
      }
      // Load plotly
      _this.invokeEncoded(PlotlyLib);
      var _a = _this.props,
        data = _a.data,
        config = _a.config,
        layout = _a.layout;
      _this.initialPlot(data, layout, config);
    };
    return _this;
  }
  Plotly.prototype.componentDidMount = function() {
    if (Platform.OS === 'ios')
      setTimeout(this.webviewLoaded, IOS_PLOTLY_LOAD_TIME);
  };
  Plotly.prototype.shouldComponentUpdate = function(nextProps) {
    var _this = this;
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
      var dataDiff = getDiff(this.props.data, nextProps.data);
      if (Array.isArray(dataDiff)) {
        dataDiff.forEach(function(d, i) {
          if (d) _this.plotlyRestyle(d, i);
        });
      }
      var layoutDiff = getDiff(this.props.layout, nextProps.layout);
      if (layoutDiff) this.plotlyRelayout(layoutDiff);
    }
    return false;
  };
  Plotly.prototype.render = function() {
    return (
      <WebView
        ref={this.chart}
        source={{ html: this.html }}
        style={styles.container}
        onLoad={this.webviewLoaded}
      />
    );
  };
  return Plotly;
})(React.Component);
var styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
export default Plotly;
//# sourceMappingURL=index.js.map
