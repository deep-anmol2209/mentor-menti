import React, { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import ServiceCard from "../../components/ServiceCard";
import service from "../../apiManager/service";
import { Button, Input, Modal, Form, Spin, Select, DatePicker, TimePicker } from "antd";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import useUserStore from "../../store/user";
import dayjs from "dayjs";

const Services = () => {
  const [services, setServices] = useState([]); // State to hold services
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [editingService, setEditingService] = useState(null); // State to track which service is being edited
  const [loading, setLoading] = useState(true); // State to track loading status
  const { setUser, user: mentorData } = useUserStore(); // To fecth mentor id from userState

  const { Option } = Select;
  // const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
  const courseType = Form.useWatch("courseType", form);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const mentorId = mentorData._id;
        if (!mentorId) {
          toast.error("Mentor ID is missing. Please login again.");
          return;
        }
        const response = await service.getServicesByMentor(mentorId);
        setServices(response?.data?.service || []);
      } catch (error) {
        console.error("Error fetching mentor services:", error);
        toast.error("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      if (editingService) {
        const { active, availability = [], fixedStartTime, fixedEndTime, fromDate, toDate, ...rest } = editingService;

        form.setFieldsValue({
          ...rest,
          active: String(active),
          availability: availability.map((slot) => ({
            ...slot,
            startTime: slot.startTime ? dayjs(slot.startTime, "HH:mm") : null,
            endTime: slot.endTime ? dayjs(slot.endTime, "HH:mm") : null,
          })),
          fixedStartTime: fixedStartTime ? dayjs(fixedStartTime, "HH:mm") : null,
          fixedEndTime: fixedEndTime ? dayjs(fixedEndTime, "HH:mm") : null,
          fromDate: fromDate ? dayjs(fromDate, "YYYY-MM-DD") : null,
          toDate: toDate ? dayjs(toDate, "YYYY-MM-DD") : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [editingService, form, isModalVisible]);

  const convertToAvailabilityObject = (slots) => {
    return slots.reduce((acc, { day, startTime, endTime }) => {
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push({ startTime, endTime });
      return acc;
    }, {});
  };

  const formatFormValues = (values) => {
    if (values.courseType === "fixed-course") {
      // ignore availability
      delete values.availability;
    } else if (values.courseType === "one-on-one") {
      // ignore fixed-course fields
      delete values.fromDate;
      delete values.toDate;
      delete values.fixedDays;
      delete values.fixedStartTime;
      delete values.fixedEndTime;
    }

    if (values.availability) {
      values.availability = values.availability.map((slot) => ({
        ...slot,
        startTime: slot.startTime.format("HH:mm"),
        endTime: slot.endTime.format("HH:mm"),
      }));
    }

    if (values.fixedStartTime) {
      values.fixedStartTime = values.fixedStartTime.format("HH:mm");
    }

    if (values.fixedEndTime) {
      values.fixedEndTime = values.fixedEndTime.format("HH:mm");
    }
    console.log(values);
    

    const rawSlots = values.availability.map((slot) => ({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    const formattedAvailability = convertToAvailabilityObject(rawSlots);
    values.availability = formattedAvailability;
    console.log(values);

    return values;
  };

  // Handle creating a new service
  const handleCreateService = async (values) => {
    setLoading(true);
    setEditingService(null);

    const formattedValues = formatFormValues(values);

    try {
      const response = await service.createService(formattedValues);
      setServices((prevServices) => [...prevServices, response?.data?.service]);
      setIsModalVisible(false);
      toast.success("Service created successfully!");
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Failed to create service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing an existing service
  const handleEditService = async (values) => {
    setLoading(true);
    const serviceId = editingService?._id;

    const formattedValues = formatFormValues(values);

    // if (values.courseType === "fixed-course") {
    //   // ignore availability
    //   delete values.availability;
    // } else if (values.courseType === "one-on-one") {
    //   // ignore fixed-course fields
    //   delete values.fromDate;
    //   delete values.toDate;
    //   delete values.fixedDays;
    //   delete values.fixedStartTime;
    //   delete values.fixedEndTime;
    // }
    // console.log(values);

    // if (values.availability) {
    //   values.availability = values.availability.map(slot => ({
    //     ...slot,
    //     startTime: slot.startTime.format("HH:mm"),
    //     endTime: slot.endTime.format("HH:mm"),
    //   }));
    // }

    // if (values.fixedStartTime) {
    //   values.fixedStartTime = values.fixedStartTime.format("HH:mm");
    // }

    // if (values.fixedEndTime) {
    //   values.fixedEndTime = values.fixedEndTime.format("HH:mm");
    // }

    try {
      const response = await service.editService(serviceId, formattedValues);

      setServices((prevServices) => prevServices.map((service) => (service._id === serviceId ? response?.data?.service : service)));

      setIsModalVisible(false);
      toast.success("Service updated successfully!");
    } catch (error) {
      console.error("Error editing service:", error);
      toast.error("Failed to update service. Please try again.");
    } finally {
      setEditingService(null); // Move this here after update
      setLoading(false);
    }
  };

  // Handle opening the modal for editing a service
  const handleEdit = (service) => {
    setEditingService(service);
    setIsModalVisible(true);
  };

  const onServiceStatus = (value) => {
    switch (value) {
      case "true":
        form.setFieldsValue({ note: "Service Active" });
        break;
      case "false":
        form.setFieldsValue({ note: "Service Disabled" });
        break;
      default:
    }
  };

  return (
    <Dashboard>
      <div className='p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-semibold'>Your Services</h2>
          <Button
            type='primary'
            onClick={() => setIsModalVisible(true)}
          >
            <FiPlus className='inline-block mr-2' /> Add New
          </Button>
        </div>

        {/* Modal for creating or editing services */}
        <Modal
          title={editingService ? "Edit Service" : "Create New Service"}
          open={isModalVisible}
          onCancel={() => {
            form.resetFields();
            setEditingService(null);
            setIsModalVisible(false);
          }}
          footer={null}
        >
          <Form
            form={form}
            onFinish={editingService ? handleEditService : handleCreateService}
          >
            {/* Service name block */}
            <Form.Item
              label='Service Name'
              name='serviceName'
              rules={[{ required: true, message: "Please enter the service name!" }]}
            >
              <Input />
            </Form.Item>

            {/* Description block */}
            <Form.Item
              label='Description'
              name='description'
              rules={[{ required: true, message: "Please enter the service description!" }]}
            >
              <Input.TextArea />
            </Form.Item>

            {/* Duration block */}
            <Form.Item
              label='Duration (mins)'
              name='duration'
              rules={[{ required: true, message: "Please enter the service duration!" }]}
            >
              <Input type='number' />
            </Form.Item>

            {/* Course type block */}
            <Form.Item
              name='courseType'
              label='Course Type'
              rules={[{ required: true, message: "Please select any one course type!" }]}
            >
              <Select placeholder='Select course type'>
                <Option value='one-on-one'>One-on-One</Option>
                <Option value='fixed-course'>Fixed Course</Option>
              </Select>
            </Form.Item>

            {/* Price block */}
            <Form.Item
              label='Price (INR)'
              name='price'
              rules={[{ required: true, message: "Please enter the service price!" }]}
            >
              <Input type='number' />
            </Form.Item>

            {/* Status block */}
            <Form.Item
              name='active'
              label='Status'
            >
              <Select
                placeholder='Select service status (Active/Disabled)'
                onChange={onServiceStatus}
              >
                <Option value='true'>Active</Option>
                <Option value='false'>Disable</Option>
              </Select>
            </Form.Item>

            {/* Availabilitiy block - One-on-One */}
            {courseType === "one-on-one" && (
              <>
                <Form.List name='availability'>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name }) => (
                        <div
                          key={key}
                          style={{ display: "flex", gap: "0.5rem" }}
                        >
                          <Form.Item name={[name, "day"]}>
                            <Select
                              placeholder='Select day'
                              style={{ width: 120 }}
                            >
                              {daysOfWeek.map((day) => (
                                <Option
                                  key={day}
                                  value={day}
                                >
                                  {day}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item name={[name, "startTime"]}>
                            <TimePicker format='HH:mm' />
                          </Form.Item>
                          <Form.Item name={[name, "endTime"]}>
                            <TimePicker format='HH:mm' />
                          </Form.Item>
                          <Button
                            onClick={() => remove(name)}
                            danger
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Form.Item>
                        <Button
                          type='dashed'
                          onClick={() => add()}
                          block
                        >
                          Add Time Slot
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </>
            )}

            {/* Fixed course */}
            {courseType === "fixed-course" && (
              <>
                <Form.Item
                  name='fromDate'
                  label='From Date'
                >
                  <DatePicker />
                </Form.Item>
                <Form.Item
                  name='toDate'
                  label='To Date'
                >
                  <DatePicker />
                </Form.Item>
                <Form.Item
                  name='fixedDays'
                  label='Days of the Week'
                >
                  <Select
                    mode='multiple'
                    placeholder='Select days'
                  >
                    {daysOfWeek.map((day) => (
                      <Option
                        key={day}
                        value={day}
                      >
                        {day}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name='fixedStartTime'
                  label='Start Time'
                >
                  <TimePicker format='HH:mm' />
                </Form.Item>
                <Form.Item
                  name='fixedEndTime'
                  label='End Time'
                >
                  <TimePicker format='HH:mm' />
                </Form.Item>
              </>
            )}

            <Button
              type='primary'
              htmlType='submit'
            >
              {editingService ? "Save Changes" : "Create Service"}
            </Button>
          </Form>
        </Modal>

        {/* Spinner to show loading status */}
        <Spin spinning={loading}>
          <div className='grid grid-cols-1 gap-6 mt-6 md:grid-cols-1 lg:grid-cols-2'>
            {/* Display the list of services */}
            {services?.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onEdit={() => handleEdit(service)}
              />
            ))}
          </div>
        </Spin>
      </div>
    </Dashboard>
  );
};

export default Services;
