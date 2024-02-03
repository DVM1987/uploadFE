// pages/SliderPage.tsx

import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Image } from "antd";
import { useSelector, useDispatch } from "react-redux";
import withAuth from "../hoc/withAuth";
import ImageSlider from "@/components/ImageSlider";
import { fetchImages } from "../features/login/loginSlice";

const SliderPage = () => {
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const images = useSelector((state) => state.login.images) || [];
  const dispatch = useDispatch(); // Add this line

  useEffect(() => {
    dispatch(fetchImages()); // fetch the images when the component mounts
  }, [dispatch]);

  const handleOpen = (image) => {
    setSelectedImage(image);
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Row gutter={16} style={{ display: "flex", alignItems: "stretch" }}>
        {images.map((image, index) => (
          <Col
            span={6}
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "auto", // Đảm bảo chiều cao tự động điều chỉnh theo hình ảnh
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain", // Sử dụng 'contain' để đảm bảo toàn bộ ảnh hiện thị mà không bị cắt
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
                src={image}
                onClick={() => handleOpen(image)}
              />
            </div>
          </Col>
        ))}
      </Row>

      <Modal open={visible} onCancel={handleClose} footer={null}>
        <ImageSlider
          images={images}
          initialSlide={images.indexOf(selectedImage)}
        />
      </Modal>
    </div>
  );
};

export default withAuth(SliderPage);
