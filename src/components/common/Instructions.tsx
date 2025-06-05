import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { getRecordingPermissions } from "@/utils/helpers";
import { scale, verticalScale } from "@/utils/styling";
import { useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";
import { Microphone, StopCircle, Trash } from "phosphor-react-native";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import Input from "../Input";
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

  // This effect handles text input changes
  useEffect(() => {
    onChangeText(textInstruction?.current);
  }, [textInstruction]);

  // Function to stop and clean up all audio
  const cleanupAudio = useCallback(async () => {
    // Stop and unload sound
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      } catch (error) {
        console.log(`Error cleaning up sound: ${error}`);
      } finally {
        setSound(null);
        setIsPlaying(false);
      }
    }

    // Stop and unload recording
    if (voiceRecording) {
      try {
        await voiceRecording.stopAndUnloadAsync();
      } catch (error) {
        console.log(`Error cleaning up recording: ${error}`);
      } finally {
        setVoiceRecording(null);
        setIsRecording(false);
      }
    }
  }, [sound, voiceRecording]);

  // This runs when the screen loses focus (user navigates away)
  useFocusEffect(
    useCallback(() => {
      // Setup on focus

      // Cleanup when screen loses focus
      return () => {
        cleanupAudio();
      };
    }, [cleanupAudio])
  );

  // This runs when component unmounts
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  const startRecording = async () => {
    const hasPermission = await getRecordingPermissions();
    if (!hasPermission) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 0,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      // Make sure any existing recording is stopped
      if (voiceRecording) {
        await voiceRecording.stopAndUnloadAsync();
      }

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
      try {
        // Clean up previous sound instance
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.stopAsync();
            await sound.unloadAsync();
          }
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: voiceInstruction },
          { shouldPlay: false } // Don't play immediately
        );

        setSound(newSound); // Set sound state

        // Play the sound immediately
        await newSound.playAsync();
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.log(`Error playing recording: ${error}`);
        setIsPlaying(false);
      }
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        setIsPlaying(false);
      } catch (error) {
        console.log(`Error stopping playback: ${error}`);
      }
    }
  };

  const deleteVoice = async () => {
    await cleanupAudio();
    setVoiceInstruction(null);
    onRecordComplete("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.instructionContainer}>
        <Input
          placeholder={placeholder}
          onChangeText={(value) => onChangeText(value)}
        />
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

          <Pressable onPress={deleteVoice} style={styles.deleteBtn}>
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
