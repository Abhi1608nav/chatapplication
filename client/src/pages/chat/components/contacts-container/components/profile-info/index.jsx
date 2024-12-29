import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoLogOut, IoPowerSharp } from "react-icons/io5";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

const ProfileInfo = () => {
  const { userInfo,setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const  logout = async()=>{
    try {
        
        const response = await apiClient.post(LOGOUT_ROUTE,{},{ withCredentials: true});
        if(response.status===200)
        {   setUserInfo(null);
            toast.success("Logout Successfull");
            navigate('/auth');
        }

    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }
  }

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-12 relative ">
          <Avatar className=" h-12 w-12  rounded-full overflow-hidden ">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black "
              />
            ) : (
              <div
                className={` uppercase h-32 w-32 md:w-48 md:h-48 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <FiEdit2 className="text-purple-500 text-xl font-medium" 
                
                onClick={()=>navigate('/profile')}

                />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
              <p>Edit your profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <IoPowerSharp className="text-red-600 text-xl font-medium" 
                onClick={logout}
                />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
