"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import ErrorMsg from "../common/error-msg";
import icon from "@/assets/images/icon/icon_60.svg";
import { useAuth } from "@/context/AuthContext";

type IFormData = {
  name: string;
  email: string;
  password: string;
  agreed: boolean;
};

type Props = {
  role: "candidate" | "employer";
};

const RegisterForm = ({ role }: Props) => {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormData>();

  const onSubmit = async (data: IFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password, role);
      reset();
    } catch {
      // error already shown via toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Name*</label>
            <input
              type="text"
              placeholder="James Brower"
              {...register("name", { required: "Name is required!" })}
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.name?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input
              type="email"
              placeholder="james@example.com"
              {...register("email", { required: "Email is required!" })}
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.email?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-20">
            <label>Password*</label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter Password"
              className="pass_log_id"
              {...register("password", {
                required: "Password is required!",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            <span className="placeholder_icon" onClick={() => setShowPass(!showPass)}>
              <span className={`passVicon ${showPass ? "eye-slash" : ""}`}>
                <Image src={icon} alt="pass-icon" />
              </span>
            </span>
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.password?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="agreement-checkbox d-flex justify-content-between align-items-center">
            <div>
              <input
                type="checkbox"
                id="register-agree"
                {...register("agreed", { required: "You must agree to the terms" })}
              />
              <label htmlFor="register-agree">
                By hitting the Register button, you agree to the{" "}
                <a href="#">Terms conditions</a> &{" "}
                <a href="#">Privacy Policy</a>
              </label>
            </div>
          </div>
          <div className="help-block with-errors">
            <ErrorMsg msg={errors.agreed?.message!} />
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-eleven fw-500 tran3s d-block mt-20"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
