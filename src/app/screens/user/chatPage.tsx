import {
  Alert,
  Image,
  Linking,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { GiftedChat } from "react-native-gifted-chat";
import { scale } from "@/utils/styling";
import { colors } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getChatMessages, sendChatMessages } from "@/service/orderService";
import Typo from "@/components/Typo";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { useSocket } from "@/service/socketProvider";

const chatPage = () => {
  const [messages, setMessages] = useState<any>([]);
  const { agentId, agentImage, agentPhone, agentName } = useLocalSearchParams();

  const queryClient = useQueryClient();

  const { token, userId } = useAuthStore.getState();
  const socket = useSocket();

  const { data, isLoading } = useQuery({
    queryKey: ["messages", agentId],
    queryFn: () => getChatMessages(agentId.toString()),
    enabled: !!token && !!agentId,
  });

  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      const formattedMessage = {
        _id: newMessage.id,
        text: newMessage.text,
        createdAt: new Date(newMessage.createdAt),
        user: {
          _id: newMessage.sender,
          name: newMessage.sender === userId ? "You" : agentName,
        },
      };

      setMessages((previousMessages: any[]) =>
        GiftedChat.append(previousMessages, [formattedMessage])
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage");
    };
  }, [socket]);

  useEffect(() => {
    if (data) {
      const formattedMessages = data.map((msg: any) => ({
        _id: msg.id,
        text: msg.text,
        createdAt: new Date(msg.createdAt),
        user: {
          _id: msg.sender,
          name: msg.sender === userId ? "You" : agentName,
        },
      }));

      setMessages(formattedMessages.reverse());
    }
  }, [data]);

  const handleSendMessage = useMutation({
    mutationKey: ["send-message"],
    mutationFn: (formData: FormData) => sendChatMessages(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", agentId],
      });
    },
  });

  const onSend = useCallback((newMessages: any[]) => {
    const formDataObject = new FormData();

    formDataObject.append("message", newMessages[0].text);
    formDataObject.append("recipientId", agentId.toString());

    setMessages((previousMessages: any[]) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    handleSendMessage.mutate(formDataObject);
  }, []);

  return (
    <ScreenWrapper>
      <Header
        title="Chat Page"
        showRightIcon
        icon={require("@/assets/icons/phone.webp")}
        iconStyle={{
          width: scale(30),
          height: scale(30),
        }}
        onPress={() => {
          const dialerUrl = `tel:${agentPhone}`;
          Linking.openURL(dialerUrl).catch((err) =>
            Alert.alert("Error", "Unable to open dialer")
          );
        }}
      />
      <View style={styles.agentDetailHeader}>
        {/* {agentImage ? (
          <Image
            source={{ uri: agentImage.toString() }}
            style={{
              width: SCREEN_WIDTH * 0.2,
              height: SCREEN_WIDTH * 0.2,
              borderRadius: scale(50),
              backgroundColor: colors.NEUTRAL200,
              marginBottom: scale(5),
            }}
            resizeMode="cover"
          />
        ) : ( */}
        <Image
          source={require("@/assets/images/default-user.webp")}
          style={styles.agentImage}
          resizeMode="cover"
        />
        {/* )} */}
        <Typo size={16} fontFamily="Medium" color={colors.NEUTRAL700}>
          {agentName}
        </Typo>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userId,
          name: "You",
        }}
        isScrollToBottomEnabled
        keyboardShouldPersistTaps="always"
        inverted={Platform.OS !== "web"}
        infiniteScroll
        minComposerHeight={SCREEN_HEIGHT * 0.06}
      />
    </ScreenWrapper>
  );
};

export default chatPage;

const styles = StyleSheet.create({
  agentDetailHeader: {
    marginHorizontal: scale(20),
    marginTop: scale(10),
    backgroundColor: colors.NEUTRAL100,
    maxHeight: SCREEN_HEIGHT * 0.2,
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
    padding: scale(15),
  },
  agentImage: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_WIDTH * 0.2,
    borderRadius: scale(50),
    backgroundColor: colors.PRIMARY,
    marginBottom: scale(5),
  },
});
