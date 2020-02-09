# Unreleased

- Nothing yet

# 4.0.0

- Rename invalid zIndex css property
- [BREAKING] Switch from buggy diffing algorithm to Plotly.react

# 3.0.0

- [BREAKING] Change the way iOS detects that the webview is loaded. It should be better (previously it just used setTimeout)
- Refactor to function component + hooks
- Fix enableFullPlotly not being implemented

# 2.0.0

- [BREAKING] Update plotly to v1.50.1
- [BREAKING] Update to use react-native-web (instead of deprecated WebView from react-native package)

# 1.0.0

- [BREAKING] Updated default style of the webview from `{ width: '100%', height: '100%' }` to `{ flex: 1 }`
- Added style prop to override the default style
- Added onLoad prop
- Added enableFullPlotly prop
