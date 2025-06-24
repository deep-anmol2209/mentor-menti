import React, { useRef, useState, useEffect } from "react";
import { Avatar, Input, Modal, Form, Spin, message } from "antd";
import { AiOutlineUser, AiOutlineMail, AiFillLinkedin, AiFillGithub, AiFillTwitterCircle, AiFillFacebook, AiFillInstagram } from "react-icons/ai";
import Dashboard from "./dashboard";
import useUserStore from "../../store/user";
import userAPI from "../../apiManager/user";

const Profile = () => {
  const { setUser, user: mentorData } = useUserStore();
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const response = await userAPI.uploadImage(formData);
        setUser({ ...mentorData, photoUrl: response.data.photoUrl });
        await fetchAndSetUser();
      } catch (error) {
        console.error("Image upload failed", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchAndSetUser = async () => {
    const { data } = await userAPI.getUser();
    setUser(data.user);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (values) => {
    for(let link in values.social){
      if(link!==""){
        console.log(link);
        
      }
    }
    const updatedUserData = {
      name: values.name,
      tags: values.skills.split(",").map((tag) => tag.trim()),
      title: values.title,
      bio: values.bio,
      college: values.college,
      social: {
        linkedin: values.social?.linkedin,
        github: values.social?.github,
        twitter: values.social?.twitter,
        facebook: values.social?.facebook,
        instagram: values.social?.instagram,
      },
    };

    try {
      setLoading(true);
      const response = await userAPI.updateUser(updatedUserData);
      setUser(response?.data.user);
      message.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed", error);
      message.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar from initials
  const generateAvatarUrl = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=256`;
  };
console.log(mentorData);

  return (
    <Dashboard>
      <div className='flex flex-col items-center w-full min-h-screen p-10 bg-gradient-to-r from-teal-50 to-white'>
        <h2 className='mb-10 text-5xl font-bold text-center text-teal-600'>My Profile</h2>
        <div className='flex flex-col w-full max-w-5xl p-8 space-y-10 bg-white shadow-xl rounded-3xl'>
          <Spin spinning={loading}>
            <div className='flex justify-center'>
              <Avatar
                onClick={() => {
                  if (!loading) {
                    inputRef.current.click();
                  }
                }}
                size={180}
                src={mentorData?.photoUrl || generateAvatarUrl(mentorData?.name || "User")}
                className='border-4 border-teal-300 shadow-lg cursor-pointer transform hover:scale-110 transition-all'
              />
            </div>
          </Spin>

          <div className='text-center'>
            <h3 className='text-4xl font-semibold text-teal-700 uppercase'>{mentorData?.name}</h3>
            <p className='flex items-center justify-center mt-4 text-lg text-gray-700'>
              <AiOutlineMail className='mr-2 text-teal-500' />
              {mentorData?.email}
            </p>
            <p className='flex items-center justify-center mt-2 text-lg text-gray-700'>
              <AiOutlineUser className='mr-2 text-teal-500' />
              {mentorData?.profile?.title}
            </p>
            </div>
            <div className='mt-2 text-lg text-gray-700'><span className="text-xl text-teal-400">Tags:</span><div className="border border-teal-200 p-3 rounded-xl font-semibold text-2xl text-center"> {mentorData?.profile?.tags?.join(" | ")}</div></div>
            <div className='mt-4 text-lg text-gray-700'><span className="text-xl text-teal-400">Bio:</span><div className="border border-teal-200 p-5 rounded-xl text-xl text-justify"> {mentorData?.profile?.bio}</div></div>
            {mentorData?.profile?.college && <div className='mt-2 text-lg text-gray-700'><span className="text-xl text-teal-400">College:</span><div className="border border-teal-200 p-3 rounded-xl text-xl text-center"> {mentorData?.profile?.college}</div></div>}
          

          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='hidden'
            disabled={loading}
          />

          <h3 className='text-2xl font-semibold text-center text-teal-700'>Connect with Me</h3>
          <div className='flex justify-center mt-4 space-x-6'>
            <a
              href={`https://${mentorData?.profile?.social?.linkedin}` || "#"}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-110'
            >
              <AiFillLinkedin className='text-4xl' />
            </a>
            <a
              href={`https://${mentorData?.profile?.social?.github}` || "#"}
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-800 hover:text-gray-900 transition-transform transform hover:scale-110'
            >
              <AiFillGithub className='text-4xl' />
            </a>
            <a
              href={`https://${mentorData?.profile?.social?.twitter}` || "#"}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-500 transition-transform transform hover:scale-110'
            >
              <AiFillTwitterCircle className='text-4xl' />
            </a>
            <a
              href={mentorData?.profile?.social?.facebook || "#"}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-700 hover:text-blue-900 transition-transform transform hover:scale-110'
            >
              <AiFillFacebook className='text-4xl' />
            </a>
            <a
              href={`https://${mentorData?.profile?.social?.instagram}` || "#"}
              target='_blank'
              rel='noopener noreferrer'
              className='text-pink-600 hover:text-pink-800 transition-transform transform hover:scale-110'
            >
              <AiFillInstagram className='text-4xl' />
            </a>
          </div>

          <button
            className='w-full mt-10 text-lg bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all px-4 py-2'
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>

          <Modal
            title='Edit Profile'
            open={isEditing}
            onCancel={() => setIsEditing(false)}
            footer={null}
            className='rounded-lg shadow-lg'
          >
            <Form
              initialValues={{
                name: mentorData?.name,
                email: mentorData?.email,
                title: mentorData?.profile?.title,
                skills: mentorData?.profile?.tags?.join(", "),
                bio: mentorData?.profile?.bio,
                college: mentorData?.profile?.college,
                social: {
                linkedin:  mentorData?.profile.social.linkedin,
                github:    mentorData?.profile.social.github,
                twitter:   mentorData?.profile.social.twitter,
                instagram: mentorData?.profile.social.instagram,
                facebook: mentorData?.profile.social.facebook
                }
              }}
              onFinish={handleSubmit}
              layout='vertical'
            >
              <Form.Item
                label='Name'
                name='name'
                rules={[{ required: true }]}
              >
                <Input placeholder='Enter your name' />
              </Form.Item>
              {/* Name */}
              <Form.Item
                label='Name'
                name='name'
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder='Enter your name' />
              </Form.Item>

              {/* Title */}
              <Form.Item
                label='Title'
                name='title'
                rules={[{ required: true, message: "Please enter your title" }]}
              >
                <Input placeholder='Enter your title (e.g., Software Engineer)' />
              </Form.Item>

              {/* Skills */}
              <Form.Item
                label='Skills'
                name='skills'
                rules={[{ required: true, message: "Please enter your skills" }]}
              >
                <Input placeholder='Enter skills separated by commas' />
              </Form.Item>

              {/* Bio */}
              <Form.Item
                label='Bio'
                name='bio'
                rules={[{ required: true, message: "Please enter your bio" }]}
              >
                <Input.TextArea
                  placeholder='Write a short bio about yourself'
                  rows={4}
                />
              </Form.Item>

              {/* College */}
              <Form.Item
                label='College'
                name='college'
                rules={[{ required: true, message: "Please enter your college name" }]}
              >
                <Input placeholder='Enter your college name' />
              </Form.Item>

              {/* Social Links */}
              <Form.Item
                label='LinkedIn'
                name={["social", "linkedin"]}
              >
                <Input placeholder='Enter LinkedIn profile URL' />
              </Form.Item>
              <Form.Item
                label='GitHub'
                name={["social", "github"]}
              >
                <Input placeholder='Enter GitHub profile URL' />
              </Form.Item>
              <Form.Item
                label='Twitter'
                name={["social", "twitter"]}
              >
                <Input placeholder='Enter Twitter profile URL' />
              </Form.Item>
              <Form.Item
                label='Facebook'
                name={["social", "facebook"]}
              >
                <Input placeholder='Enter Facebook profile URL' />
              </Form.Item>
              <Form.Item
                label='Instagram'
                name={["social", "instagram"]}
              >
                <Input placeholder='Enter Instagram profile URL' />
              </Form.Item>

              {/* Submit Button */}
              <Form.Item>
                <button
                  type='submit'
                  className='w-full bg-teal-500 rounded-lg hover:bg-teal-600 py-2 text-xl text-white '
                >
                  Save Changes
                </button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </Dashboard>
  );
};

export default Profile;
