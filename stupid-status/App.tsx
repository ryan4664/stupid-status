import React from "react";
import styled from "styled-components/native";
import { Text } from "react-native";

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

export default function App() {
  return (
    <Wrapper>
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
    </Wrapper>
  );
}
