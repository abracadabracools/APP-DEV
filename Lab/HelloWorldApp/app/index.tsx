
import React, { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";


const TIMER_CONFIGS = [
  { name: 'Warm Up', duration: 60 },
  { name: 'Work Out', duration: 120 },
  { name: 'Cool Down', duration: 60 },
];

function useSingleTimer(duration: number, isActive: boolean, onFinish: () => void) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<any>(null);

  // Start/stop effect
  React.useEffect(() => {
    if (isActive && isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= duration) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);
            onFinish();
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setElapsed(0);
    setIsRunning(false);
  };

  return { elapsed, isRunning, start, stop, reset };
}

export default function Home() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const timers = TIMER_CONFIGS.map((cfg, idx) =>
    useSingleTimer(
      cfg.duration,
      activeIdx === idx,
      () => setActiveIdx(idx < TIMER_CONFIGS.length - 1 ? idx + 1 : null)
    )
  );

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Run Timer</Text>
      {TIMER_CONFIGS.map((cfg, idx) => (
        <View key={cfg.name} style={styles.timerBox}>
          <Text style={styles.stage}>{cfg.name}</Text>
          <Text style={styles.timer}>{formatTime(cfg.duration - timers[idx].elapsed)}</Text>
          <View style={styles.buttonRow}>
            <Button
              title={timers[idx].isRunning ? 'Stop' : 'Start'}
              onPress={() => {
                if (timers[idx].isRunning) {
                  timers[idx].stop();
                  setActiveIdx(null);
                } else {
                  setActiveIdx(idx);
                  timers[idx].start();
                }
              }}
              disabled={activeIdx !== null && activeIdx !== idx}
            />
            <View style={{ width: 16 }} />
            <Button title="Reset" onPress={timers[idx].reset} disabled={timers[idx].elapsed === 0} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  timerBox: {
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 16,
    width: 260,
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  stage: {
    fontSize: 24,
    marginBottom: 8,
    color: '#666',
  },
  timer: {
    fontSize: 48,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
