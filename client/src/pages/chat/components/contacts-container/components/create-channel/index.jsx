import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import {
    CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChannel = () => {
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
    addChannel,
  } = useAppStore();

  const [newChannelModal, setNewChannelModal] = useState(false);
  const [searchedContacts, setsearchedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setselectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    console.log("inside the creatChannel");
    console.log(channelName,selectedContacts);
    try {
        if(channelName.length>0 && selectedContacts.length>0)
        {   
            console.log("apiCall");
            const response = await apiClient.post(CREATE_CHANNEL_ROUTE,{name:channelName,
                members:selectedContacts.map((contact)=>contact.value),
            },{withCredentials:true});

            if(response.status === 201)
            {
                setChannelName("");
                setselectedContacts([]);
                setNewChannelModal(false);
                addChannel(response.data.channel)
            }

        }
        

    } catch (error) {
        
        console.log({error});

    }

  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90  text-sm hover:text-white-100 cursor-pointer duration-300 transition-all"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] text-white border-none mb-2 p-3">
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel.
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              className=" rounded-lg p-6 bg-[#2c2e3b] border-none "
              onChange={(e) => {
                setChannelName(e.target.value);
              }}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector 
            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white "
            defaultOptions={allContacts}
            placeholder = "Search Contacts"
            value = {selectedContacts}
            onChange={setselectedContacts}
            emptyIndicator={
                <p className="text-center text-md leading-10 text-gray-600 " >No result found</p>
            }
            
            /> 
          </div>

          <div>
            <Button
              className=" w-full bg-purple-700  hover:bg-purple-900  transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
