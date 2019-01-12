import * as React from 'react';
import { WebView } from 'react-native';
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
    debug?: Boolean;
}
declare class Plotly extends React.Component<PlotlyProps> {
    chart: React.RefObject<WebView>;
    html: string;
    debug: (msg: string) => void;
    invoke: (str: string) => void;
    invokeEncoded: (str: string) => void;
    initialPlot: (data: any[], layout?: any, config?: any) => void;
    plotlyReact: (data: any[], layout?: any, config?: any) => void;
    plotlyRelayout: (layout: any) => void;
    plotlyRestyle: (data: any, i: number) => void;
    webviewLoaded: () => void;
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: PlotlyProps): boolean;
    render(): JSX.Element;
}
export default Plotly;
