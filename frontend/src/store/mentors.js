import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

const useMentorsStore = create()(
    devtools((set)=>({
        mentorsData:[],
        setMentorsData:(mentors)=>set(()=>({mentorsData:mentors}))
    }))
)

export default useMentorsStore;