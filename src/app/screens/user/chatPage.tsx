import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { GiftedChat } from "react-native-gifted-chat";
import { scale, SCREEN_HEIGHT } from "@/utils/styling";
import { colors } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";

const chatPage = () => {
  const [messages, setMessages] = useState<any>([]);
  const { agentId } = useLocalSearchParams();
  console.log("AgentId", agentId);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT",
        createdAt: new Date(),
        quickReplies: {
          type: "radio", // or 'checkbox',
          keepIt: true,
          values: [
            {
              title: "😋 Yes",
              value: "yes",
            },
            {
              title: "📷 Yes, let me show you with a picture!",
              value: "yes_picture",
            },
            {
              title: "😞 Nope. What?",
              value: "no",
            },
          ],
        },
        user: {
          _id: 2,
          name: "React Native",
        },
      },
      {
        _id: 2,
        text: "This is a quick reply. Do you love Gifted Chat? (checkbox)",
        createdAt: new Date(),
        quickReplies: {
          type: "checkbox", // or 'radio',
          values: [
            {
              title: "Yes",
              value: "yes",
            },
            {
              title: "Yes, let me show you with a picture!",
              value: "yes_picture",
            },
            {
              title: "Nope. What?",
              value: "no",
            },
          ],
        },
        user: {
          _id: 2,
          name: "React Native",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages: any) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <ScreenWrapper>
      <Header title="Chat Page" />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        }}
        isScrollToBottomEnabled
        keyboardShouldPersistTaps="always"
        // isTyping={state.isTyping}
        inverted={Platform.OS !== "web"}
        infiniteScroll
        minComposerHeight={SCREEN_HEIGHT * 0.06}
      />
    </ScreenWrapper>
  );
};

export default chatPage;

const styles = StyleSheet.create({});
