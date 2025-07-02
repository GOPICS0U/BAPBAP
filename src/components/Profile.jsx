import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Profile() {
  const { user } = useAuth0();

  return (
    <div>
      <img src={user.picture} alt="avatar" width="50" />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}