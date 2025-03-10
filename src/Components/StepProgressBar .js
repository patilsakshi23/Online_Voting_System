import React from 'react';
import styled from 'styled-components';

const ProgressIndicator = styled.div`
  margin-bottom: 40px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s ease;
  width: ${props => (props.step / (props.totalSteps - 1)) * 100}%;
`;

const StepIndicators = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StepDot = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => (props.active === "true" ? '#3498db' : '#ecf0f1')};
  color: ${props => (props.active === "true" ? 'white' : '#7f8c8d')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
`;

const StepLabel = styled.div`
  font-size: 12px;
  color: ${props => (props.active === "true" ? '#3498db' : '#7f8c8d')};
  text-align: center;
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
`;

// This component can be used in your Registration.js file
const StepProgressBar = ({ currentStep, steps }) => {
  return (
    <ProgressIndicator>
      <ProgressBar>
        <Progress step={currentStep} totalSteps={steps.length} />
      </ProgressBar>
      <StepIndicators>
        {steps.map((label, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <StepDot active={(index <= currentStep).toString()}>
              {index + 1}
            </StepDot>
            <StepLabel active={(index <= currentStep).toString()}>
              {label}
            </StepLabel>
          </div>
        ))}
      </StepIndicators>
    </ProgressIndicator>
  );
};

export default StepProgressBar;