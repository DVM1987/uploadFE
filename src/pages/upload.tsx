import { Upload, Button, Card, List, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/login/loginSlice"; // import the logout action
import Cookies from "js-cookie";
import { persistor } from "../app/store";
import { useRouter } from "next/router";
import withAuth from "../hoc/withAuth";
import axios from "axios";
import Link from "next/link";

const UploadPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [fileList, setFileList] = React.useState([]);

  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76", // replace with your upload URL
    headers: {
      authorization: "authorization-text",
    },
    multiple: true, // allow multiple file selection
    beforeUpload: () => false, // prevent automatic upload
    onChange(info) {
      setFileList(info.fileList);
    },
  };

  const uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/upload-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const handleUpload = async () => {
    // Check if any files have been selected
    if (fileList.length === 0) {
      alert("Vui lòng chọn ít nhất một hình ảnh trước khi tải lên!");
      return;
    }
    const files = fileList.map((fileInfo) => fileInfo.originFileObj);
    // Check if all files are images
    const allFilesAreImages = files.every((file) =>
      file.type.startsWith("image/")
    );

    if (!allFilesAreImages) {
      alert("Phải là hình ảnh mới được upload!");
      return;
    }
    try {
      const response = await uploadImages(files);
      message.success("Upload thành công!!!!!", 3); // 3 seconds
      setFileList([]);

      setTimeout(() => {
        router.push("/SliderPage");
      }, response.processingTime * 1000); // navigate after processingTime seconds
    } catch (error) {
      message.error("Upload thất bại, vui lòng thử lại!");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      console.log("Logged out");

      persistor.purge();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px",
          backgroundColor: "#66CC99",
        }}
      >
        <Link href="/SliderPage">
        <Button style={{ backgroundColor: '#FFA07A', marginRight: '10px',fontSize:'15px',fontWeight :'bold' }}>Xem Hình</Button>
        </Link>
        <Button onClick={handleLogout}>Logout</Button>
      </header>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Card
          style={{
            width: 600,
            borderRadius: "15px",
            overflow: "auto",
          }}
        >
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select Files</Button>
          </Upload>
          <Button
            onClick={handleUpload}
            type="primary"
            style={{ marginTop: 16 }}
          >
            Upload
          </Button>
        </Card>
        <Card
          style={{
            width: 600,
            borderRadius: "15px",
            overflow: "auto",
            marginTop: 16,
          }}
        >
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={fileList}
            renderItem={(item) => (
              <List.Item
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "15px",
                  margin: "8px",
                }}
              >
                <img
                  src={URL.createObjectURL(item.originFileObj)}
                  alt="Selected"
                  style={{ width: "100%", borderRadius: "15px" }}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default withAuth(UploadPage);
