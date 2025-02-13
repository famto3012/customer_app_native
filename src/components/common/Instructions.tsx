import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { FC, useEffect, useRef, useState } from "react";
import { scale, verticalScale } from "@/utils/styling";
import { Microphone, StopCircle, Trash } from "phosphor-react-native";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Input from "../Input";
import { getRecordingPermissions } from "@/utils/helpers";
import { Audio } from "expo-av";
import Typo from "../Typo";

const Instructions: FC<{
  placeholder: string;
  onRecordComplete: (data: string) => void;
  onChangeText: (data: string) => void;
}> = ({ placeholder, onRecordComplete, onChangeText }) => {
  const textInstruction = useRef<string>("");
  const [voiceInstruction, setVoiceInstruction] = useState<string | null>(null);
  const [voiceRecording, setVoiceRecording] = useState<Audio.Recording | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    onChangeText(textInstruction?.current);
  }, [textInstruction]);

  const startRecording = async () => {
    const hasPermission = await getRecordingPermissions();
    if (!hasPermission) return;

    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setVoiceRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.log(`Error while starting recording voice: ${error}`);
    }
  };

  const stopRecording = async () => {
    try {
      if (voiceRecording) {
        await voiceRecording.stopAndUnloadAsync();
        const uri = voiceRecording.getURI();
        if (uri) {
          setVoiceInstruction(uri);
          setIsRecording(false);
          onRecordComplete(uri);
        }
      }
    } catch (error) {
      console.log(`Error while stopping recording voice: ${error}`);
    }
  };

  const playRecording = async () => {
    if (voiceInstruction) {
      const { sound } = await Audio.Sound.createAsync({
        uri: voiceInstruction,
      });
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const deleteVoice = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
    setVoiceInstruction(null);
    onRecordComplete("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.instructionContainer}>
        <Input placeholder={placeholder} />
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={styles.micContainer}
        >
          {isRecording ? (
            <StopCircle color={colors.WHITE} />
          ) : (
            <Microphone color={colors.WHITE} />
          )}
        </TouchableOpacity>
      </View>

      {voiceInstruction && (
        <View style={styles.instructionContainer}>
          <Pressable
            style={styles.audioContainer}
            onPress={isPlaying ? stopPlayback : playRecording}
          >
            <Typo size={14} color={colors.PRIMARY}>
              {isPlaying ? "Stop Playback" : "Play Recording"}
            </Typo>
          </Pressable>

          <Pressable onPress={() => deleteVoice()} style={styles.deleteBtn}>
            <Trash color={colors.RED} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Instructions;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    gap: spacingY._10,
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  micContainer: {
    height: verticalScale(45),
    backgroundColor: colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(10),
    borderRadius: radius._10,
  },
  audioContainer: {
    padding: scale(8),
    backgroundColor: colors.PRIMARY_LIGHT,
    height: verticalScale(45),
    justifyContent: "center",
    borderRadius: radius._10,
    marginBottom: verticalScale(10),
    flex: 1,
  },
  deleteBtn: {
    marginTop: verticalScale(-10),
    padding: scale(8),
    backgroundColor: colors.LIGHT_RED,
    height: verticalScale(45),
    justifyContent: "center",
    borderRadius: radius._10,
  },
});
