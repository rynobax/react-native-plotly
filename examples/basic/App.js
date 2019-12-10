import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import Plotly from 'react-native-plotly';

const upTrace = {
  __id: 'up',
  x: [1, 2, 3, 4, 5],
  y: [1, 2, 3, 4, 8],
  type: 'scatter',
};

const downTrace = {
  __id: 'down',
  x: [1, 2, 3, 4, 5],
  y: [8, 4, 3, 2, 1],
  type: 'scatter',
};

const App = () => {
  const [trace, setTrace] = useState(upTrace);

  function swapData() {
    if (trace.__id === 'up') {
      setTrace(downTrace);
    } else {
      setTrace(upTrace);
    }
  }

  const update = (_, { data, layout, config }, plotly) => {
    plotly.react(data, layout, config);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button onPress={swapData} title="Swap Data" />
      </View>
      <View style={styles.chartRow}>
        <Plotly
          data={[trace]}
          layout={{ title: 'Plotly.js running in React Native!' }}
          update={update}
          onLoad={() => console.log('loaded')}
          debug
        />
      </View>
    </View>
  );
};

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

export default App;
