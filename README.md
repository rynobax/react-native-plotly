## react-native-plotly

Use [plotly.js](https://plot.ly/javascript/) in react native!
(plotly.js basic v1.43.2)

## Installation

`$ npm install react-plotly.js plotly.js`

## How

Under the hood, `react-native-plotly` is just a webview that has `plotly.js` injected into it. The `plotly.js` code is stored on the device, so it will work offline. `react-native-plotly` also provides methods for calling into the webview with updates to the chart data and layout.

## Limitations

- The `plotly.js` code is loaded into the webview using `postMessage`. This adds some latency between when the component is initially rendered, and when you first see the chart (usually 1-3 seconds).
- Right now, this libarary only supports the [basic bundle](https://github.com/plotly/plotly.js/blob/master/dist/README.md#plotlyjs-basic) of plotly.

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
      data={this.state.data}
      layout={this.state.layout}
    />
  )
}
```

## Props

| key     | value            | description                                                                 |
| ------- | ---------------- | --------------------------------------------------------------------------- |
| data    | plotly.js Data[] | (required) Data to graph                                                    |
| layout  | plotly.js Layout |                                                                             |
| config? | plotly.js Config |                                                                             |
| debug?  | boolean          | If true, if any errors occur in the webview, they will show up on the chart |
| update? | fn()             | described below                                                             |

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

## TODO

- Better solution for detecting iOS webview being loaded
  - The webView `onLoaded` did not work for iOS, so instead it uses a 1 second setTimeout after the initial mount
- Add the ability to use the full bundle
  - Right now sending the full bundle code to the webview does not work
