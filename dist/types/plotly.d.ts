import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
declare type Data = any;
declare type Layout = any;
declare type Config = any;
declare type UpdateProps = {
    data: Data[];
    layout: Layout | undefined;
    config: Config | undefined;
};
declare type UpdateFunctions = {
    react: (data: Data[], layout?: Layout, config?: Config) => void;
    relayout: (layout: Layout) => void;
    restyle: (data: Data, index: number) => void;
};
export interface PlotlyProps {
    data: Data[];
    layout?: Layout;
    config?: Config;
    update?: (currentProps: UpdateProps, nextProps: UpdateProps, updateFns: UpdateFunctions) => void;
    debug?: boolean;
    style?: StyleProp<ViewStyle>;
    onLoad?: () => void;
}
declare class Plotly extends React.Component<PlotlyProps> {
    chart: React.RefObject<WebView>;
    webviewHasLoaded: boolean;
    plotlyHasLoaded: boolean;
    html: string;
    debug: (msg: string) => void;
    invoke: (str: string) => void;
    invokeEncoded: (str: string) => void;
    initialPlot: (data: any[], layout?: any, config?: any) => void;
    plotlyReact: (data: any[], layout?: any, config?: any) => void;
    plotlyRelayout: (layout: any) => void;
    plotlyRestyle: (data: any, i: number) => void;
    webviewLoaded: () => void;
    onMessage: (event: import("react-native").NativeSyntheticEvent<import("react-native-webview/lib/WebViewTypes").WebViewMessage>) => void;
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: PlotlyProps): boolean;
    render(): JSX.Element;
}
export default Plotly;
