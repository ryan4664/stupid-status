import React, { useEffect, useRef, useState } from "react";
import { Animated, Clipboard, Easing, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

enum Colours {
  EERIE_BLACK = "#19191D",
  BONE_WHITE = "#D8DBE2"
}

const Wrapper = styled.View`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${Colours.EERIE_BLACK};
  padding: 0 10px;
`;

const LogoWrapper = styled.View`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StatusWrapper = styled.View`
  display: flex;
  flex: 2;
  justify-content: center;
`;

const StatusText = styled.Text`
  color: ${Colours.BONE_WHITE};
  font-size: 50px;
  text-align: center;
  font-weight: 200;
`;

const ButtonWrapper = styled.View`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StatusButton = styled.TouchableOpacity`
  margin-top: 25px;
  background-color: ${Colours.EERIE_BLACK};
  width: 250px;
`;

const StatusInput = styled.TextInput`
  background-color: transparent;
  border-bottom-width: 1px;
  border-color: ${Colours.BONE_WHITE};
  color: ${Colours.BONE_WHITE};
  width: 250px;
  font-size: 20px;
`;

const StatusButtonText = styled.Text`
  color: ${Colours.BONE_WHITE};
  text-align: center;
  font-size: 20px;
  border: 1px solid ${Colours.BONE_WHITE};
  border-radius: 20px;
  padding: 20px;
`;

const SafeAreaViewWrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Colours.EERIE_BLACK};
`;

interface IStatus {
  id: number;
  message: string;
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      //@ts-ignore
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function App() {
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [currentStatus, setCurrentStatus] = useState<IStatus>(null);
  const [tapCount, setTapCount] = useState<number>(0);
  const spinValue = new Animated.Value(0);
  const [showCreateView, setShowCreateView] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });
  const animation = Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
      easing: Easing.linear
    })
  );

  const getStatuses = async () => {
    setIsFetching(true);
    let result = await fetch(
      "https://bi3sgnb6a4.execute-api.us-east-1.amazonaws.com/stupidstatus/status"
    ).then(response => {
      return response.json();
    });
    let parsedResult: IStatus[] = JSON.parse(result.body).map(x => ({message: x.message.S, id: x.StatusId.S}));
    setStatuses(parsedResult);
    setCurrentStatus(
      parsedResult[Math.floor(Math.random() * parsedResult.length)]
    );
    setIsFetching(false);
  };

  useEffect(() => {
    if (!showCreateView) {
      getStatuses();
    }
  }, [showCreateView]);

  useEffect(() => {
    if (isFetching) {
      animation.start();
    } else {
      animation.stop();
    }
  }, [isFetching]);

  const getNewStatus = () => {
    setTapCount(0);
    if (currentStatus) {
      let index = statuses.findIndex(x => x.id === currentStatus.id);
      let newStatuses = [...statuses];
      newStatuses.splice(index, 1);
      if (newStatuses.length > 0) {
        setStatuses([...newStatuses]);
        setCurrentStatus(
          newStatuses[Math.floor(Math.random() * newStatuses.length)]
        );
      } else {
        getStatuses();
      }
    }
  };

  const copyToClipboard = async () => {
    if (currentStatus) {
      await Clipboard.setString(
        `${currentStatus.message} \n\From Stupid Status`
      );
      alert("Copied!");
    }
  };

  const createNewStatus = async () => {
    if (newStatus) {
      setIsFetching(true);
      let result = await fetch(
        "https://bi3sgnb6a4.execute-api.us-east-1.amazonaws.com/stupidstatus/status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: newStatus })
        }
      );
      if (result.status === 200) {
        setNewStatus(null);
      }
      setIsFetching(false);
    }
  };

  useInterval(() => {
    if (!showCreateView) {
      setTapCount(0);
    }
  }, 10000);

  useEffect(() => {
    if (tapCount === 10) {
      setShowCreateView(true);
    }
  }, [tapCount]);

  return (
    <SafeAreaProvider>
      <SafeAreaViewWrapper>
        <Wrapper>
          {isFetching ? (
            <Animated.Image
              style={{ width: 300, height: 300, transform: [{ rotate: spin }] }}
              source={require("./assets/logo.png")}
            />
          ) : showCreateView ? (
            <>
              <LogoWrapper>
                <TouchableOpacity
                  onPress={() => setTapCount(tapCount + 1)}
                  activeOpacity={1}
                >
                  <StatusText>Stupid Status</StatusText>
                </TouchableOpacity>
              </LogoWrapper>
              <StatusWrapper>
                <StatusInput
                  onChangeText={text => setNewStatus(text)}
                  value={newStatus}
                  autoCompleteType="off"
                />
              </StatusWrapper>
              <ButtonWrapper>
                <StatusButton onPress={createNewStatus}>
                  <StatusButtonText>Create</StatusButtonText>
                </StatusButton>
                <StatusButton onPress={() => setShowCreateView(false)}>
                  <StatusButtonText>Back</StatusButtonText>
                </StatusButton>
              </ButtonWrapper>
            </>
          ) : (
            <>
              <LogoWrapper>
                <TouchableOpacity
                  onPress={() => setTapCount(tapCount + 1)}
                  activeOpacity={1}
                >
                  <StatusText>Stupid Status</StatusText>
                </TouchableOpacity>
              </LogoWrapper>
              <StatusWrapper>
                <StatusText>{currentStatus.message}</StatusText>
              </StatusWrapper>
              <ButtonWrapper>
                <StatusButton onPress={copyToClipboard}>
                  <StatusButtonText>Copy</StatusButtonText>
                </StatusButton>
                <StatusButton onPress={getNewStatus}>
                  <StatusButtonText>Get New Status</StatusButtonText>
                </StatusButton>
              </ButtonWrapper>
            </>
          )}
        </Wrapper>
      </SafeAreaViewWrapper>
    </SafeAreaProvider>
  );
}
