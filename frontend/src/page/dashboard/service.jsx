import React, { useEffect, useState, useCallback } from "react";
// import Dashboard from "./dashboard";
import ServiceCard from "../../components/ServiceCard";
import service from "../../apiManager/service";
import { Button, Input, Modal, Form, Spin, Select, DatePicker, TimePicker } from "antd";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import useUserStore from "../../store/user";
import dayjs from "dayjs";

const { Option } = Select;
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: mentorData } = useUserStore();
  const [form] = Form.useForm();
  const courseType = Form.useWatch("courseType", form);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const mentorId = mentorData?._id;
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
  }, [mentorData]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (isModalVisible) {
      if (editingService) {
        const { active, availability = [], fixedStartTime, fixedEndTime, fromDate, toDate, ...rest } = editingService;
        
        // Transform availability for form
        const formAvailability = availability.flatMap(dateSlot => 
          dateSlot.timeSlots?.map(timeSlot => ({
            date: dateSlot.date ? dayjs(dateSlot.date) : null,
            startTime: timeSlot.startTime ? dayjs(timeSlot.startTime, "HH:mm") : null,
            endTime: timeSlot.endTime ? dayjs(timeSlot.endTime, "HH:mm") : null
          })) || []
        );

        form.setFieldsValue({
          ...rest,
          active: String(active),
          availability: formAvailability,
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

  const formatFormValues = useCallback((values) => {
    const formattedValues = { ...values };
    formattedValues.mentor = mentorData._id;

    if (formattedValues.courseType === "fixed-course") {
      delete formattedValues.availability;
      
      // Format fixed course dates
      if (formattedValues.fromDate) {
        formattedValues.fromDate = formattedValues.fromDate.format("YYYY-MM-DD");
      }
      if (formattedValues.toDate) {
        formattedValues.toDate = formattedValues.toDate.format("YYYY-MM-DD");
      }
      if (formattedValues.fixedStartTime) {
        formattedValues.fixedStartTime = formattedValues.fixedStartTime.format("HH:mm");
      }
      if (formattedValues.fixedEndTime) {
        formattedValues.fixedEndTime = formattedValues.fixedEndTime.format("HH:mm");
      }
    } 
    else if (formattedValues.courseType === "one-on-one") {
      delete formattedValues.fromDate;
      delete formattedValues.toDate;
      delete formattedValues.fixedDays;
      delete formattedValues.fixedStartTime;
      delete formattedValues.fixedEndTime;

      // Format availability for one-on-one
      if (formattedValues.availability) {
        formattedValues.availability = formattedValues.availability
          .filter(slot => slot.date && slot.startTime && slot.endTime)
          .map(slot => ({
            date: slot.date.format("YYYY-MM-DD"),
            timeSlots: [{
              startTime: slot.startTime.format("HH:mm"),
              endTime: slot.endTime.format("HH:mm")
            }]
          }));
      }
    }

    formattedValues.active = formattedValues.active === "true";
    return formattedValues;
  }, [mentorData]);

  const handleServiceSubmit = useCallback(async (values) => {
    setLoading(true);
    try {
      const formattedValues = formatFormValues(values);
      const isEditing = Boolean(editingService);

      // Validate based on course type
      if (formattedValues.courseType === "one-on-one" && 
          (!formattedValues.availability || formattedValues.availability.length === 0)) {
        throw new Error("Please add at least one availability slot for one-on-one courses");
      }

      if (isEditing) {
        const response = await service.editService(editingService._id, formattedValues);
        setServices(prev => prev.map(s => s._id === editingService._id ? response?.data?.service : s));
        toast.success("Service updated successfully!");
      } else {
        const response = await service.createService(formattedValues);
        setServices(prev => [...prev, response?.data?.service]);
        toast.success("Service created successfully!");
      }

      setIsModalVisible(false);
      setEditingService(null);
    } catch (error) {
      console.error(`Error ${editingService ? 'editing' : 'creating'} service:`, error);
      toast.error(error.message || `Failed to ${editingService ? 'update' : 'create'} service. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [editingService, formatFormValues]);

  const handleEdit = useCallback((service) => {
    setEditingService(service);
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    form.resetFields();
    setEditingService(null);
    setIsModalVisible(false);
  }, [form]);

  return (
   
    <div className="p-6 lg:mt-20 ">
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-semibold'>Your Services</h2>
          <Button
            type='primary'
            onClick={() => setIsModalVisible(true)}
            icon={<FiPlus className='inline-block mr-2' />}
          >
            Add New
          </Button>
        </div>

        <Modal
          title={editingService ? "Edit Service" : "Create New Service"}
          open={isModalVisible}
          onCancel={closeModal}
          footer={null}
          width={800}
          destroyOnClose
        >
          <Form
            form={form}
            onFinish={handleServiceSubmit}
            layout="vertical"
          >
            <Form.Item
              label='Service Name'
              name='serviceName'
              rules={[{ required: true, message: "Please enter the service name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Description'
              name='description'
              rules={[{ required: true, message: "Please enter the service description!" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label='Duration (minutes)'
              name='duration'
              rules={[{ required: true, message: "Please enter the service duration!" }]}
            >
              <Input type='number' min={1} />
            </Form.Item>

            <Form.Item
              name='courseType'
              label='Course Type'
              rules={[{ required: true, message: "Please select a course type!" }]}
            >
              <Select placeholder='Select course type'>
                <Option value='one-on-one'>One-on-One</Option>
                <Option value='fixed-course'>Fixed Course</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label='Price (INR)'
              name='price'
              rules={[{ required: true, message: "Please enter the service price!" }]}
            >
              <Input type='number' min={0} />
            </Form.Item>

            <Form.Item
              name='active'
              label='Status'
              initialValue="true"
            >
              <Select placeholder='Select service status'>
                <Option value='true'>Active</Option>
                <Option value='false'>Disabled</Option>
              </Select>
            </Form.Item>

            {courseType === "one-on-one" && (
              <Form.List name='availability'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        key={key}
                        className="flex gap-2 mb-2 items-end"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "date"]}
                          label="Date"
                          className="flex-1"
                          rules={[{ required: true, message: 'Select date' }]}
                        >
                          <DatePicker className="w-full" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "startTime"]}
                          label="Start Time"
                          className="flex-1"
                          rules={[{ required: true, message: 'Select start time' }]}
                        >
                          <TimePicker format='HH:mm' minuteStep={15} className="w-full" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "endTime"]}
                          label="End Time"
                          className="flex-1"
                          rules={[{ required: true, message: 'Select end time' }]}
                        >
                          <TimePicker format='HH:mm' minuteStep={15} className="w-full" />
                        </Form.Item>
                        <Button
                          onClick={() => remove(name)}
                          danger
                          className="mb-7"
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
                        icon={<FiPlus />}
                      >
                        Add Availability Slot
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            )}

            {courseType === "fixed-course" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name='fromDate'
                    label='Start Date'
                    rules={[{ required: true, message: 'Please select start date' }]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                  <Form.Item
                    name='toDate'
                    label='End Date'
                    rules={[{ required: true, message: 'Please select end date' }]}
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                </div>
                <Form.Item
                  name='fixedDays'
                  label='Days of the Week'
                  rules={[{ required: true, message: 'Please select at least one day' }]}
                >
                  <Select
                    mode='multiple'
                    placeholder='Select days'
                  >
                    {daysOfWeek.map(day => (
                      <Option key={day} value={day}>{day}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name='fixedStartTime'
                    label='Start Time'
                    rules={[{ required: true, message: 'Please select start time' }]}
                  >
                    <TimePicker format='HH:mm' minuteStep={15} className="w-full" />
                  </Form.Item>
                  <Form.Item
                    name='fixedEndTime'
                    label='End Time'
                    rules={[{ required: true, message: 'Please select end time' }]}
                  >
                    <TimePicker format='HH:mm' minuteStep={15} className="w-full" />
                  </Form.Item>
                </div>
              </>
            )}

            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              block
              size="large"
            >
              {editingService ? "Save Changes" : "Create Service"}
            </Button>
          </Form>
        </Modal>

        <Spin spinning={loading}>
          <div className='grid grid-cols-1 gap-6 mt-6 md:grid-cols-1 lg:grid-cols-2 lg:overflow-y-visible overflow-y-auto h-[calc(100vh-80px)] lg:h-auto'>
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onEdit={() => handleEdit(service)}
              />
            ))}
          </div>
        </Spin>
      </div>

  );
};

export default Services;