import React from 'react';
// import uuidv4 from 'uuidv4';

import { newTimer } from './utils/TimerUtils';

import { StyleSheet, View, ScrollView, Text, KeyboardAvoidingView } from 'react-native'; 

import EditableTimer from './components/EditableTimer';
import ToggleableTimerForm from './components/ToggleableTimerForm';

export default class App extends React.Component { 
  state = {
    timers: [ {
      title: 'Hello swiggy', project: 'how are u today!!!',
      elapsed: 11120, isRunning: false,
      },
     
    ],
  }

  componentDidMount() {
    const TIME_INTERVAL = 1000;
    this.intervalId = setInterval(() => { 
      const { timers } = this.state;

      this.setState({
        timers: timers.map(timer => {
          const { elapsed, isRunning } = timer;
          return {
            ...timer,
            elapsed: isRunning ? elapsed + TIME_INTERVAL : elapsed,
          }; 
        }),
      });
    }, TIME_INTERVAL);
  }

  componentWillUnmount() { 
    clearInterval(this.intervalId);
  }

  handleCreateFormSubmit = timer => { 
    const { timers } = this.state;

    this.setState({
      timers: [newTimer(timer), ...timers],
    }); 
  };

  handleFormSubmit = attrs => { 
    const { timers } = this.state;
    this.setState({
      timers: timers.map(timer => {
        if (timer.id === attrs.id) {
          const { title, project } = attrs;
          return { 
            ...timer, 
            title, 
            project,
          }; 
        }
        return timer; 
      }),
    }); 
  };

  handleRemove = timerId => {
    const { timers } = this.state
    this.setState({
      timers: timers.filter(timer => timer.id !== timerId)
    })
  }

  toggleTimer = timerId => { 
    this.setState(prevState => {
      const { timers } = prevState;
      return {
        timers: timers.map(timer => {
        const { id, isRunning } = timer;
        if (id === timerId) { 
          return {
            ...timer,
            isRunning: !isRunning,
          };
        }
        return timer; 
        }),
      }; 
    }); 
  };


  render() {
    const { timers } = this.state

    return (
    <View style={styles.appContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Timers</Text>
      </View>
      <KeyboardAvoidingView
          behavior="padding"
          style={styles.timerListContainer}
      >
        <ScrollView style={styles.timerList}>
          <ToggleableTimerForm 
            isOpen={false} 
            onFormSubmit={this.handleCreateFormSubmit}
          /> 
          { timers.map(({ title, project, id, elapsed, isRunning }) => (
              <EditableTimer
                key={id}
                id={id}
                title={title}
                project={project}
                elapsed={elapsed}
                isRunning={isRunning}
                onFormSubmit={this.handleFormSubmit}
                onRemovePress={this.handleRemove}
                onStartPress={this.toggleTimer} 
                onStopPress={this.toggleTimer}
              />
            ))
          }
        </ScrollView>
      </KeyboardAvoidingView>
    </View> );
    } 
  }

const styles = StyleSheet.create({ 
  appContainer: {
    flex: 1, 
  },
  titleContainer: {
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D7DA',
  }, 
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerList: {
    paddingBottom: 15,
  },
});