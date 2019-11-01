import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
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
    enableFullPlotly?: boolean;
}
declare const Plotly: React.FC<PlotlyProps>;
export default Plotly;
