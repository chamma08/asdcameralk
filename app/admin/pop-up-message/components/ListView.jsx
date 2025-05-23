"use client"

import { usePopUpMessage, usePopupSettings } from "@/lib/firestore/pop-up message/read";
import { deleteMessage, setActivePopupMessage, togglePopupVisibility } from "@/lib/firestore/pop-up message/write";
import { Button, CircularProgress, Switch } from "@nextui-org/react";
import { Edit2, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ListView(){
  const { data: messages, error, isLoading } = usePopUpMessage();
  const { data: popupSettings, isLoading: settingsLoading } = usePopupSettings();
  const [isTogglingPopup, setIsTogglingPopup] = useState(false);

  const handleTogglePopup = async (show) => {
    setIsTogglingPopup(true);
    try {
      await togglePopupVisibility({ show });
      toast.success(`Popup ${show ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsTogglingPopup(false);
  };

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Message Images</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm">Show Popup:</span>
          <Switch
            isSelected={popupSettings?.showPopup || false}
            onValueChange={handleTogglePopup}
            isDisabled={isTogglingPopup || settingsLoading}
            size="sm"
          />
        </div>
      </div>
      
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2">Image</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Name
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-center">
              Status
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {messages?.map((item, index) => {
            return <Row index={index} item={item} key={item?.id} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

function Row({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingActive, setIsSettingActive] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    setIsDeleting(true);
    try {
      await deleteMessage({ id: item?.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/pop-up-message?id=${item?.id}`);
  };

  const handleSetActive = async () => {
    setIsSettingActive(true);
    try {
      await setActivePopupMessage({ id: item?.id });
      toast.success("Set as active popup message");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsSettingActive(false);
  };

  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <div className="flex justify-center">
          <img className="h-7 object-cover" src={item?.imageURL} alt="" />
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">{item?.name}</td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <div className="flex flex-col gap-1">
          {item?.showInPopup && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Active Popup
            </span>
          )}
          {item?.isActive && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Enabled
            </span>
          )}
          {!item?.isActive && !item?.showInPopup && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              Inactive
            </span>
          )}
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 items-center">
          <Button
            onClick={handleSetActive}
            isLoading={isSettingActive}
            isDisabled={isDeleting || isSettingActive}
            isIconOnly
            size="sm"
            color={item?.showInPopup ? "success" : "default"}
            variant={item?.showInPopup ? "solid" : "bordered"}
          >
            <Eye size={13} />
          </Button>
          <Button
            onClick={handleUpdate}
            isDisabled={isDeleting || isSettingActive}
            isIconOnly
            size="sm"
          >
            <Edit2 size={13} />
          </Button>
          <Button
            onClick={handleDelete}
            isLoading={isDeleting}
            isDisabled={isDeleting || isSettingActive}
            isIconOnly
            size="sm"
            color="danger"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  );
}