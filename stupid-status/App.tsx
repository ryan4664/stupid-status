import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Image, Animated, Easing } from "react-native";

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
  padding: 0 25px;
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
  font-family: "Roboto";
`;

const ButtonWrapper = styled.View`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StatusButton = styled.TouchableOpacity`
  background-color: ${Colours.EERIE_BLACK};
  width: 250px;
`;

const StatusButtonText = styled.Text`
  color: ${Colours.BONE_WHITE};
  text-align: center;
  font-size: 20px;
  border: 1px solid ${Colours.BONE_WHITE};
  border-radius: 20px;
  padding: 20px;
`;

interface IStatus {
  id: string;
  status: string;
}

export default function App() {
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const spinValue = new Animated.Value(0);
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });
  useEffect(() => {
    const getStatuses = async () => {
      setIsFetching(true);
      let result = await fetch(
        "http://dummy.restapiexample.com/api/v1/employees"
      ).then(response => response.json());

      setIsFetching(true);
      // console.log(result);
    };
    getStatuses();

    // First set up animation

    // Second interpolate beginning and end values (in this case 0 and 1)

    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  return (
    <Wrapper>
      {isFetching ? (
        <Animated.Image
          style={{ width: 300, height: 300, transform: [{ rotate: spin }] }}
          source={require("./assets/logo.png")}
        />
      ) : (
        <>
          <LogoWrapper>
            <StatusText>Stupid Status</StatusText>
          </LogoWrapper>
          <StatusWrapper>
            <StatusText>Status here!</StatusText>
          </StatusWrapper>
          <ButtonWrapper>
            <StatusButton>
              <StatusButtonText>Get New Status</StatusButtonText>
            </StatusButton>
          </ButtonWrapper>
        </>
      )}
    </Wrapper>
  );
}
