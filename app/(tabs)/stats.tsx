import React, { useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import { useTimer } from '../../context/TimerContext';
import { Colors } from '../../constants/Colors';
import { startOfDay, subDays, format, isSameDay, eachDayOfInterval } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const { sessions } = useTimer();

  // Calculate Streak
  const streak = useMemo(() => {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let checkDate = startOfDay(new Date());
    
    // Check if we have a session today
    const hasSessionToday = sortedSessions.some(s => isSameDay(new Date(s.date), checkDate));
    if (!hasSessionToday) {
        // If no session today, check yesterday to see if streak is still valid (or if it's 0)
        // Actually, usually streak includes today if done, or continues from yesterday.
        // If I haven't done it today, my streak is technically what it was yesterday, 
        // but if I missed yesterday, it's 0. 
        // Let's assume strict streak: contiguous days ending today or yesterday.
        checkDate = subDays(checkDate, 1);
        const hasSessionYesterday = sortedSessions.some(s => isSameDay(new Date(s.date), checkDate));
        if (!hasSessionYesterday) return 0;
    }

    // Iterate backwards
    // We already established start point.
    // If today has session, count = 1, check yesterday.
    // If today no session, but yesterday yes, count = 1, check day before yesterday.
    
    // Simplified logic: get unique days with sessions
    const uniqueDays = Array.from(new Set(sortedSessions.map(s => format(new Date(s.date), 'yyyy-MM-dd'))));
    // Check consecutive days
    let count = 0;
    let today = new Date();
    
    // Check if the most recent session was today or yesterday
    if (uniqueDays.length === 0) return 0;
    const lastSessionDay = uniqueDays[0]; // sorted desc, so first is latest
    const isToday = isSameDay(new Date(lastSessionDay), today);
    const isYesterday = isSameDay(new Date(lastSessionDay), subDays(today, 1));
    
    if (!isToday && !isYesterday) return 0;

    // Now count backwards
    let expectedDay = new Date(lastSessionDay);
    for (let i = 0; i < uniqueDays.length; i++) {
        if (isSameDay(new Date(uniqueDays[i]), expectedDay)) {
            count++;
            expectedDay = subDays(expectedDay, 1);
        } else {
            break;
        }
    }
    return count;
  }, [sessions]);

  // Weekly Stats
  const weeklyData = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 6); // Last 7 days including today
    const days = eachDayOfInterval({ start, end });

    const labels = days.map(d => format(d, 'EEE')); // Mon, Tue...
    const data = days.map(day => {
        const daySessions = sessions.filter(s => 
            s.mode === 'focus' && isSameDay(new Date(s.date), day)
        );
        const totalMinutes = daySessions.reduce((acc, curr) => acc + curr.duration, 0) / 60;
        return totalMinutes;
    });

    return {
        labels,
        datasets: [{ data }]
    };
  }, [sessions]);

  const totalFocusToday = useMemo(() => {
      const today = new Date();
      return sessions
        .filter(s => s.mode === 'focus' && isSameDay(new Date(s.date), today))
        .reduce((acc, s) => acc + s.duration, 0);
  }, [sessions]);

  const totalFocusWeek = useMemo(() => {
    // Total for the displayed chart (last 7 days)
    return weeklyData.datasets[0].data.reduce((acc, curr) => acc + curr, 0) * 60; // back to seconds
  }, [weeklyData]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Analytics</Text>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Current Streak</Text>
            <Text style={styles.streakText}>{streak} <Text style={styles.daysText}>Days</Text></Text>
        </View>

        <View style={styles.row}>
            <View style={[styles.card, styles.halfCard]}>
                <Text style={styles.cardTitle}>Today</Text>
                <Text style={styles.statValue}>{Math.floor(totalFocusToday / 60)} <Text style={styles.unitText}>min</Text></Text>
            </View>
            <View style={[styles.card, styles.halfCard]}>
                <Text style={styles.cardTitle}>This Week</Text>
                <Text style={styles.statValue}>{Math.floor(totalFocusWeek / 60)} <Text style={styles.unitText}>min</Text></Text>
            </View>
        </View>

        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Focus History (Last 7 Days)</Text>
            <BarChart
                data={weeklyData}
                width={screenWidth - 40}
                height={220}
                yAxisLabel=""
                yAxisSuffix="m"
                chartConfig={{
                    backgroundColor: Colors.surface,
                    backgroundGradientFrom: Colors.surface,
                    backgroundGradientTo: Colors.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`, // Primary color
                    labelColor: (opacity = 1) => Colors.textSecondary,
                    style: {
                        borderRadius: 16
                    },
                    barPercentage: 0.7,
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                showValuesOnTopOfBars
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  streakText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  daysText: {
    fontSize: 18,
    fontWeight: 'normal',
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCard: {
    width: '48%',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  unitText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: Colors.textSecondary,
  },
  chartContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  }
});
