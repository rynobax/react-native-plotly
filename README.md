## react-native-plotly

Use [plotly.js](https://plot.ly/javascript/) in React Native! (plotly.js v1.50.1)

## Installation

`$ npm install react-native-plotly`

## How

Under the hood, `react-native-plotly` is just a webview that has `plotly.js` injected into it. The `plotly.js` code is stored on the device, so it will work offline. `react-native-plotly` also provides methods for calling into the webview with updates to the chart data and layout.

## Limitations

- The `plotly.js` code is loaded into the webview using `injectJavaScript`. This adds some latency between when the component is initially rendered, and when you first see the chart (usually 1-3 seconds).

# Compatability

The latest version of this library depends on react-native-webview (tested with v7.4.3). v1.0.0 of this library and below used the webview from react-native.

## Usage

```js
import Plotly from 'react-native-plotly';

render() {
  const data = {
    x: [1, 2, 3, 4, 5],
    y: [1, 2, 3, 4, 8],
    type: 'scatter',
  };
  const layout = { title: 'My cool chart!' };

  return (
    <Plotly
      data={data}
      layout={layout}
    />
  )
}
```

## Props

| key               | value            | description                                                                                                                                                      |
| ----------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data              | plotly.js Data[] | (required) Chart data                                                                                                                                            |
| layout            | plotly.js Layout | Chart layout                                                                                                                                                     |
| config?           | plotly.js Config | Chart config                                                                                                                                                     |
| style?            | style            | Style to be applied to the WebView (default is { flex: 1 })                                                                                                      |
| onLoad?           | fn()             | Called when the plot loads for the first time                                                                                                                    |
| enableFullPlotly? | boolean          | Setting this to true will load the full plotly bundle instead of the basic bundle. May cause problems and slower load times, particularly on versions of RN < 60 |
| debug?            | boolean          | If true, if any errors occur in the webview, they will show up on the chart                                                                                      |
| update?           | fn()             | described below                                                                                                                                                  |

By default, every time the Plotly component's props change, the `data`, `layout`, and `config` props are all diffed with their previous values, and if there is a difference `restyle` and/or `relayout` are called.
If you want to override this behavior, you can pass a function as the `update` prop, and manually call the plotly update functions. The `update` function signature is:

```ts
function update(
  currentProps: UpdateProps,
  nextProps: UpdateProps,
  updateFns: UpdateFunctions
);

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
```

`currentProps` is the current `data`, `layout`, and `config` props

`nextProps` is the upcoming `data`, `layout`, and `config` props

`updateFns` is an object with three properties: `react`, `relayout` and `restyle`. You can call these functions to update the chart. Details about what these functions do can be found [here](https://plot.ly/javascript/plotlyjs-function-reference/)
