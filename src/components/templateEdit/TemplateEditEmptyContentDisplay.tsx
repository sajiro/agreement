import { Text } from '@fluentui/react/lib/Text';
import { CSSProperties } from 'react';

export const errorTextStyling: CSSProperties = {
  margin: "auto",
  textAlign: "center",
  paddingTop: 124,
  width: 250
}

function TemplateEditEmptyContentDisplay({ message }: { message: string; }) {
  return (
    <div style={errorTextStyling}>
      <Text block>{message}</Text>
    </div>
  );
}

export default TemplateEditEmptyContentDisplay;