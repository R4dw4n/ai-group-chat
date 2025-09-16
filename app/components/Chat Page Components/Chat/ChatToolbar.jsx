"use client";
import { images } from "@/app/utilities/assets";
import { ConfigProvider, Form, Modal, theme } from "antd";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import GroupSettings from "./GroupSettings";
import {
  DeleteOutlined,
  LogoutOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { messages } from "@/app/utilities/messages";
import { groupsService } from "@/app/api/services/groupsService";
import { useRouter } from "next/navigation";

const { darkAlgorithm } = theme;

function ChatToolbar({
  chatId,
  group,
  members,
  setGroup,
  setMembers,
  setGroups,
}) {
  const { t } = useTranslation();
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const groupSettingsRef = useRef();
  const [moreSettingsOpen, setMoreSettingsOpen] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const router = useRouter();
  const { i18n } = useTranslation();
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (group.avatarUrl) {
      setFileList([{ url: group.avatarUrl }]);
    }
  }, []);

  const handleOpenGroupModal = () => {
    setOpenGroupModal(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setAddMembersOpen(false);
    setOpenGroupModal(false);
    if (groupSettingsRef.current && groupSettingsRef.current.cancelForm) {
      groupSettingsRef.current.cancelForm();
    }
  };

  const handleModalOk = () => {
    if (groupSettingsRef.current && groupSettingsRef.current.submitForm) {
      groupSettingsRef.current.submitForm();
    }
  };

  const handleFormSubmit = async (values) => {
    let groupName = null,
      avatar = null;
    try {
      setLoading(true);
      if (group.name !== values.name) {
        const res = await groupsService.rename(chatId, { name: values.name });
        groupName = res.data.name;
      }
      if (values.members.length > 0) {
        await groupsService.addUsers(chatId, { userIds: [...values.members] });
        const res = await groupsService.getMembers(chatId);
        setMembers([...res.data]);
      }
      if (isRemoved) {
        if (fileList.length > 0) {
          const res = await groupsService.addAvatar(chatId, {
            image: fileList[0].originFileObj,
          });
          avatar = URL.createObjectURL(fileList[0].originFileObj);
        }
      }
      setOpenGroupModal(false);
      setAddMembersOpen(false);
      setEditMode(false);
    } catch (error) {
      console.log("error", error);
      messages("error", error.response.data.message);
    } finally {
      setLoading(false);
      setInitialRender(false);
      setGroup((prev) => {
        let newGroup = {};
        if (groupName !== null) {
          newGroup.name = groupName;
        }
        if (avatar !== null) {
          newGroup.avatarUrl = avatar;
        }
        return {
          ...prev,
          ...newGroup,
        };
      });
    }
  };

  const toggleMoreSettings = () => {
    setMoreSettingsOpen(!moreSettingsOpen);
  };

  const deleteGroup = () => {
    groupsService.delete(chatId);
    router.push(`/${i18n.language}/chats`);
    setMoreSettingsOpen(false);
  };
  const leaveGroup = () => {
    groupsService.leave(chatId);
    router.push(`/${i18n.language}/chats`);
    setMoreSettingsOpen(false);
  };

  useEffect(() => {
    console.log('rendering', initialRender)
    if (initialRender) {
      return;
    }
    console.log('here changing groups', group)
    if (group) {
      setGroups((prevGroups) => {
        const groupIndex = prevGroups.findIndex((g) => g.id === chatId);
        if (groupIndex === -1) return prevGroups;
        let updatedGroups = [...prevGroups];
        updatedGroups[groupIndex] = { ...updatedGroups[groupIndex], ...group };

        // Reorder groups to put the group that received the message first
        const [movedGroup] = updatedGroups.splice(groupIndex, 1);
        updatedGroups = [movedGroup, ...updatedGroups];
        return updatedGroups;
      });
    }
  }, [initialRender]);

  return (
    <>
      <div className="h-16 p-4 w-full bg-dark-gray text-white">
        <div className="flex items-center justify-between h-full">
          <button className="cursor-pointer" onClick={handleOpenGroupModal}>
            <div className="flex items-center gap-2">
              <div className="overflow-hidden flex rounded-full w-12 h-12">
                {group?.avatarUrl && (
                  <Image
                    alt="profile-pic"
                    src={group?.avatarUrl}
                    width={48}
                    height={48}
                    unoptimized={!group?.avatarUrl.includes("etag")}
                  />
                )}
              </div>
              <h1 className="text-white text-lg font-bold">{group.name}</h1>
            </div>
          </button>
        </div>
      </div>
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        <Modal
          open={openGroupModal}
          title={
            <div className="flex items-center relative">
              <div className="text-white text-lg font-bold">
                {t("group_settings")}
              </div>
              <button
                className="cursor-pointer text-white/50 hover:!text-white hover:bg-white/10 rounded-sm absolute -top-1.5 py-1 px-1.5 flex items-center justify-center"
                style={{ insetInlineEnd: "32px" }}
                onClick={toggleMoreSettings}
              >
                <MoreOutlined className="text-xl font-bolder" />
              </button>
              {moreSettingsOpen && group.isAdmin && (
                <div className="absolute top-5 right-0 shadow-md shadow-gray rounded-sm py-2">
                  <button
                    className="cursor-pointer text-red-500/50 hover:text-red-500 hover:bg-white/10 rounded-sm py-1 px-1.5 flex items-center justify-center gap-2"
                    onClick={deleteGroup}
                  >
                    <DeleteOutlined className="text-sm font-bolder" />
                    <span className="text-sm font-bolder">
                      {t("delete_group")}
                    </span>
                  </button>
                </div>
              )}
              {moreSettingsOpen && !group.isAdmin && (
                <div className="absolute top-5 right-0 shadow-md shadow-gray rounded-sm py-2">
                  <button
                    className="cursor-pointer text-red-500/50 hover:text-red-500 hover:bg-white/10 rounded-sm py-1 px-1.5 flex items-center justify-center gap-2"
                    onClick={leaveGroup}
                  >
                    <LogoutOutlined className="text-sm font-bolder" />
                    <span className="text-sm font-bolder">
                      {t("leave_group")}
                    </span>
                  </button>
                </div>
              )}
            </div>
          }
          onCancel={handleCancel}
          onOk={handleModalOk}
          okText={t("ok")}
          cancelText={t("cancel")}
        >
          <GroupSettings
            ref={groupSettingsRef}
            group={group}
            members={members}
            editMode={editMode}
            setEditMode={setEditMode}
            handleFormSubmit={handleFormSubmit}
            addMembersOpen={addMembersOpen}
            setAddMembersOpen={setAddMembersOpen}
            fileList={fileList}
            setFileList={setFileList}
            setIsRemoved={setIsRemoved}
          />
        </Modal>
      </ConfigProvider>
    </>
  );
}

export default ChatToolbar;
