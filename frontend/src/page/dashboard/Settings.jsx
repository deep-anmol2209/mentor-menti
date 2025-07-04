import React, { useState } from "react";
// import Dashboard from "./dashboard";
import { Input, Modal, Form } from "antd";
import userAPI from "@/apiManager/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [form] = Form.useForm();

  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };



const handleUpdatePassword = async (values) => {
  try {
    if (values.newPassword !== values.confirmNewPassword) {
      toast.error("New password and confirm password must match.");
      return;
    }

    const data = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };

    const loadingToast = toast.loading("Updating password...");
    
    await userAPI.changePassword(data);

    toast.dismiss(loadingToast);
    toast.success("Password updated successfully!");

    setIsEditing(false);
    form.resetFields();
  } catch (error) {
    toast.dismiss();
    console.error("Error updating password:", error);
    const errorMsg = error?.response?.data?.message || "Failed to update password.";
    toast.error(errorMsg);
  }
};


  return (
<>
      <div className="w-full lg:mt-20">
        <div className="w-full h-32 bg-gray-200 flex justify-center items-center">
          <h1 className="text-4xl font-extrabold text-teal-600">Settings</h1>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-200" />
        <div className="p-6 flex flex-col">
          <div
            className="w-full bg-teal-50 py-3 px-5 rounded-xl hover:bg-teal-100 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <p>Change Password</p>
          </div>
        </div>
      </div>

      <Modal
        title="Update Password"
        open={isEditing}
        onCancel={() => {
          setIsEditing(false);
          form.resetFields();
        }}
        footer={null}
        className="rounded-lg shadow-lg"
      >
        <Form form={form} onFinish={handleUpdatePassword} layout="vertical">
          <Form.Item
            label="Current Password"
            name="oldPassword"
            rules={[
              { required: true, message: "Current Password is Required" },
            ]}
          >
            <Input.Password
              type={passwordVisibility.newPassword ? "text" : "password"}
              placeholder="Enter current password here"
              iconRender={() => (
                <FontAwesomeIcon
                  icon={passwordVisibility.newPassword ? faEyeSlash : faEye}
                  onClick={() => togglePasswordVisibility("oldPassword")}
                  className="cursor-pointer"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true , message: "New Password is Required" }]}
          >
            <Input.Password
              type={passwordVisibility.newPassword ? "text" : "password"}
              placeholder="Enter new password here"
              iconRender={() => (
                <FontAwesomeIcon
                  icon={passwordVisibility.newPassword ? faEyeSlash : faEye}
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="cursor-pointer"
                />
              )}
            minLength={6}
            />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmNewPassword"
            rules={[
              { required: true, message: "Confirm Password is Required" },
            ]}
          >
            <Input.Password
              type={passwordVisibility.confirmNewPassword ? "text" : "password"}
              placeholder="Enter confirm password here"
              iconRender={() => (
                <FontAwesomeIcon
                  icon={
                    passwordVisibility.confirmNewPassword ? faEyeSlash : faEye
                  }
                  onClick={() => togglePasswordVisibility("confirmNewPassword")}
                  className="cursor-pointer"
                />
              )}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <button
              type="submit"
              className="w-full bg-teal-500 rounded-lg hover:bg-teal-600 py-2 text-xl text-white "
            >
              Update
            </button>
          </Form.Item>
        </Form>
      </Modal>
</>
  );
};

export default Settings;
