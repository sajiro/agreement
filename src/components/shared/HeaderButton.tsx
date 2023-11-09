import { CommandBarButton, IButtonProps } from "@fluentui/react";

function HeaderButton(props: IButtonProps) {
  return (
    <CommandBarButton
      style={{ background: "transparent", height: "100%" }}
      {...props}
    />
  );
}

export default HeaderButton;