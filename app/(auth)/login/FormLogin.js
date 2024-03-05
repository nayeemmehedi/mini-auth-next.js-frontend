"use client";

import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";


import { postDataLogin } from "../../fetch";
import { ColorChange } from "../../utls/ColorChange";


const FormLogin = () => {
  const [searchValue, setsearchValue] = useState("/");

  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.get("search");
    setsearchValue(search);
  }, []);

  console.log("searchValue", searchValue);

  const mainRouter = searchValue ?? "/";

  const [successValue, setLogin] = useState({
    success: false,
    loading: false,
    error: false,
  });

  const router = useRouter();

  const onFinish = async (values) => {
    try {
      const value = await postDataLogin(values);
      console.log("login", value);

      Cookies.set("accessToken", value.data?.accessTokenValue);
      Cookies.set("refreshToken", value.data?.refreshTokenValue);

      localStorage.setItem("accessToken", value.data?.accessTokenValue);
      localStorage.setItem("refreshToken", value.data?.refreshTokenValue);
      if (value.statusCode == 200) {
        setLogin({
          success: true,
          loading: false,
          error: false,
        });
        // redirect("/")

        setTimeout(() => {
          router.push(mainRouter);
        }, 2000);
      } else {
        setLogin({
          success: false,
          loading: false,
          error: true,
        });
      }
    } catch (error) {
      console.log(error.message);
      console.log(error);

      alert("Error");
    }
  };

  return (
    <div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="email"
          label={<ColorChange>User Email</ColorChange>}
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="email"
          />
        </Form.Item>

        <Form.Item
          label={<ColorChange>Password</ColorChange>}
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

       

        <div className="flex justify-between">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
          <Link href="/signup">
            <div className="text-amber-500">
              <p> Or register now! </p>
            </div>
          </Link>
        </div>
      </Form>
      <div>
        <div>
          {successValue.success && !successValue.error ? (
            <p className="text-green-700 font-bold text-3xl">
              SuccessFull DONE
            </p>
          ) : !successValue.success && successValue.error ? (
            <p className="text-red-700 font-bold text-3xl">
              {"SignUp Failed .Try Again"}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default FormLogin;
