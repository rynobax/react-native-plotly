import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import Plotly from 'react-native-plotly';

const upData = {
  __id: 'up',
  x: [1, 2, 3, 4, 5],
  y: [1, 2, 3, 4, 8],
  type: 'scatter',
};

const downData = {
  __id: 'down',
  x: [1, 2, 3, 4, 5],
  y: [8, 4, 3, 2, 1],
  type: 'scatter',
};

export default class App extends React.Component {
  state = {
    data: [upData],
    layout: { title: 'Plotly.js running in React Native!' },
  };

  swapData = () => {
    if (this.state.data[0].__id === 'up') {
      this.setState({ data: [downData] });
    } else {
      this.setState({ data: [upData] });
    }
  };

  update = (_, { data, layout, config }, plotly) => {
    plotly.react(data, layout, config);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <Button onPress={this.swapData} title="Swap Data" />
        </View>
        <View style={styles.chartRow}>
          <Plotly
            data={this.state.data}
            layout={this.state.layout}
            update={this.update}
            onLoad={() => console.log('loaded')}
            debug
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
  },
  chartRow: {
    flex: 1,
    width: '100%',
  },
  container: {
    paddingTop: 30,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
