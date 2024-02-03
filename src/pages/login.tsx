import { Form, Input, Button, Row, Col, Card, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { login, loginFulfilled } from "../features/login/loginSlice";
import Cookies from "js-cookie";
import Logo from "../../assets/logo.jpg"; // replace with the path to your logo
import backgroundImage from "../../assets/background.jpg"; // replace with the path to your background image
import CustomSpinner from "./Spinner";
import axios from "axios";

const checkLogin = async (token) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/auth/check",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading, error, isLoggedIn } = useSelector((state) => state.login);

  const router = useRouter();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/upload");
    } else {
      const token = Cookies.get("token");
      if (token) {
        checkLogin(token).then((user) => {
          if (user) {
            dispatch(loginFulfilled({ token }));
            router.push("/upload");
          } else {
            Cookies.remove("token");
          }
        });
      }
    }
  }, [dispatch, isLoggedIn, router]);

  const onFinish = (values) => {
    setShowSpinner(true);
    dispatch(login(values))
      .then((action) => {
        if (login.fulfilled.match(action)) {
          router.push("/upload");
        } else {
          message.error("There was an error logging in. Please try again.");
          setShowSpinner(false);
        }
      })
      .catch((error) => {
        console.error(error);
        message.error("There was an error logging in. Please try again.");
        setShowSpinner(false);
      });
  };

  if (showSpinner) {
    return <CustomSpinner />;
  }

  return (
    <div>
      <Row 
        justify="center"
        align="middle"
        style={{ minHeight: "100vh" }}
      >
        <Col>
          <Card
            
            style={{ width: 600,backgroundColor: '#FFFAF0' }}
            headStyle={{ borderBottom: "none" }}
          >
            <Form 
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your Username!" },
                ]}
                help={error}
                validateStatus={error ? "error" : ""}
              >
                <Input placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
                help={error}
                validateStatus={error ? "error" : ""}
              >
                <Input type="password" placeholder="Password" />
              </Form.Item>
              <Form.Item style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={loading === "loading"}
                >
                  {loading === "loading" ? <CustomSpinner /> : "Log in"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
