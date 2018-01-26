import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableHighlight, Platform, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue,
  setLocalNotification,
  clearLocalNotification,
} from '../utils/helpers';
import { white, purple, lightPurp } from '../utils/colors';
import Stepper from './Stepper';
import Slider from './Slider';
import DateHeader from './DateHeader';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';
import { addEntry } from '../actions';

const SubmitBtn = ({ onPress, alreadyLogged }) => (
  <TouchableHighlight
    onPress={onPress}
    underlayColor={lightPurp}
    style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
  >
    <Text style={styles.submitBtnText}>Submit</Text>
  </TouchableHighlight>
);

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }
  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);
    const count = this.state[metric] + step;
    this.setState({
      [metric]: count > max ? max : count,
    });
  }
  decrement = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);
    const count = this.state[metric] - step;
    this.setState({
      [metric]: count < 0 ? 0 : count,
    });
  }
  slide = (metric, value) => {
    this.setState({
      [metric]: value,
    });
  }
  submit = () => {
    const key = timeToString();
    const entry = this.state;

    // update redux
    this.props.dispatch(addEntry({
      [key]: entry,
    }));

    // reset component state
    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    });

    // navigate to home
    this.toHome();

    // update async storage
    submitEntry({ key, entry });

    // clear local notification
    clearLocalNotification()
      .then(setLocalNotification);
  }
  reset = () => {
    const key = timeToString();

    // update redux
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue(),
    }));

    // route to home
    this.toHome();

    // remove data from async storage
    removeEntry(key);
  }
  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({
      key: 'AddEntry',
    }));
  }
  render() {
    const metaInfo = getMetricMetaInfo();
    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
            size={100}
          />
          <Text>You've already logged your information for today.</Text>
          <TextButton style={{ padding: 10 }} onPress={this.reset}>
            <Text>Reset</Text>
          </TextButton>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {
          Object.keys(metaInfo).map((key) => {
            const { getIcon, type, ...rest } = metaInfo[key];
            const value = this.state[key];
            return (
              <View key={`${key}-entry`} style={styles.row}>
                {getIcon()}
                {
                  type === 'slider'
                    ? <Slider
                        value={value}
                        onChange={(value) => {
                          this.slide(key, value);
                        }}
                        {...rest}
                      />
                    : <Stepper
                        value={value}
                        onIncrement={() => this.increment(key)}
                        onDecrement={() => this.decrement(key)}
                        {...rest}
                      />
                }
              </View>
            );
          })
        }
        <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  const key = timeToString();
  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined',
  };
};

export default connect(mapStateToProps)(AddEntry);
