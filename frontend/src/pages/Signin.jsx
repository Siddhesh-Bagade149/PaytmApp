import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-96 text-center p-2 h-max px-4">
          <Heading label={"Sign-In"} />
          <SubHeading
            content={"Have and account? Enter your informationn to login"}
          />
          <InputBox
            label={"Email-id"}
            placeholder={"xyz@gmail.com"}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <InputBox
            label={"Password"}
            placeholder={"********"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            onClick={async () => {
              const response = await axios.post(
                "http://localhost:3000/api/v1/user/signin",
                {
                  username,
                  password,
                }
              );
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("firstName", response.data.firstName);
              navigate("/dashboard");
            }}
            label={"Sign-In"}
          />
          <BottomWarning
            buttonText={"Signup"}
            label={"Not a user, Signup now"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
