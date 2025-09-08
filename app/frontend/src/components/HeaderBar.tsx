import { Button, Layout } from "antd";

import LogoText from "./LogoText";

const Header = Layout.Header;

const HeaderBar = () => {
  return (
    <Header>
      <div className="wtd-header-hello">HELLO, USERNAME :D</div>
      <div className="wtd-header-logo">
        <LogoText />
      </div>
      <Button className="wtd-header-signout">SIGN OUT</Button>
    </Header>
  );
};

export default HeaderBar;
