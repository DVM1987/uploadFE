import React, { useState } from "react";
import {
  Layout,
  Input,
  Button,
  List,
  Avatar,
  Divider,
  Comment,
  Tooltip,
  Form,
} from "antd";
import {
  SendOutlined,
  SmileOutlined,
  UserOutlined,
  SearchOutlined,
  EditOutlined, // Đảm bảo rằng bạn đã import EditOutlined
} from "@ant-design/icons";
import moment from "moment"; // Đảm bảo rằng bạn đã import moment
// import 'antd/dist/antd.css'; // Import CSS của Ant Design

const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;

const ChatMessage = ({ text, avatar, isMine, timestamp }) => (
  <Comment
    author={<a>{isMine ? "You" : "Other"}</a>}
    avatar={<Avatar src={avatar} />}
    content={<p>{text}</p>}
    datetime={
      <Tooltip title={moment(timestamp).format("YYYY-MM-DD HH:mm:ss")}>
        <span>{moment(timestamp).fromNow()}</span>
      </Tooltip>
    }
  />
);

const MessengerApp = () => {
  const [messages, setMessages] = useState([
    // Khởi tạo dữ liệu giả định cho các tin nhắn
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
      text: inputValue,
      avatar: "https://joeschmoe.io/api/v1/random",
      isMine: true,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  return (
    <Layout style={{ height: "100vh", background: "transparent"}}>
      <Layout>
        <Sider
          theme="light"
          width={300}
          style={{
            overflow: "auto",
            background: "#f0f2f5",
            borderRight: "1px solid #d9d9d9",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              
              backgroundColor: "#fff",
            }}
          >
            <h2>Title</h2>
            <EditOutlined />
          </div>
          <Input prefix={<SearchOutlined />} placeholder="Search..." />

          {/* Danh sách bạn bè hoặc cuộc hội thoại */}
          <List
            dataSource={
              [
                /* Dữ liệu người dùng hoặc cuộc hội thoại */
              ]
            }
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={<a href="#">{item.name}</a>}
                  description="Last message snippet..."
                />
              </List.Item>
            )}
          />
        </Sider>
        <Layout style={{ paddingLeft: "24px", paddingRight: "24px" }}>
          <Content
            style={{ padding: "24px 0", minHeight: 280, background: "#fff" }}
          >
            <List
              className="comment-list"
              itemLayout="horizontal"
              dataSource={messages}
              renderItem={(item) => (
                <li>
                  <ChatMessage
                    text={item.text}
                    avatar={item.avatar}
                    isMine={item.isMine}
                    timestamp={item.timestamp}
                  />
                </li>
              )}
            />
          </Content>
          <Footer
            style={{
              padding: "10px 20px",
              background: "#fff",
              borderTop: "1px solid #d9d9d9",
            }}
          >
            <Form.Item>
              <TextArea
                rows={4}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSend}
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
              >
                Send
              </Button>
            </Form.Item>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MessengerApp;
