import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import UdaciFitnessCalendar from 'udacifitness-calendar';
import { AppLoading } from 'expo'; 
import { addEntry, receiveEntries } from '../actions';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { fetchCalendarResults } from '../utils/api';
import { white } from '../utils/colors';
import DateHeader from './DateHeader';
import MetricCard from './MetricCard';

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16: 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
});

class History extends Component {
  state = { ready: false }
  componentDidMount() {
    const { dispatch } = this.props;
    const currentDate = timeToString();
    fetchCalendarResults()
      .then(entries => dispatch(receiveEntries(entries)))
      .then((res) => {
        const { entries } = res;
        if (!entries[currentDate]) {
          dispatch(addEntry({
            [currentDate]: getDailyReminderValue(),
          }));
        }
      }).then(() => {
        this.setState({ ready: true });
      });
  }
  renderItem = ({ today, ...metrics }, formattedDate, key) => (
    <View style={styles.item}>
      {today
        ? <View>
            <DateHeader>{formattedDate}</DateHeader>
            <Text style={styles.noDateData}>
              {today}
            </Text>
          </View>
        : <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate(
                'EntryDetail',
                { entryId: key }
              )
            }}
          >
            <MetricCard date={formattedDate} metrics={metrics} />
          </TouchableOpacity>
      }
    </View>
  )
  renderEmptyDate = (formattedDate) => (
    <View>
      <DateHeader>{formattedDate}</DateHeader>
      <Text style={styles.noDateData}>You didn't log any data on this date.</Text>
    </View>
  )
  render() {
    const { entries } = this.props;
    const { ready } = this.state;
    if (!ready) {
      return <AppLoading />;
    }
    return (
      <UdaciFitnessCalendar
        items={entries}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
      />
    );
  }
}

const mapStateToProps = state => ({
  entries: state.entries,
});

export default connect(mapStateToProps)(History);
