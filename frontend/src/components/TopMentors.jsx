import React, { useState, useEffect } from "react";
import useMentorsStore from "../store/mentors";
import mentorApi from "../apiManager/mentor";
import MentorCard from "./MentorCard";
import { Button, Spin } from "antd";

const TopMentors = () => {
  const [loading, setLoading] = useState(false);
  const { mentorsData,setMentorsData } = useMentorsStore();


  const fetchAllMentors = async () => {
    try {
      setLoading(true);
      const response = await mentorApi.getTopMentors();
      const allMentors = response?.data?.topSelectedMentors || [];
      setMentorsData(allMentors);
      
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllMentors();
  }, []);

  return (
    <>
      <div className='w-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-2 md:p-10 '>
          {!loading ? (
            mentorsData.map((mentor) => {
              return (
                <MentorCard
                  mentor={mentor}
                  key={mentor?._id}
                />
              );
            })
          ) : (
            <div>
              <Spin/>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopMentors;
