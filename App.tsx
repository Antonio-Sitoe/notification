import { useEffect } from "react";
import { Text, View, Button } from "react-native";
import { styles } from "./styles";

import notifee, {
  AndroidImportance,
  EventType,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";

async function displayNotification() {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: "test",
    name: "Sales",
    vibration: true,
    importance: AndroidImportance.HIGH, // nivel de importancia
  });

  await notifee.displayNotification({
    id: "7",
    title: "Ola Tony",
    body: "Essa e minha primeira notificacao 😁",
    android: {
      channelId: channelId,
    },
  });
}
async function scheduleNotification() {
  const date = new Date(Date.now());
  date.setMinutes(date.getMinutes() + 1);

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  };
  const channelId = await notifee.createChannel({
    id: "test",
    name: "Sales",
    vibration: true,
    importance: AndroidImportance.HIGH, // nivel de importancia
  });

  await notifee.createTriggerNotification(
    {
      title: "Notificacao agendada",
      body: "Essa e uma notificacao agendada",
      android: {
        channelId,
      },
    },
    trigger
  );
}

async function listScheduleNotifications() {
  const ids = await notifee.getTriggerNotificationIds();
  console.log("ids", ids);
}
export default function App() {
  useEffect(() => {
    return notifee.onForegroundEvent(({ detail, type }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log("usuario descartou a notificacao");
          break;
        case EventType.PRESS:
          console.log("usuario tocou a notificacao", detail.notification);
          break;
      }
    });
  }, []);
  useEffect(() => {
    return notifee.onBackgroundEvent(async ({ detail, type }) => {
      if (type === EventType.PRESS) {
        console.log("usuario tocou a notificacao", detail.notification);
      } else {
      }
    });
  }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title="Enviar notificacao" onPress={displayNotification} />
      <Button title="Agendar notificacao" onPress={scheduleNotification} />
      <Button
        title="Listar notificacoes agendadas"
        onPress={listScheduleNotifications}
      />
    </View>
  );
}
