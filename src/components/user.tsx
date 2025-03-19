import { Avatar, Tooltip } from "@mui/material";

import React from "react";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  const nameParts = name.split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : name.substring(0, 2);

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}

const User = ({ name }: { name: string }) => {
  return (
    <Tooltip title={name}>
      <Avatar {...stringAvatar(name)} />
    </Tooltip>
  );
};

export default User;
